/**
 * The running band.
 *
 * It is NOT a fixed overlay, and that was the mistake. Sampling the
 * reference across a full scroll of its page, the band's viewport top
 * marches steadily down — 12915, 12187, 11283 ... 1383, 838, 835 — which
 * means it scrolls with the document and simply comes to rest at the foot
 * of the last screen. It is a section, not furniture.
 *
 * Pinning ours to the viewport had a consequence beyond being wrong: black
 * text with no plate behind it, sitting over whatever imagery happened to
 * be passing underneath, which on half of Rich's archive is dark or mid
 * grey. In the flow it always has paper behind it, so it can stay exactly
 * what he asked for — clear, no plate, just the text moving.
 *
 * Two identical halves inside one track, translated -50%: that is what
 * makes the loop seamless without measuring anything. Decorative, so it is
 * hidden from assistive tech rather than read out on repeat.
 */
export default function Ticker({
  text = "2026 \u00aeRICH COLVILL let\u2019s do this",
  repeat = 6,
}: {
  text?: string;
  repeat?: number;
}) {
  // The separator is a drawn rule, not an em-dash: theirs is a short heavy
  // bar, and a typographic dash at this weight is neither long nor thick
  // enough to match it.
  const half = Array.from({ length: repeat }, (_, i) => (
    <span
      key={i}
      className="t-ticker"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '1.5rem', whiteSpace: 'nowrap' }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: '2.4em',
          height: '0.22em',
          background: 'currentColor',
          flex: '0 0 auto',
        }}
      />
      <span style={{ paddingRight: '1.5rem' }}>{text}</span>
    </span>
  ));

  return (
    <div className="ticker-layer" aria-hidden="true">
      <div className="ticker-track">
        <div style={{ display: 'flex' }}>{half}</div>
        <div style={{ display: 'flex' }}>{half}</div>
      </div>
    </div>
  );
}
