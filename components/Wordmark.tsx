/**
 * The fixed masthead — Rich's own wordmark, not type set to look like it.
 *
 * This used to render "Rich Colvill" as one span per character in Nimbus
 * Sans, spread edge to edge with space-between. Rich supplied the real
 * artwork on 2026-09-14 and it differs from that in four measurable ways:
 * it is CAPS, it is BOLD, it carries the ® at the END of the name, and its
 * letterforms are narrower. Measured off his export against the face we
 * were setting it in:
 *
 *   his ink       1292.1 x 137.2  ->  width/height  9.42
 *   NimbusSans Bold 1520.1 x 124  ->  width/height 11.97
 *
 * 1.27x narrower. That gap is in the GLYPHS, so no amount of tracking
 * closes it — letter-spacing moves the gaps, not the letters. It is a
 * condensed drawing and the only faithful way to show it is to show it.
 *
 * An <img>, not a CSS mask. The mask route is what .mark-shape uses for
 * his RSC monogram so the shape can take --color-ink, and it was tried
 * first here — but this file masks to nothing. It is structurally
 * IDENTICAL to rsc-mark.svg, which masks fine: same Illustrator skeleton,
 * same <style> block, same clipped group. Proven by measurement rather
 * than guessed at: with the mask the band paints 6% ink (which is only
 * the showreel's edge caught in the crop), with mask-image:none it paints
 * 81%, so the element is there and the mask is erasing it. Namespacing
 * its ids, restoring intrinsic width/height and reverting the viewBox
 * crop each changed nothing.
 *
 * An <img> renders it correctly, and the footer lockup already takes this
 * route for the same reason its comment gives: it never needs to take a
 * colour from the page. Neither does this — imagery passes IN FRONT of
 * the masthead rather than behind it, so it never inverts.
 *
 * THE COUPLING THAT COSTS: his artwork carries #1a1b1e baked in, so it no
 * longer follows --color-ink. That is fine today because they are the
 * same value, and it is the same deal the footer lockup already has — but
 * if his black changes again, these two files have to be re-exported, not
 * just the token.
 *
 * WHAT THIS COSTS. The per-character structure WAS the load animation —
 * each letter sat in its own clip and slid up, staggered 16ms apart. His
 * wordmark is a single path, so there are no letters to stagger. The
 * reveal is now a left-to-right wipe of the whole word, timed to the sweep
 * it replaces: the old first letter began moving at 380ms and the last one
 * landed at ~1332ms, so the wipe runs 950ms from a 380ms delay and lands
 * in the same place. It reads as the same gesture; it is not the same
 * animation, and that was a deliberate trade.
 *
 * Still NOT an <h1>, and still hidden from assistive tech: it is identical
 * on every route, so making it a heading left /work, /about and /contact
 * with no accessible heading and gave each case study two.
 */
export default function Wordmark() {
  return (
    <div className="wordmark-layer" aria-hidden="true">
      <div className="wordmark-row" role="presentation">
        <img
          className="wordmark-art"
          src="/brand/wordmark.svg"
          alt=""
          width={1362}
          height={187}
        />
      </div>
    </div>
  );
}
