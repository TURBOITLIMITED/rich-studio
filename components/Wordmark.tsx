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
              animation: 'wm-in 0.9s cubic-bezier(0.22,1,0.36,1) both',
              animationDelay: `${0.04 * i}s`,
            }}
          >
            {c}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes wm-in {
          from { opacity: 0; transform: translate3d(0, 0.16em, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wordmark-layer span { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
