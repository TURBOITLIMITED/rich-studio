import type { ProjectImage } from '@/lib/projects';

/**
 * The scattered editorial layout.
 *
 * The reference gets its rhythm from mixing portrait against landscape.
 * Rich's archive is almost entirely 16:9 presentation frames — 179
 * landscape against 3 portrait — so copying that directly would produce a
 * page of identical letterboxes stepping down the screen. The variety here
 * comes from scale, horizontal offset and vertical stagger instead.
 *
 * The pattern is built in PAIRS, and that is the fix for the layout
 * reading as "all over the place". CSS grid auto-placement only puts two
 * figures on one row when the second one's start column is clear of where
 * the first one ended; the old pattern's columns did not line up that way,
 * so most figures landed alone on a row with half the viewport left empty
 * beside them. Every left slot below is followed by a right slot that
 * provably packs against it — 1-5 then 7-12, 1-4 then 6-12, 1-6 then 8-12
 * — with only the three full-width statements standing alone.
 *
 * `drop` staggers the right-hand figure of each pair downward so a packed
 * row still reads as a composition rather than as two cells of a table.
 *
 * Each figure is a CLIPPED FRAME holding an oversized image — that is what
 * ScrollMotion animates against. The frame owns the layout box; the image
 * inside is 10% larger and drifts within it as you scroll. Without the clip
 * you would just see the image jitter at the edges.
 *
 * There is deliberately no fade. The reference's images sit at opacity 1.00
 * through their whole reveal — the entrance is a scale settle from 1.2 to
 * 1.1, nothing more. Fading them in reads as a different site.
 */

type Slot = { span: number; start: number; bleed?: boolean; drop?: string };

const PATTERN: Slot[] = [
  { span: 12, start: 1, bleed: true }, // opener, edge to edge
  { span: 5, start: 1 }, //  pair A — left
  { span: 6, start: 7, drop: '10vh' }, //  pair A — right, dropped
  { span: 8, start: 3 }, //  statement, centred-ish
  { span: 4, start: 1, drop: '6vh' }, //  pair B — left, small and dropped
  { span: 7, start: 6 }, //  pair B — right
  { span: 9, start: 2 }, //  statement
  { span: 6, start: 1, drop: '12vh' }, //  pair C — left, dropped
  { span: 5, start: 8 }, //  pair C — right
];

function slotFor(i: number, img: ProjectImage): Slot {
  const base = PATTERN[i % PATTERN.length];
  // A portrait is rare enough here that it should never take a wide slot —
  // at 8 or 12 columns it would stand two viewports tall and bury whatever
  // came after it. Centre it instead, so the space either side reads as
  // deliberate rather than as a figure that failed to reach the edge.
  if (img.orient === 'portrait' && base.span > 6) {
    return { span: 5, start: 4, drop: base.drop };
  }
  return base;
}

export default function Collage({
  images,
  altBase,
  softenLarge = false,
}: {
  images: ProjectImage[];
  /** These are the work, not decoration, so they get real alt text.
   *  Without the project name a screen reader hears twelve "image"s. */
  altBase: string;
  /** Ces Enfants ships at 1366×768 and falls apart full-bleed, so its
   *  section caps every figure below the statement sizes. */
  softenLarge?: boolean;
}) {
  return (
    <div
      className="collage"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 'clamp(28px, 5vw, 90px) clamp(12px, 2vw, 28px)',
        paddingInline: 'var(--gutter)',
        alignItems: 'start',
      }}
    >
      {images.map((img, i) => {
        let { span, start, bleed, drop } = slotFor(i, img);
        if (softenLarge && span > 8) {
          span = 8;
          start = 3;
          bleed = false;
        }
        const ratio = img.w && img.h ? `${img.w} / ${img.h}` : '3 / 2';
        return (
          <figure
            key={img.src}
            data-parallax
            className="frame"
            style={{
              gridColumn: `${start} / span ${span}`,
              marginInline: bleed ? 'calc(-1 * var(--gutter))' : undefined,
              marginTop: drop,
              aspectRatio: ratio,
            }}
          >
            <img
              src={img.src}
              srcSet={`${img.sm} 900w, ${img.src} 2000w`}
              sizes={bleed ? '100vw' : `${Math.round((span / 12) * 100)}vw`}
              width={img.w}
              height={img.h}
              alt={`${altBase} — image ${i + 1} of ${images.length}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </figure>
        );
      })}
    </div>
  );
}
