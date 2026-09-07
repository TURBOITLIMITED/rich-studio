'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { WorkItem } from '@/lib/work';

/* How many plates are in the air at once. Ten is the study's number and it
   is about right: enough that the corridor never looks empty, few enough
   that every one of them is a real <img> the browser has to composite in
   3D. The archive is 31 — putting all of them in here would be 31
   composited layers for a section you pass through in two seconds. */
const SLABS = 10;

/* How far back the furthest plate starts, and how far the whole set
   travels. The set has to clear the camera by the end or plates are still
   visibly in the air when the corridor unpins. */
const STEP_Z = 620;
const TRAVEL = SLABS * STEP_Z + 800;

/**
 * THE CORRIDOR.
 *
 * The archive comes at you: plates arranged around a ring, receding into
 * the distance, flown past the camera as you scroll, while the page title
 * grows through them.
 *
 * It carries the h1 itself rather than sitting above a separate header —
 * the page gets one held moment instead of a corridor and then a title.
 *
 * Opacity is computed from each plate's own z on every update rather than
 * tweened: a plate has to fade UP as it arrives from the far distance and
 * OFF as it passes the camera, and those are two different ramps on one
 * value that a single tween cannot express.
 *
 * Under reduced motion nothing is created: the deck is left hidden by CSS
 * and the title simply sits at its finished size. The archive below is
 * the content; this is an entrance to it.
 */
export default function DepthCorridor({
  items,
  count,
}: {
  items: WorkItem[];
  count: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = root.current;
    const pinEl = pin.current;
    const deckEl = deck.current;
    const titleEl = title.current;
    if (!el || !pinEl || !deckEl || !titleEl) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const slabs = gsap.utils.toArray<HTMLElement>('.cor-slab', deckEl);
      if (slabs.length === 0) return;

      const narrow = window.innerWidth < 820;
      const ringX = narrow ? 110 : 300;
      const ringY = narrow ? 110 : 200;

      slabs.forEach((s, i) => {
        const ang = (i / slabs.length) * Math.PI * 2;
        gsap.set(s, {
          x: Math.cos(ang) * ringX,
          y: Math.sin(ang) * ringY,
          z: -i * STEP_Z,
          /* Seeded off the index, not random(): a random tilt re-rolls on
             every refresh, so a resize visibly re-shuffles the deck. */
          rotate: ((i * 37) % 19) - 9,
          opacity: 0,
        });
      });

      const far = -SLABS * STEP_Z;

      gsap.to(slabs, {
        z: `+=${TRAVEL}`,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          pin: pinEl,
          pinType: 'transform',
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            /* z is COMPUTED from the trigger's progress, not read back off
               the element. gsap.getProperty(el,'z') did not return what was
               actually rendered here — the fade-in ramp worked off it, but
               the past-the-camera cutoff never fired, so plates that had
               already flown by hung in front of the title at full opacity
               (measured: z 1527 and 907 both still at opacity 1).

               Each plate's depth is exactly its start plus the distance
               travelled so far, so there is nothing to read. */
            const travelled = self.progress * TRAVEL;
            slabs.forEach((s, i) => {
              const z = -i * STEP_Z + travelled;
              /* Dark in the far distance, gone once past the camera, and a
                 1600-deep ramp between. */
              const o =
                z < far || z > 500
                  ? 0
                  : gsap.utils.clamp(0, 1, (z - far) / 1600);
              gsap.set(s, { opacity: o });
            });
          },
        },
      });

      gsap.fromTo(
        titleEl,
        { scale: 0.8 },
        {
          scale: 1.35,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.7,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [items.length]);

  return (
    <div className="pin-host">
      <section ref={root} className="corridor">
        <div ref={pin} className="cor-pin">
          <div ref={deck} className="cor-deck" aria-hidden="true">
            {items.slice(0, SLABS).map((w) => (
              <figure key={w.slug} className="cor-slab">
                <img src={w.thumb} alt="" className="cor-fill" loading="lazy" decoding="async" />
                <figcaption className="t-mono cor-cap">{w.client}</figcaption>
              </figure>
            ))}
          </div>

          <h1 ref={title} className="t-display cor-title">
            ALL WORK
            <span className="cor-count">({count})</span>
          </h1>
        </div>
      </section>
    </div>
  );
}
