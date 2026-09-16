'use client';

import Link from 'next/link';
import { useRef } from 'react';

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

  /* No colour logic here. BackdropContrast.tsx owns the `on-dark` class,
     and it does the job properly: an area-weighted mean of every [data-lum]
     plate actually under the mark.

     This component used to toggle the SAME class off a much dumber test —
     is the mark's centre inside the ONE element carrying [data-dark], which
     is the hero frame and nothing else. Two owners of one class, and this
     one ran last on every scroll event, so it stripped the class straight
     back off the moment you scrolled past the hero onto a dark project
     plate. The mark stayed in its light state over dark imagery, which is
     what turned its new ground into a white blob on a photograph. On
     /work/ and /about/ there is no [data-dark] element at all, so it
     removed the class unconditionally and the flip could never fire.

     One owner. */

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
