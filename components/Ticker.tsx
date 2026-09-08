/**
 * The running footer band. Two identical halves inside one track,
 * translated -50% — that is what makes the loop seamless without
 * measuring anything. Purely decorative, so it is hidden from
 * assistive tech rather than read out on repeat.
 */
export default function Ticker({
  text = '®Rich Colvill Studio — Branding / Design / Creative Production',
  repeat = 8,
}: {
  text?: string;
  repeat?: number;
}) {
  const half = Array.from({ length: repeat }, (_, i) => (
    <span key={i} className="t-meta" style={{ paddingInline: '1.6rem', whiteSpace: 'nowrap' }}>
      {text}
    </span>
  ));

  return (
    <div className="ticker-layer" aria-hidden="true">
      <div className="ticker-track" style={{ paddingBlock: '0.55rem' }}>
        <div style={{ display: 'flex' }}>{half}</div>
        <div style={{ display: 'flex' }}>{half}</div>
      </div>
    </div>
  );
}
