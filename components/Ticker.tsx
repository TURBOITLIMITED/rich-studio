'use client';

import { useEffect, useRef } from 'react';

/**
 * The running band. Two identical halves inside one track, translated
 * -50% — that is what makes the loop seamless without measuring
 * anything. Purely decorative, so it is hidden from assistive tech
 * rather than read out on repeat.
 *
 * No plate behind it: just the text moving over the page.
 *
 * It is also absent on the opening screen. On the reference the first
 * frame carries the centred caption alone and the band only appears
 * once you have started moving — so the text at the bottom of the page
 * changes as you scroll, rather than sitting there from the start.
 */
export default function Ticker({
  text = '®Rich Colvill Studio — Branding / Design / Creative Production',
  repeat = 8,
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

  const half = Array.from({ length: repeat }, (_, i) => (
    <span key={i} className="t-meta" style={{ paddingInline: '1.6rem', whiteSpace: 'nowrap' }}>
      {text}
    </span>
  ));

  return (
    <div className="ticker-layer" ref={layer} aria-hidden="true">
      <div className="ticker-track" style={{ paddingBlock: '0.55rem' }}>
        <div style={{ display: 'flex' }}>{half}</div>
        <div style={{ display: 'flex' }}>{half}</div>
      </div>
    </div>
  );
}
