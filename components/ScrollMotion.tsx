'use client';

import { useEffect } from 'react';

/**
 * The only authored motion in the work: a per-image settle, keyed off the
 * image's own position on screen rather than off any project boundary.
 *
 * The curve is measured, not invented. Instrumenting maisonauge.com across
 * a full scroll, sampling the transform matrix on every image:
 *
 *   scale       1.200 -> 1.100   over ~400px  (~0.45 viewport heights)
 *   translateY   +40px -> 0      over ~860px  (~1.0  viewport height)
 *   opacity      1.000 throughout, 0 exceptions in ~1200 samples
 *
 * Three things in that are easy to get wrong and all three were wrong here
 * before:
 *
 *  - The rest state is scale(1.1), NOT 1. The zoom-out never returns to
 *    identity, which is why every frame clips a 10% oversized image.
 *  - There is no fade. Fading images in reads as a completely different
 *    site, and they measured opacity 1 at every sample.
 *  - There is no continuous parallax drift. The tx component of every
 *    sampled matrix was 0 and translateY rests at 0 — the vertical
 *    movement is an entry settle that finishes, not a drift that keeps
 *    going. An earlier cut of this file drifted every frame by +-5% of its
 *    height, which is motion the reference does not have.
 *
 * Progress is 0 when the frame's top is a full viewport below the fold and
 * 1 when it reaches the middle of the screen, so both curves complete as
 * the image crosses the mid-band.
 */

type Frame = { el: HTMLElement; img: HTMLElement };

const SETTLED = 1.1;
const ENTER = 1.2;
/** Fraction of the run over which the scale finishes: 400px of 860px. */
const SCALE_RUN = 0.45;
const RISE = 40;

export default function ScrollMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const frames: Frame[] = Array.from(
      document.querySelectorAll<HTMLElement>('[data-parallax]'),
    ).map((el) => {
      const img = el.querySelector<HTMLElement>('img, video');
      return { el, img: img ?? el };
    });
    if (!frames.length) return;

    const apply = (f: Frame) => {
      const r = f.el.getBoundingClientRect();
      if (!r.height) return;
      const vh = window.innerHeight;

      // 0 while the frame is still a viewport below the fold, 1 once its
      // top reaches the middle of the screen.
      const raw = (vh - r.top) / vh;
      const p = raw < 0 ? 0 : raw > 1 ? 1 : raw;

      const s = Math.min(1, p / SCALE_RUN);
      const easedS = 1 - Math.pow(1 - s, 3);
      const scale = ENTER + (SETTLED - ENTER) * easedS;

      const easedY = 1 - Math.pow(1 - p, 3);
      const y = RISE * (1 - easedY);

      f.img.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    };

    // Only frames near the viewport are worth touching; the observer keeps
    // the per-frame loop short on a page with 190 plates on it.
    const live = new Set<Frame>();
    const byEl = new Map<Element, Frame>();
    frames.forEach((f) => byEl.set(f.el, f));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const f = byEl.get(e.target);
          if (!f) continue;
          if (e.isIntersecting) live.add(f);
          else live.delete(f);
          // Settle it once on the way out too, so a frame that leaves the
          // observer's margin is left at the value it should hold rather
          // than frozen mid-curve.
          apply(f);
        }
      },
      { rootMargin: '60% 0px 60% 0px' },
    );
    frames.forEach((f) => io.observe(f.el));

    let raf = 0;
    const tick = () => {
      live.forEach(apply);
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
