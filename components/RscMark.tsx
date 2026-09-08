'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

/**
 * Rich's RSC monogram — the three interlocking rings — fixed at the left
 * edge, in the slot the reference gives its house mark.
 *
 * Painted as a CSS MASK over his untouched Illustrator export rather
 * than inlined as markup. Inlining meant namespacing the ids, because
 * Illustrator names every export "Layer_1" and the footer lockup ships
 * on the same pages; that renaming broke the file's internal clip-path
 * reference and the mark rendered as nothing at all — the DOM reported a
 * 57x52 path with a solid fill and the pixels were blank. A mask uses
 * the file's rendered alpha and cares about none of that.
 *
 * Colour is switched, not blended. `mix-blend-mode: difference` was the
 * obvious answer for "dark on paper, light on the showreel" and it does
 * not work here: the mark is position:fixed with a z-index, which makes
 * its own stacking context, so the blend isolates against nothing and
 * the mark stays white on the paper. Instead this asks the one real
 * question — is a dark surface behind the mark right now — by testing
 * the hero frame's rect against the mark's centre.
 */
export default function RscMark() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    const root = document.querySelector('[data-scroll-root]');
    if (!el) return;

    const update = () => {
      const dark = document.querySelector('[data-dark]');
      if (!dark) {
        el.classList.remove('on-dark');
        return;
      }
      const m = el.getBoundingClientRect();
      const d = dark.getBoundingClientRect();
      const cx = m.left + m.width / 2;
      const cy = m.top + m.height / 2;
      const over = cx >= d.left && cx <= d.right && cy >= d.top && cy <= d.bottom;
      el.classList.toggle('on-dark', over);
    };

    update();
    root?.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      root?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <Link
      href="/"
      aria-label="Rich Colvill Studio — home"
      className="mark-layer"
      title="Rich Colvill Studio"
      ref={ref}
    >
      <span className="mark-shape" aria-hidden="true" />
    </Link>
  );
}
