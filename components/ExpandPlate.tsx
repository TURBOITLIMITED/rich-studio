'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { WorkItem } from '@/lib/work';

/**
 * THE PLATE COMING ON PRESS.
 *
 * One plate is held on the screen and grows from a small sheet to the full
 * bleed as you scroll through it, the image easing back to true size
 * inside it. The caption arrives once the plate is most of the way open.
 *
 * The scroll runway is the section's own height: `.exp-run` is 260svh and
 * the 100svh `.exp-pin` inside it is what gets held, so the growth is
 * scrubbed across 160svh of scrolling.
 *
 * pinType 'transform' because #smooth-content is transformed by
 * ScrollSmoother and a fixed pin cannot work inside it. Spacing is LEFT ON
 * here (unlike the band hook) — this section is meant to reserve its hold,
 * so what follows starts after the plate has finished opening.
 *
 * .pin-host is a node React owns: ScrollTrigger reparents what it pins
 * into a generated .pin-spacer, and React then unmounts against a parent
 * that has moved and throws on removeChild.
 *
 * Under reduced motion no trigger is created at all — the plate is simply
 * rendered open at full bleed with its caption showing, which is the state
 * the animation ends on. Nothing is lost but the movement.
 */
export default function ExpandPlate({ item }: { item: WorkItem }) {
  const root = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLImageElement>(null);
  const cap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const pinEl = pin.current;
    const plateEl = plate.current;
    const fillEl = fill.current;
    const capEl = cap.current;
    if (!el || !pinEl || !plateEl || !fillEl || !capEl) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* Closed state lives here, not in CSS, so the reduced-motion path
         can leave the CSS at its OPEN state and simply never run this. */
      gsap.set(plateEl, { width: '30vw', height: '37.5vw' });
      gsap.set(fillEl, { scale: 1.3 });
      gsap.set(capEl, { opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            pin: pinEl,
            pinType: 'transform',
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(plateEl, {
          width: '100vw',
          height: '100svh',
          ease: 'power2.inOut',
          duration: 1,
        })
        .to(fillEl, { scale: 1, ease: 'power2.inOut', duration: 1 }, 0)
        /* Late, at 0.72 rather than the study's 0.55: the caption is
           sized against the full measure, so it only reads once the
           plate is most of the way to full bleed. */
        .to(capEl, { opacity: 1, duration: 0.22 }, 0.72)
        .from(capEl.children, { y: 40, duration: 0.4, ease: 'power3.out' }, 0.72);
    }, el);

    return () => ctx.revert();
  }, [item.slug]);

  return (
    <div className="pin-host">
      <section ref={root} className="exp-run" aria-label={`Featured: ${item.title}`}>
        <div ref={pin} className="exp-pin">
          <div ref={plate} className="exp-plate">
            <img
              ref={fill}
              src={item.images[0]?.src ?? item.thumb}
              alt={`${item.client} — ${item.title}`}
              className="exp-fill"
            />

            {/* INSIDE the plate, not beside it. Sitting on the pin, the
                caption is laid out against the full viewport while the
                plate is still small, so the title hangs outside the image
                it belongs to. In here the plate's own overflow clips it. */}
            <div ref={cap} className="exp-cap sheet">
              <span className="t-mono exp-client">{item.client}</span>
              <h2 className="t-display exp-title">{item.title}</h2>
              <Link href={`/work/${item.slug}`} className="cta-square exp-cta">
                VIEW PROJECT
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
