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
 * There is no per-character stagger on load. There was, and it had to go:
 * the reference moves the whole word as one object, rising from below the
 * fold to the centre of the screen and then up to here — see Intro.tsx —
 * and a letter-by-letter entrance underneath that read as two competing
 * animations.
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
            glyph would eat the R beside it. */}
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            fontSize: '0.26em',
            transform: 'translateY(0.5em)',
            flex: '0 0 auto',
          }}
        >
          ®
        </span>
        {chars.map((c, i) => (
          <span
            key={`${c}-${i}`}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              flex: '0 0 auto',
            }}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
