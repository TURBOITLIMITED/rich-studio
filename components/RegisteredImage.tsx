'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * One crisp image, mounted only once it is near the viewport.
 *
 * This used to stack three offset, multiply-blended copies so a tile
 * arrived out of register and pulled true under the cursor. The client has
 * settled on a reference where images are simply sharp, so the colour
 * plates are gone and the base image carries the whole thing.
 *
 * The IntersectionObserver stays and matters more than it did: with one
 * <img> per tile rather than four, it is the only thing keeping a 31-tile
 * archive from firing 31 requests on load.
 *
 * NOTE: the plate treatment on the WORDMARK and the creature mark is a
 * different system (.wm-* / .cr-* in globals.css) and is deliberately
 * untouched — that is his logo, not page furniture.
 */
export default function RegisteredImage({
  src,
  alt,
  className = '',
  sizes = '(max-width: 900px) 100vw, 33vw',
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(priority);

  // Only mount the three plate copies once the tile is near the viewport.
  // Three <img> per tile across 30 tiles is 90 requests if mounted eagerly.
  useEffect(() => {
    if (near || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  return (
    <div ref={ref} className={`reg ${className}`}>
      {near && (
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="reg-base"
        />
      )}
    </div>
  );
}
