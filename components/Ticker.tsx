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
  /* Two phrases, alternating. "Get ®Rich quick" is already his line — it
     is the mail link at the foot of the home page — so the band picks it
     up rather than inventing a second voice for him. Capitalised the way
     that line already is on the page, not shouted: the band is 19.55px
     mixed case, and caps here would fight the name beside it. */
  phrases = ['2026 \u00aeRICH COLVILL let\u2019s do this', 'Get \u00aeRich quick scheme'],
  repeat = 3,
}: {
  phrases?: string[];
  repeat?: number;
}) {
  // The separator is a drawn rule, not an em-dash: theirs is a short heavy
  // bar, and a typographic dash at this weight is neither long nor thick
  // enough to match it.
  // repeat x phrases, so both halves of the track stay identical and the
  // loop still meets itself without measuring anything.
  const items = Array.from({ length: repeat }, () => phrases).flat();

  const half = items.map((text, i) => (
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
