/**
 * The running band.
 *
 * Pinned to the foot of the viewport, with no plate behind it.
 *
 * It is rendered TWICE, one copy ink and one copy paper, stacked exactly.
 * The paper copy is masked at runtime to the horizontal ranges where a
 * dark plate is passing underneath, so the line takes whichever colour
 * reads against the thing actually behind it, region by region, and stays
 * clear everywhere — see BackdropContrast.tsx for why a single colour is
 * not enough. The mask lives on the outer copy, which does not move; put
 * it on the track and its coordinates would travel with the text.
 *
 * Two identical halves inside one track, translated -50%: that is what
 * makes the loop seamless without measuring anything. Both copies run the
 * same animation and CSS animations are driven off the document timeline,
 * so they are frame-locked to each other. Decorative, so it is hidden from
 * assistive tech rather than read out on repeat.
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

  const copy = (
    <div className="ticker-track">
      <div style={{ display: 'flex' }}>{half}</div>
      <div style={{ display: 'flex' }}>{half}</div>
    </div>
  );

  return (
    <div className="ticker-layer" aria-hidden="true">
      <div className="ticker-copy">{copy}</div>
      <div className="ticker-copy is-paper">{copy}</div>
    </div>
  );
}
