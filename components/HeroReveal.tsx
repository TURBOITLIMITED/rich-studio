'use client';

import { useEffect, useRef } from 'react';

/**
 * The opening sequence, measured off maisonauge.com.
 *
 * Their hero is a curtain, not a zoom. Sampling the video and its parent
 * across the first ~22 scroll steps:
 *
 *   step 0   frame 1280x593   video 1600x950 at y=0   wordmark 217px y=15
 *   step 8   frame 1600x950   video 1600x950 at y=0   wordmark 217px y=15
 *   step 22  frame 1600x950   video 1600x950 at y=-1935
 *
 * So the WINDOW opens from an inset panel to full bleed while the video
 * behind it does not move at all — more of the same frame is revealed,
 * nothing scales. Only once the window is fully open does the whole
 * block scroll away. The wordmark never moves through any of it.
 *
 * That is why the video is absolutely positioned at viewport size inside
 * a clipping frame, rather than sized to the frame: if the video were a
 * child that grew with its parent, it would scale, and scaling reads as
 * a completely different move.
 *
 * Start ratios are theirs: 1280/1600 = 0.80 wide, 593/950 = 0.624 tall.
 */

const START_W = 0.8;
const START_H = 0.624;

export default function HeroReveal({ children }: { children?: React.ReactNode }) {
  const section = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = section.current;
    const fr = frame.current;
    if (!sec || !fr) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fr.style.width = '100%';
      fr.style.height = '100%';
      return;
    }

    let raf = 0;
    const tick = () => {
      const r = sec.getBoundingClientRect();
      // The section is 200vh: the first 100vh is the curtain opening
      // while the inner block is stuck, the second 100vh scrolls it off.
      const travel = r.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0;

      // Open over the first half of that travel, then hold.
      const open = Math.min(1, p / 0.5);
      const eased = 1 - Math.pow(1 - open, 2);

      const w = START_W + (1 - START_W) * eased;
      const h = START_H + (1 - START_H) * eased;
      fr.style.width = `${(w * 100).toFixed(2)}%`;
      fr.style.height = `${(h * 100).toFixed(2)}%`;

      // The caption sits under the panel at rest and is swallowed as the
      // curtain opens — it has nowhere to go once the frame is full bleed.
      if (caption.current) {
        caption.current.style.opacity = `${Math.max(0, 1 - open * 1.6)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={section} aria-label="Showreel" style={{ height: '200svh', position: 'relative' }}>
      {/* The z-index belongs HERE, on the sticky element, not on the frame
          inside it. position:sticky forms a stacking context, so a z-index
          on the video's own frame is trapped within this box and cannot be
          compared against the masthead at all — which is why the masthead
          kept painting over the showreel long after the collage frames had
          started passing in front of it. 50 is the same layer the collage
          frames use: imagery in front of the name. */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          zIndex: 50,
        }}
      >
        <div
          ref={frame}
          data-dark
          /* The showreel is graded dark throughout; measured frames sit
             around 0.10. The band reads this the same way it reads a
             collage plate. */
          data-lum="0.10"
          style={{
            width: `${START_W * 100}%`,
            height: `${START_H * 100}%`,
            overflow: 'hidden',
            position: 'relative',
            background: 'var(--color-ink)',
          }}
        >
          <video
            src="/video/reel.mp4"
            poster="/video/reel-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Rich Colvill Studio showreel"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100vw',
              height: '100svh',
              objectFit: 'cover',
            }}
          />
        </div>

        <div
          ref={caption}
          style={{
            position: 'absolute',
            bottom: 'clamp(26px, 5vh, 60px)',
            left: 0,
            right: 0,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
