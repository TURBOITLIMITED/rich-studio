'use client';

import { useEffect } from 'react';

/**
 * The scroll motion, measured off maisonauge.com rather than guessed at.
 *
 * Three behaviours, all on the image inside a clipped frame:
 *
 *   1. ENTRY — the image starts at scale(1.2) while it is still below the
 *      fold and eases to scale(1.1) as it arrives. Their reveal is a
 *      settle, not a fade: opacity stayed pinned at 1.00 through every
 *      sample I took, so fading in here would read as a different site.
 *
 *   2. PARALLAX — once settled at 1.1 the image drifts vertically inside
 *      its frame as it crosses the viewport. The 10% overscale is what
 *      buys the room: a 400px frame has 40px of slack, so the drift runs
 *      to about ±5% of frame height. Measured travel was 25-44px on
 *      frames of 398-566px, which is that number.
 *
 *   3. DIRECTION ALTERNATES — adjacent images drift opposite ways on
 *      their site. That is the detail that stops a column of frames
 *      reading as one sheet of wallpaper, and it is cheap to keep.
 *
 * One rAF loop drives every frame on the page. Per-element scroll
 * listeners at ~190 images would be a jank machine; an IntersectionObserver
 * keeps the active set small and the loop only touches what is on screen.
 */

type Frame = {
  el: HTMLElement;
  img: HTMLElement;
  dir: number;
};

const SETTLED = 1.1;
const ENTER = 1.2;
/** Fraction of frame height the image is allowed to travel, each way. */
const DRIFT = 0.05;

export default function ScrollMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    if (!nodes.length) return;

    const frames: Frame[] = nodes.map((el, i) => {
      const img = el.querySelector<HTMLElement>('img, video');
      return { el, img: img ?? el, dir: i % 2 === 0 ? 1 : -1 };
    });

    const active = new Set<Frame>();
    const byEl = new Map<Element, Frame>(frames.map((f) => [f.el, f]));

    /**
     * One formula, used by the loop AND when a frame leaves the active
     * set. Parking a frame at a fixed transform instead was the bug in
     * the first cut: below the fold it sat at the SETTLED scale, so
     * arriving meant jumping up to 1.14 and easing back down — the
     * reverse of the intended settle — and leaving snapped the drift
     * back to zero, which showed the moment you scrolled up again.
     */
    const apply = (f: Frame) => {
      const r = f.el.getBoundingClientRect();
      if (!r.height) return;
      const vh = window.innerHeight;

      // 0 when the frame's top edge is one viewport below the fold,
      // 1 when its bottom edge has left the top.
      const raw = (vh - r.top) / (vh + r.height);
      const p = raw < 0 ? 0 : raw > 1 ? 1 : raw;

      // Entry runs over the first fifth of that journey: 1.2 settling to 1.1.
      const entry = p < 0.2 ? p / 0.2 : 1;
      const eased = 1 - Math.pow(1 - entry, 3);
      const scale = ENTER + (SETTLED - ENTER) * eased;

      // Drift is centred: -half at the bottom of the pass, +half at the top.
      const travel = r.height * DRIFT * f.dir;
      const y = (p - 0.5) * 2 * travel;

      f.img.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const f = byEl.get(e.target);
          if (!f) continue;
          if (e.isIntersecting) active.add(f);
          else {
            active.delete(f);
            // Settle it at the state it actually belongs in, not a
            // fixed one, so re-entry is continuous.
            apply(f);
          }
        }
      },
      { rootMargin: '40% 0px 40% 0px' },
    );
    frames.forEach((f) => io.observe(f.el));

    // Everything starts in its true state, so nothing pops on first paint.
    frames.forEach(apply);

    let raf = 0;
    const tick = () => {
      for (const f of active) apply(f);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return null;
}
