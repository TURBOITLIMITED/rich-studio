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
/** A scatter tile that drifts at its own rate. `base` is its untransformed
 *  position in the scroll container, cached once so the per-frame maths
 *  never reads a rect it has itself just transformed — that feeds back and
 *  the tile runs away down the page. */
type Drifter = {
  el: HTMLElement;
  factor: number;
  base: number;
  /** Cursor-parallax factor, signed. See MOUSE below. */
  mx: number;
  /** Current eased offset, lerped toward the target each frame. */
  cx: number;
  cy: number;
};

const SETTLED = 1.1;
const ENTER = 1.2;
/** Fraction of the run over which the scale finishes: 400px of 860px. */
const SCALE_RUN = 0.45;
const RISE = 40;

/* THE SCATTER BAND'S OWN MOTION, and the one place this file's "no
   continuous drift" rule is deliberately broken.
   Everywhere else that rule is right: the reference settles an image and
   stops, and drifting every frame reads as a different site. The scatter
   band is not that. Its tiles overlap, and Rich asked for them "all moving
   about" — the point is that they move RELATIVE TO EACH OTHER, so the
   overlaps open and close as you scroll and the pile reads as depth rather
   than as a flat collage. A single shared rate would move them in lockstep
   and look like nothing at all.
   Amplitude is per-tile, signed, set as data-drift. 64px at the extremes
   is roughly a fifth of a NARROW tile's height — visible without anything
   appearing to come loose from the page. */
const DRIFT = 64;

/* MOUSE. Measured off the reference rather than invented, after a first
   pass wrongly concluded it had no cursor motion at all — that test moved
   the pointer in ONE jump, which does not produce the incremental
   mousemove events the effect needs. Swept properly in 40 steps, all nine
   of its tiles move.
   What it does: a linear parallax off the viewport centre. Each tile has
   its own SIGNED factor, so some travel with the cursor and some against
   it and the overlaps shear. Measured factors across its nine tiles:
   -0.069, +0.024, -0.069, +0.038, -0.021, +0.038, -0.021, -0.048, +0.015,
   with the vertical consistently ~0.8x the horizontal. At the corners that
   is 9-43px of travel. Ours use the same range and the same 0.8 ratio.
   Eased rather than snapped: the raw value jitters with the pointer. */
const MOUSE_Y_RATIO = 0.8;
/** How fast the eased offset chases the cursor. 0.08 is ~12 frames to
 *  close most of the gap — enough to feel attached without whipping. */
const EASE = 0.08;

export default function ScrollMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const frames: Frame[] = Array.from(
      document.querySelectorAll<HTMLElement>('[data-parallax]'),
    ).map((el) => {
      const img = el.querySelector<HTMLElement>('img, video');
      return { el, img: img ?? el };
    });
    const scroller = document.querySelector<HTMLElement>('[data-scroll-root]');

    const drifters: Drifter[] = Array.from(
      document.querySelectorAll<HTMLElement>('[data-drift]'),
    ).map((el) => ({
      el,
      factor: parseFloat(el.dataset.drift || '0') || 0,
      mx: parseFloat(el.dataset.mouse || '0') || 0,
      cx: 0,
      cy: 0,
      // Measured BEFORE anything is transformed, so it is the true resting
      // position. Re-measured on resize, where the vw layout changes.
      base: el.getBoundingClientRect().top + (scroller?.scrollTop ?? 0),
    }));

    const remeasure = () => {
      for (const d of drifters) {
        const held = d.el.style.transform;
        d.el.style.transform = 'none';
        d.base = d.el.getBoundingClientRect().top + (scroller?.scrollTop ?? 0);
        d.el.style.transform = held;
      }
    };

    /* Cursor position relative to the middle of the window. Only on a real
       pointer: a touch screen has no hover, and reading touch coordinates
       would jerk every tile on each tap. */
    const fine = window.matchMedia('(pointer: fine)').matches;
    let mouseX = 0;
    let mouseY = 0;
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX - window.innerWidth / 2;
      mouseY = e.clientY - window.innerHeight / 2;
    };
    if (fine) window.addEventListener('mousemove', onMove, { passive: true });

    const applyDrift = (d: Drifter) => {
      const vh = window.innerHeight;
      const top = d.base - (scroller?.scrollTop ?? 0);
      // +1 when the tile sits at the bottom of the window, -1 at the top,
      // so it travels the whole way across as the band is scrolled through.
      const q = Math.max(-1, Math.min(1, (top / vh) * 2 - 1));

      // Chase the cursor target rather than jump to it.
      const tx = fine ? d.mx * mouseX : 0;
      const ty = fine ? d.mx * MOUSE_Y_RATIO * mouseY : 0;
      d.cx += (tx - d.cx) * EASE;
      d.cy += (ty - d.cy) * EASE;

      const y = d.factor * DRIFT * q + d.cy;
      d.el.style.transform = `translate3d(${d.cx.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    };

    if (!frames.length && !drifters.length) return;

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
      drifters.forEach(applyDrift);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('resize', remeasure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('mousemove', onMove);
      io.disconnect();
    };
  }, []);

  return null;
}
