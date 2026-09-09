'use client';

import { useEffect } from 'react';

/**
 * Keeps the fixed furniture legible against whatever is behind it, without
 * putting a plate behind it.
 *
 * Rich wants the band pinned to the foot of the viewport and clear — just
 * the text moving. That is a real problem on this archive, not a corner
 * case: measuring every file with scripts/luminance.py, 129 of 193 images
 * have a mean luminance below 0.45. A permanently black band is unreadable
 * on two thirds of his work.
 *
 * Flipping the WHOLE band to paper when the backdrop is dark does not work
 * either, and the measurement says why: a plate 1064px wide under a 1700px
 * band still leaves a third of the type sitting on paper. Whichever single
 * colour you pick, part of the line disappears.
 *
 * So the band does not pick a colour — it picks a colour PER REGION. Two
 * identical copies of the running text are stacked, one ink and one paper.
 * The paper copy is masked to exactly the horizontal ranges where a dark
 * plate is passing underneath, so each part of the line takes the colour
 * that reads against the thing behind it, and every join lands on a plate
 * edge, where there is already a hard edge. The mask is a linear-gradient
 * in viewport coordinates, built here and handed to CSS as --dark-mask.
 *
 * The two copies stay in step because CSS animations run off the document
 * timeline: identical animation, identical start, frame-locked. The mask
 * has to sit on a wrapper that does not move, never on the moving track,
 * or its coordinates would travel with the text.
 *
 * The mark is small enough to be all-or-nothing, so it takes the simpler
 * area-weighted answer.
 *
 * mix-blend-mode is the usual suggestion and it is wrong twice over here:
 * it needs the element to share a stacking context with what it blends
 * against, which fixed furniture does not, and white-on-difference over a
 * mid-grey backdrop resolves to mid grey — invisible — while a good part
 * of this archive is product shots on concrete.
 */

const PAPER = 0.94;
/** Below this a backdrop is dark enough that ink type dies on it. */
const FLIP = 0.45;

type Range = [number, number];

/**
 * The visible rect of a plate, allowing for clip-path.
 *
 * getBoundingClientRect() does NOT account for clipping, and during the
 * opening sequence the showreel is clipped to a zero-height slit while
 * still reporting its full box. The mark sits dead centre at that moment,
 * concluded it was over dark footage, and painted itself paper on paper —
 * invisible, at the exact moment it is meant to be introducing itself.
 */
function visibleRect(el: HTMLElement): DOMRect | null {
  const r = el.getBoundingClientRect();
  const clip = getComputedStyle(el).clipPath;
  if (!clip || clip === 'none' || !clip.startsWith('inset(')) return r;

  const parts = clip.slice(6, clip.indexOf(')')).trim().split(/\s+/);
  if (!parts.length) return r;
  const val = (raw: string, basis: number) => {
    const n = parseFloat(raw);
    if (Number.isNaN(n)) return 0;
    return raw.trim().endsWith('%') ? (n / 100) * basis : n;
  };
  // CSS shorthand: 1, 2, 3 or 4 values.
  const t = val(parts[0], r.height);
  const rt = val(parts[1] ?? parts[0], r.width);
  const b = val(parts[2] ?? parts[0], r.height);
  const l = val(parts[3] ?? parts[1] ?? parts[0], r.width);

  const top = r.top + t;
  const bottom = r.bottom - b;
  const left = r.left + l;
  const right = r.right - rt;
  if (bottom <= top || right <= left) return null;
  return new DOMRect(left, top, right - left, bottom - top);
}

function merge(ranges: Range[]): Range[] {
  if (!ranges.length) return [];
  const sorted = ranges.slice().sort((a, b) => a[0] - b[0]);
  const out: Range[] = [sorted[0]];
  for (const r of sorted.slice(1)) {
    const last = out[out.length - 1];
    if (r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else out.push(r);
  }
  return out;
}

export default function BackdropContrast() {
  useEffect(() => {
    const root = document.querySelector('[data-scroll-root]');
    let raf = 0;
    let queued = false;

    const measure = () => {
      queued = false;
      const rects: { r: DOMRect; lum: number }[] = [];
      for (const plate of document.querySelectorAll<HTMLElement>('[data-lum]')) {
        const r = visibleRect(plate);
        if (!r || !r.width || !r.height) continue;
        rects.push({ r, lum: parseFloat(plate.dataset.lum || '0.5') || 0.5 });
      }

      // --- the band: a mask over the paper-coloured copy ---
      const band = document.querySelector<HTMLElement>('.ticker-layer');
      if (band) {
        const b = band.getBoundingClientRect();
        const w = b.width || window.innerWidth;
        const dark: Range[] = [];
        for (const { r, lum } of rects) {
          if (lum >= FLIP) continue;
          if (r.bottom <= b.top || r.top >= b.bottom) continue;
          const x0 = Math.max(b.left, r.left);
          const x1 = Math.min(b.right, r.right);
          if (x1 <= x0) continue;
          dark.push([((x0 - b.left) / w) * 100, ((x1 - b.left) / w) * 100]);
        }
        const merged = merge(dark);
        let mask = 'linear-gradient(transparent, transparent)';
        if (merged.length) {
          const stops: string[] = [];
          let at = 0;
          for (const [a, z] of merged) {
            if (a > at) stops.push(`transparent ${at.toFixed(2)}%`, `transparent ${a.toFixed(2)}%`);
            stops.push(`#000 ${a.toFixed(2)}%`, `#000 ${z.toFixed(2)}%`);
            at = z;
          }
          if (at < 100) stops.push(`transparent ${at.toFixed(2)}%`, 'transparent 100%');
          mask = `linear-gradient(to right, ${stops.join(', ')})`;
        }
        band.style.setProperty('--dark-mask', mask);
      }

      // --- the mark: one small target, so one answer ---
      const mark = document.querySelector<HTMLElement>('.mark-layer');
      if (mark) {
        const m = mark.getBoundingClientRect();
        const area = m.width * m.height;
        if (area) {
          let covered = 0;
          let sum = 0;
          for (const { r, lum } of rects) {
            const w = Math.min(m.right, r.right) - Math.max(m.left, r.left);
            const h = Math.min(m.bottom, r.bottom) - Math.max(m.top, r.top);
            if (w <= 0 || h <= 0) continue;
            covered += w * h;
            sum += w * h * lum;
          }
          const mean = (sum + Math.max(0, area - covered) * PAPER) / area;
          mark.classList.toggle('on-dark', mean < FLIP);
        }
      }
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(measure);
    };

    measure();
    root?.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // The hero curtain resizes under its own rAF loop, so scroll events are
    // not the only thing that changes what is behind the band.
    const poll = window.setInterval(schedule, 200);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(poll);
      root?.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return null;
}
