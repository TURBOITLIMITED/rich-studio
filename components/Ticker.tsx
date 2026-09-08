'use client';

import { useEffect, useRef } from 'react';

/**
 * The running band at the foot of the page.
 *
 * Measured on the reference at 1700x887: 19.55px, weight 700, line-height
 * 1.0, letter-spacing NORMAL, text-transform NONE, sitting 32px clear of
 * the bottom edge. Their line is "2026 MAISON AUGE own the beauty" — caps
 * for the house, lowercase for the phrase — with a heavy short rule
 * between repeats. Ours was 10px, uppercased and tracked out to 0.09em,
 * which read as a legal footer rather than a band.
 *
 * "Let's do this" is Rich's own line, not a written one: it is the local
 * part of his studio address.
 *
 * No plate behind it — just the text moving over the page.
 *
 * It is also absent on the opening screen. On the reference the first
 * frame carries the centred caption alone and the band only appears once
 * you have started moving, so the text at the bottom of the page changes
 * as you scroll rather than sitting there from the start.
 */
export default function Ticker({
  text = "2026 ®RICH COLVILL let’s do this",
  repeat = 6,
}: {
  text?: string;
  repeat?: number;
}) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.querySelector('[data-scroll-root]');
    const el = layer.current;
    if (!root || !el) return;
    const onScroll = () => {
      el.classList.toggle('is-on', root.scrollTop > window.innerHeight * 0.35);
    };
    onScroll();
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => root.removeEventListener('scroll', onScroll);
  }, []);

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
    <div className="ticker-layer" ref={layer} aria-hidden="true">
      <div className="ticker-track">
        <div style={{ display: 'flex' }}>{half}</div>
        <div style={{ display: 'flex' }}>{half}</div>
      </div>
    </div>
  );
}
