'use client';

/**
 * The fixed masthead.
 *
 * Set edge to edge, not centred. Measured on the reference at 1700x887:
 * the type is 230.8px (13.58vw) at line-height 1.0 with normal tracking,
 * and the rendered glyphs of "maison auge" only measure ~1342px — yet the
 * word spans 1620px of the viewport. The difference is distribution: one
 * flex item per character, spread with space-between across the gutters.
 * That is why this is a flex row rather than centred nowrap text, and why
 * the space character keeps its own span — it takes a share of the spread
 * and gives the two words their gap.
 *
 * Line-height matters more than it looks. At 0.82 the negative half-leading
 * pulled the glyph tops above the line box and the caps were sliced off by
 * the top of the viewport.
 *
 * EVERY character is two nested spans, and that is the load animation
 * rather than a styling quirk. The outer box clips; the inner one carries
 * the letter and slides up out of the clip. The reference does exactly
 * this — each of its glyphs is a `relative inline-block overflow-hidden`
 * box with the letter sitting at translateY(150%) of it, so the page is
 * genuinely blank for the first half second and the word then unmasks in
 * place, left to right, without the block ever moving.
 *
 * This replaced a version that slid the whole layer up the screen. Three
 * independent reads say that was wrong: the reference's own DOM, a pixel
 * scan of a screen recording of it reloading (the ink's BOTTOM edge stays
 * pinned while the top climbs, and the x extent grows left to right —
 * a travelling block would appear at full width with both edges moving),
 * and the frames themselves, where letters are visibly cut off flat along
 * one shared horizontal line while their neighbours are already whole.
 *
 * It is deliberately NOT an <h1>. It is identical on every route and hidden
 * from assistive tech, so using a heading here left /work, /about and
 * /contact with no accessible heading at all and gave each case study two.
 */
export default function Wordmark({ text = 'Rich Colvill' }: { text?: string }) {
  const chars = [...text];

  return (
    <div className="wordmark-layer" aria-hidden="true">
      <div className="t-wordmark wordmark-row" role="presentation">
        {/* His mark is "®RICH COLVILL", not "RICH COLVILL" — the ® is part
            of the name, on his showreel title card and his logo lockup.
            Set small and raised rather than at cap height, or a 230px
            glyph would eat the R beside it. The raise lives on the OUTER
            box so the inner span is free to carry the reveal. */}
        <span
          aria-hidden="true"
          className="wordmark-glyph"
          style={{
            fontSize: '0.26em',
            transform: 'translateY(0.5em)',
            ['--i' as string]: 0,
          }}
        >
          <span>®</span>
        </span>
        {chars.map((c, i) => (
          <span
            key={`${c}-${i}`}
            className="wordmark-glyph"
            style={{ ['--i' as string]: i + 1 }}
          >
            <span>{c}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
