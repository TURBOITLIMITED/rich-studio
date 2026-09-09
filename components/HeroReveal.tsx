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
 * The resting panel is NOT a fixed fraction of the viewport, which is what
 * this used to assume, and it is why the shape was off. Measured at two
 * different window sizes:
 *
 *   1600x950   panel 1280x593   = 80.0vw x 62.4vh   aspect 2.159
 *   1700x887   panel 1264x585   = 74.4vw x 66.0vh   aspect 2.161
 *
 * The vw and vh fractions disagree between the two but the ASPECT does
 * not, so the panel has a fixed ratio and is fitted to whichever axis runs
 * out first: width = min(80vw, 142.56vh) at 2.16:1. That reproduces both
 * measurements to within a pixel. Taking the first reading as 80% x 62.4%
 * of the viewport gave 1360x553 at 1700x887 — 96px too wide, 32px too
 * short, and an aspect of 2.46 against their 2.16.
 */

/** Their panel's aspect, from two independent measurements. */
const PANEL_AR = 2.16;
/** It is width-limited on wide-and-short windows, height-limited on the
 *  rest: 80vw against 66vh x 2.16 = 142.56vh. */
const MAX_VW = 0.8;
const MAX_VH = 1.4256;

/* 2.16:1 is a cinema strip, and on a phone 80vw of it is 144px tall — the
   showreel would be a letterbox slot. Nothing about the reference's mobile
   layout was ever measured, so this is our call, not a copy: below 760px
   the panel takes the source clip's own 16:9 and a little more width. */
const NARROW = 760;
const NARROW_AR = 16 / 9;
const NARROW_VW = 0.88;

function restingPanel() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw <= NARROW) {
    const w = NARROW_VW * vw;
    return { w, h: w / NARROW_AR };
  }
  const w = Math.min(MAX_VW * vw, MAX_VH * vh);
  return { w, h: w / PANEL_AR };
}

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

      // Interpolated in pixels rather than percentages, because the
      // resting size is fitted to the viewport and the open size is the
      // viewport — the two have no common percentage basis.
      const rest = restingPanel();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      fr.style.width = `${(rest.w + (vw - rest.w) * eased).toFixed(1)}px`;
      fr.style.height = `${(rest.h + (vh - rest.h) * eased).toFixed(1)}px`;

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
          className="hero-frame"
          data-dark
          /* The showreel is graded dark throughout; measured frames sit
             around 0.10. The band reads this the same way it reads a
             collage plate. */
          data-lum="0.10"
          /* The first painted frame has to be the resting panel already —
             the rAF loop only takes over on the next tick, and the opening
             sequence is running over the top of it. */
          style={{
            width: 'var(--hero-w)',
            aspectRatio: 'var(--hero-ar)',
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
            preload="auto"
            aria-label="Rich Colvill Studio showreel"
            /* Centred with margins rather than translate(-50%,-50%): the
               opening sequence animates this element's transform, and an
               inline transform here would win over the stylesheet. */
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginLeft: '-50vw',
              marginTop: '-50svh',
              width: '100vw',
              height: '100svh',
              objectFit: 'cover',
            }}
          />
        </div>

        <div
          ref={caption}
          className="hero-caption"
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
