'use client';

import { useEffect } from 'react';

/**
 * The opening sequence, measured off maisonauge.com by sampling the DOM
 * every 80ms from navigation across three independent runs.
 *
 * Their timeline, relative to first paint:
 *
 *   0        the name sits 38.8vh below centre, page otherwise empty
 *   0-970    it rises to dead centre                      (ease-out)
 *   970-1550 it holds there                               (the "text in
 *                                                          the middle")
 *   1550     a full-width, zero-height slit tears open at the vertical
 *            midline and grows outward, top and bottom together
 *   1550-2460 the name rises from the centre to its place at the top
 *   1550-2650 the slit opens to the full panel             (ease-in-out)
 *   2650     done
 *
 * Three things in that are worth stating because they are easy to get
 * wrong and all three are load-bearing:
 *
 *  - The name never fades. Opacity was 1 at every one of 83 samples, in
 *    both directions. It arrives and leaves purely by moving.
 *  - The reveal is a centre-out vertical iris, not a scale and not a wipe
 *    from an edge. Their left and right insets are 0% from the very first
 *    sample; only top and bottom fall, symmetrically.
 *  - The video is already playing when the slit opens — it is not a poster
 *    that starts on reveal. Their clip was fully buffered ~750ms before
 *    the opening, so the delay is choreography, not buffering.
 *
 * This drives the REAL masthead rather than an intro copy of it. A
 * duplicate would have to hand over to the fixed one at 2460ms and any
 * disagreement between the two — a font metric, a gutter — would show as
 * a jump at exactly the moment the eye is on it.
 *
 * data-intro starts in the server-rendered HTML so the first painted frame
 * is already the boot state; setting it here would flash the finished
 * layout first. A <noscript> block in the layout unwinds it for anyone
 * without JS, who would otherwise be left looking at a centred name and no
 * page.
 */

const STEPS: [string, number][] = [
  ['rise', 0],
  ['hold', 970],
  ['open', 1550],
  ['done', 2650],
];

export default function Intro() {
  useEffect(() => {
    const el = document.documentElement;

    // The inline script in the head has already cleared this on every route
    // but the home page, and for reduced motion. If it is gone, there is no
    // sequence to run.
    if (!el.hasAttribute('data-intro')) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.removeAttribute('data-intro');
      return;
    }

    const ids: number[] = [];
    // Two frames, so the boot state is actually painted before the first
    // transition target lands on it — otherwise the browser coalesces the
    // two and the rise never runs.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        for (const [phase, at] of STEPS) {
          ids.push(window.setTimeout(() => el.setAttribute('data-intro', phase), at));
        }
        // Cleared once the last transition has finished, so nothing is left
        // holding a transition on the masthead while the page is in use.
        ids.push(window.setTimeout(() => el.removeAttribute('data-intro'), 2650 + 1200));
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ids.forEach((i) => window.clearTimeout(i));
      el.removeAttribute('data-intro');
    };
  }, []);

  return null;
}
