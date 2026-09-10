'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

export type WorkRow = {
  slug: string;
  title: string;
  category: string;
  meta: string;
  count: string;
  preview: { src: string; w: number; h: number } | null;
};

/**
 * The index, with a preview that flows in under the cursor.
 *
 * Rich's note on the list: "it's just all lists, obviously nobody knows
 * what any of those things are — if you rolled over it maybe it could
 * just have like a flow in preview." Twenty-six titles with no pictures
 * asks the reader to already know the work, which is the one thing a
 * portfolio cannot assume.
 *
 * The list markup is unchanged from the server-rendered version it
 * replaced, deliberately — the grid, the rules and the type are all
 * measured against the reference, and none of that is what needed
 * fixing.
 *
 * Three things about how the preview behaves are decisions, not
 * defaults:
 *
 *  - It is gated on the pointer that actually arrives, not on a media
 *    query. `(hover: hover) and (pointer: fine)` is the usual test and
 *    it is wrong here: it describes the PRIMARY pointer, so a Windows
 *    laptop with a touchscreen reports hover:none/pointer:coarse even
 *    with a mouse plugged in, and the preview would never appear. This
 *    Chrome reports false for it too, which is how it was caught.
 *    Ignoring pointerType 'touch' is the same intent stated directly —
 *    a tap never opens a preview that then has nothing to dismiss it.
 *  - It trails the cursor rather than pinning to it. A preview locked to
 *    the pointer reads as a cursor, not as a picture; easing toward the
 *    target at ~18% a frame gives it weight, and is what makes it "flow
 *    in" rather than snap.
 *  - Each preview is mounted the first time its row is hovered and then
 *    left mounted. Swapping one <img>'s src would blank it on every move
 *    between rows; mounting all twenty-six up front would pull the whole
 *    archive down for a reader who may hover none of it.
 */
export default function WorkList({ rows }: { rows: WorkRow[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [mounted, setMounted] = useState<number[]>([]);
  const [motion, setMotion] = useState(true);

  const layer = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0, ready: false });
  const raf = useRef(0);

  // Reduced motion drops the follow and the rise, not the preview —
  // seeing the work is the point of the feature, and a plain fade is
  // not what the preference is asking us to stop doing.
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setMotion(!q.matches);
    read();
    q.addEventListener('change', read);
    return () => q.removeEventListener('change', read);
  }, []);

  // Only runs while a row is hovered; there is no idle rAF burning on a
  // page the reader is just scrolling past.
  useEffect(() => {
    if (active === null) return;
    const tick = () => {
      const el = layer.current;
      if (el) {
        const p = pos.current;
        const t = target.current;
        const k = motion ? 0.18 : 1;
        // Straight to the mark on the first frame, or the preview flies
        // in from wherever it was last left.
        p.x = p.ready ? p.x + (t.x - p.x) * k : t.x;
        p.y = p.ready ? p.y + (t.y - p.y) * k : t.y;
        p.ready = true;
        el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, motion]);

  // The running band is fixed to the foot of the window and its dark/light
  // masking is computed from the project plates on the page, not from
  // whatever the preview happens to be showing. Let a preview slide under
  // it and a dark image swallows the band's text — it only survived the
  // first measurement because that row's cover was pale. So the band is a
  // floor, not something to pass behind. Read once, and again on resize.
  const floor = useRef(0);
  useEffect(() => {
    const read = () => {
      const band = document.querySelector('.ticker-layer');
      const top = band ? band.getBoundingClientRect().top : window.innerHeight;
      floor.current = Math.max(top - 12, 0);
    };
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);

  const aim = useCallback((e: React.PointerEvent) => {
    const el = layer.current;
    const w = el?.offsetWidth ?? 0;
    const h = el?.offsetHeight ?? 0;
    // Sat to the right of the cursor and vertically centred on it, then
    // held inside the window — at the foot of a twenty-six row list the
    // preview would otherwise hang off the bottom of the screen.
    const x = Math.min(e.clientX + 32, window.innerWidth - w - 16);
    const y = Math.min(Math.max(e.clientY - h / 2, 16), Math.max(floor.current - h, 16));
    target.current = { x, y };
  }, []);

  const move = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== 'touch') aim(e);
    },
    [aim],
  );

  const enter = useCallback(
    (i: number, e: React.PointerEvent) => {
      if (e.pointerType === 'touch') return;
      aim(e);
      // Coming back to the list after leaving it, the preview must appear
      // where the cursor already is. Without this it keeps the position it
      // held when it faded out and flies across the page to catch up,
      // fading in the whole way — which reads as a bug, not a flourish.
      if (active === null) pos.current.ready = false;
      setActive(i);
      setMounted((m) => (m.includes(i) ? m : [...m, i]));
    },
    [active, aim],
  );

  return (
    <>
      <ul
        onPointerMove={move}
        onPointerLeave={() => setActive(null)}
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          paddingLeft: 'clamp(0px, 5.2vw, 88px)',
        }}
      >
        {rows.map((r, i) => (
          <li key={r.slug} onPointerEnter={(e) => enter(i, e)}>
            <Link
              href={`/work/${r.slug}`}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,3fr) minmax(0,3fr) minmax(0,2fr) auto',
                gap: 'clamp(10px, 2vw, 28px)',
                alignItems: 'baseline',
                paddingBlock: 'clamp(14px, 2.2vh, 22px)',
                borderTop: '1px solid var(--color-rule)',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <span className="t-label">{r.title}</span>
              <span className="t-meta">{r.category}</span>
              <span className="t-meta">{r.meta}</span>
              <span className="t-meta" style={{ textAlign: 'right' }}>
                {r.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Always in the document so its measured size is available on the
          very first hover — it is an empty, unpainted, pointer-events:none
          box until a real pointer asks for a picture. Decorative: the same
          images are on the case study a click away, and the row's own text
          is the accessible name. */}
      <div ref={layer} className="work-preview" aria-hidden="true">
        {mounted.map((i) => {
          const p = rows[i].preview;
          if (!p) return null;
          return (
            <img
              key={rows[i].slug}
              src={p.src}
              width={p.w}
              height={p.h}
              alt=""
              decoding="async"
              data-on={active === i ? '' : undefined}
            />
          );
        })}
      </div>
    </>
  );
}
