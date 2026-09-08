'use client';

/**
 * The fixed masthead. The reference splits its wordmark into one
 * span per character and keeps a duplicate of each — that rig is
 * for a hover swap we do not need, but the per-character split is
 * worth keeping: it is what lets the letters stagger on load
 * without a layout pass per frame.
 *
 * Sized in vw so it fills the viewport edge to edge. "RICH
 * COLVILL" is 12 characters against the reference's 11, so the
 * ceiling in --wordmark-size is a little tighter than theirs.
 *
 * It is deliberately NOT an <h1>. It is identical on every route
 * and hidden from assistive tech, so using a heading here left
 * /work, /about and /contact with no accessible heading at all
 * and gave each case study two.
 */
export default function Wordmark({ text = 'Rich Colvill' }: { text?: string }) {
  const chars = [...text];

  return (
    <div className="wordmark-layer" aria-hidden="true">
      <div className="t-wordmark" role="presentation">
        {/* His mark is "®RICH COLVILL", not "RICH COLVILL" — the ® is part
            of the name and it is on his showreel title card and his logo
            lockup. Set small and raised rather than at cap height, or a
            216px glyph would eat the R beside it. */}
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            fontSize: '0.26em',
            verticalAlign: 'top',
            transform: 'translateY(0.42em)',
            marginRight: '0.04em',
            letterSpacing: 0,
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
