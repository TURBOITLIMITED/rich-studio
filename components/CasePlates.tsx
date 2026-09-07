'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RegisteredImage from '@/components/RegisteredImage';

/**
 * THE PRESS BED.
 *
 * One plate is locked on the bed while the run of sheets and the brief
 * pass it. Pressing a sheet pulls it onto the bed — the image changes,
 * the bed does not move.
 *
 * Why a pin and not `position: sticky`: #smooth-content is transformed by
 * ScrollSmoother, and sticky inside a transformed ancestor tracks the
 * TRANSFORM rather than the viewport, so it simply scrolls away. The
 * combination that actually reproduces sticky here is ScrollTrigger with
 * `pinType:'transform'` AND `pinSpacing:false` — with default spacing it
 * reserves the hold in the flow and leaves a band of empty page beneath.
 *
 * The `.pin-host` wrapper is not decoration: ScrollTrigger reparents what
 * it pins into a generated `.pin-spacer`, and React then unmounts against
 * a parent that is no longer there and throws on removeChild — a blank
 * destination page. The host is a node React owns and ScrollTrigger never
 * touches.
 *
 * Under reduced motion no pin is created at all: the plate simply sits at
 * the top of its column and the page scrolls normally. The sheet picker
 * still works, so nothing is lost but the hold.
 */
export default function CasePlates({
  images,
  client,
  description,
}: {
  images: { src: string }[];
  client: string;
  description: string;
}) {
  const [active, setActive] = useState(0);
  const section = useRef<HTMLElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const run = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = section.current;
    const plateEl = plate.current;
    const runEl = run.current;
    if (!sec || !plateEl || !runEl) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // The bed only makes sense while the two columns sit side by side.
    if (!window.matchMedia('(min-width: 901px)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const headH = () =>
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--head-h'),
      ) || 72;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: () => `top ${Math.round(headH() + 24)}px`,
        // Held for exactly as long as the copy beside it runs, so the bed
        // releases on the last line rather than on a guessed distance.
        endTrigger: runEl,
        end: 'bottom bottom',
        pin: plateEl,
        pinType: 'transform',
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
    }, sec);

    return () => ctx.revert();
  }, [images.length]);

  if (images.length === 0) return null;

  const total = String(images.length).padStart(2, '0');
  const current = images[active] ?? images[0];

  return (
    <div className="pin-host">
      <section ref={section} className="cs-bed sheet grid12">
        <div ref={plate} className="cs-bed-plate">
          {/* Keyed on src so swapping a sheet mounts a new set of ink
              plates rather than re-registering the old ones in place. */}
          <RegisteredImage
            key={current.src}
            src={current.src}
            alt={`${client} — sheet ${String(active + 1).padStart(2, '0')} of ${total}`}
            className="cs-bed-img"
            sizes="(max-width: 900px) 100vw, 58vw"
            priority
          />
          <span className="t-mono cs-bed-folio" aria-hidden="true">
            {String(active + 1).padStart(2, '0')} / {total}
          </span>
        </div>

        <div ref={run} className="cs-bed-run">
          <span className="t-mono cs-label">
            <span className="target" aria-hidden="true" /> SHEETS
          </span>

          {/* A radiogroup, not a list of links: pressing one changes what is
              on the bed, it does not navigate. */}
          <ul className="cs-bed-sheets" role="list">
            {images.map((img, i) => (
              <li key={img.src} className="cs-bed-sheet">
                <button
                  type="button"
                  className="cs-bed-pick"
                  aria-current={i === active}
                  aria-label={`Sheet ${String(i + 1).padStart(2, '0')} of ${total}`}
                  onClick={() => setActive(i)}
                >
                  <RegisteredImage
                    src={img.src}
                    alt=""
                    className="cs-bed-thumb"
                    sizes="12vw"
                  />
                  <span className="t-mono cs-bed-thumb-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <span className="t-mono cs-label cs-bed-brief-label">
            <span className="target" aria-hidden="true" /> BRIEF
          </span>
          <p className="t-statement cs-copy cs-bed-copy" data-split>
            {description}
          </p>
        </div>
      </section>
    </div>
  );
}
