'use client';

import { useEffect, useRef } from 'react';

/**
 * One observer per element is wasteful at ~200 images, so this
 * shares a single IntersectionObserver across every Reveal on the
 * page and unobserves each element the moment it has fired. The
 * class flip is all the animation; the easing lives in CSS.
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          observer?.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
  );
  return observer;
}

export default function Reveal({
  children,
  delay = 0,
  className = '',
  style,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The scroll container is fixed, so the observer root is the
    // viewport either way — no need to hand it the wrapper.
    const o = getObserver();
    o.observe(el);
    return () => o.unobserve(el);
  }, []);

  return (
    <Tag ref={ref} className={`rise ${className}`} style={{ ...style, transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
