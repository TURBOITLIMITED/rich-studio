'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * The reference runs its scroll inside a fixed, full-viewport
 * container rather than on the document, which is why the page
 * reports a scrollHeight equal to the viewport. Reproducing that
 * matters: it is what lets the wordmark, the mark and the ticker
 * sit still while everything else moves, without a single one of
 * them needing a scroll listener.
 */
export default function ScrollRoot({ children }: { children: React.ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapper.current || !content.current) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const lenis = new Lenis({
      wrapper: wrapper.current,
      content: content.current,
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={wrapper} className="scroll-root" data-scroll-root>
      <div ref={content}>{children}</div>
    </div>
  );
}
