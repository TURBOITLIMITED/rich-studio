'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDropTransition } from './DropTransition';
import { thumbSet, type WorkItem } from '@/lib/work';

/**
 * THE REEL.
 *
 * The work runs sideways while the page is held, and each plate drifts
 * inside its own frame as it crosses — the parallax is what stops a row of
 * cards reading as a slideshow.
 *
 * The travel is measured, not guessed: the track is moved by exactly its
 * own overflow (scrollWidth - viewport), and the trigger ends after that
 * many pixels of scrolling, so the reel advances 1:1 with the wheel and
 * finishes exactly as the last card lands. Both are functions so
 * invalidateOnRefresh can re-measure them when the viewport or the fonts
 * change the track's width.
 *
 * NOT pinned on touch or under reduced motion. A hijacked horizontal
 * scroll on a phone fights the browser's own gesture and strands people
 * mid-reel; there it is a plain scroll-snap row instead, which is the
 * behaviour the estate settled on for the earlier depth carousel. Nothing
 * is lost — the same cards, swiped rather than scrolled.
 */
export default function WorkReel({ items }: { items: WorkItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const drop = useDropTransition();

  useEffect(() => {
    const el = root.current;
    const pinEl = pin.current;
    const trackEl = track.current;
    if (!el || !pinEl || !trackEl) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(min-width: 901px)').matches) return;
    /* EXCLUDE coarse rather than REQUIRE fine. Requiring `(pointer: fine)`
       looks equivalent and is not: a browser that reports no pointer
       capability at all — headless Chrome does, and it is not alone —
       answers false to both, and the desktop path would be silently
       skipped on a 1440px screen. Only an actual touch pointer should get
       the swipe row. */
    if (window.matchMedia('(pointer: coarse)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    el.dataset.reelPinned = 'true';

    const ctx = gsap.context(() => {
      /* Measured against the PIN's own width, not the viewport: the pin is
         what the track is being dragged across, and using innerWidth
         quietly ignores any scrollbar. The page margin is added back so
         the run ends on the margin rather than flush to the edge.

         Both this and the tween's x read it as functions, so
         invalidateOnRefresh re-evaluates them — which matters because the
         first measurement can be taken before the row has its final
         width, and the reel then stops short of the last card forever. */
      const dist = () =>
        Math.max(
          0,
          trackEl.scrollWidth -
            pinEl.clientWidth +
            parseFloat(getComputedStyle(trackEl).paddingRight || '0'),
        );

      const st = {
        trigger: el,
        start: 'top top',
        end: () => `+=${dist()}`,
        scrub: 0.5,
        invalidateOnRefresh: true,
      } as const;

      gsap.to(trackEl, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          ...st,
          pin: pinEl,
          pinType: 'transform',
          anticipatePin: 1,
        },
      });

      /* Each plate drifts the other way inside its frame. fromTo, not to:
         with a scrubbed trigger a plain .to() re-reads the current value
         as its start on every refresh and quietly becomes a no-op. */
      gsap.utils.toArray<HTMLElement>('.reel-fill', el).forEach((f) => {
        gsap.fromTo(
          f,
          { xPercent: -8 },
          { xPercent: 8, ease: 'none', scrollTrigger: st },
        );
      });
    }, el);

    /* Re-measure once the row is actually laid out. Everything above reads
       the track's width through functions, but ScrollTrigger only
       re-evaluates them on a refresh — so without this the reel keeps
       whatever the first measurement said and stops short of the last
       card. Measured before this was added: it settled at -2290 against a
       true overflow of 2391 and left the last card 177px off screen.

       Images are the thing that settles late, so wait for them rather
       than for a timer. */
    const imgs = Array.from(trackEl.querySelectorAll('img'));
    let done = 0;
    const settle = () => {
      done += 1;
      if (done >= imgs.length) ScrollTrigger.refresh();
    };
    const pending = imgs.filter((i) => !i.complete);
    pending.forEach((i) => {
      i.addEventListener('load', settle, { once: true });
      i.addEventListener('error', settle, { once: true });
    });
    if (pending.length === 0) ScrollTrigger.refresh();
    else done = imgs.length - pending.length;

    return () => {
      delete el.dataset.reelPinned;
      pending.forEach((i) => {
        i.removeEventListener('load', settle);
        i.removeEventListener('error', settle);
      });
      ctx.revert();
    };
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="pin-host">
      <section ref={root} className="reel" aria-label="Featured work">
        <div ref={pin} className="reel-pin">
          <div ref={track} className="reel-track">
            {items.map((w, i) => (
              <article key={w.slug} className="reel-card">
                <Link
                  href={`/work/${w.slug}`}
                  className="reel-link"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                    e.preventDefault();
                    drop(
                      `/work/${w.slug}`,
                      e.currentTarget.querySelector<HTMLElement>('.reel-frame'),
                      w.thumb,
                    );
                  }}
                >
                  <div className="reel-frame">
                    <img
                      src={w.thumb}
                      srcSet={thumbSet(w.thumb)}
                      /* The fill is 128% of a card that is 32vw, so it
                         paints about 41vw of the screen on desktop. */
                      sizes="(max-width: 900px) 90vw, 41vw"
                      alt={`${w.client} — ${w.title}`}
                      className="reel-fill"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="reel-cap">
                    <span className="t-mono t-mono-b reel-num">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="t-caps reel-title">{w.title}</span>
                    <span className="t-mono reel-facet">
                      {[...w.disciplines, ...w.industries].slice(0, 2).join(' / ')}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
