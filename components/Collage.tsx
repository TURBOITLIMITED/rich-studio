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
 * SCALE IS THE POINT, and it is measured. Every plate on the reference was
 * sampled across a full scroll of the page: as a percentage of the viewport
 * they come in at 18%, 28%, 30% and 67% wide, and 52-78% tall. The only
 * 100% element on the whole site is the hero showreel. Our collage opened
 * with a full-bleed plate that was 100% wide and 108% tall — taller than
 * the window — so it swallowed the masthead whole and there was nothing
 * for the work to sit against. The spans below are those measured widths
 * mapped onto the 12-column box: 8 = 67%, 7 = 58%, 5 = 40%, 4 = 30%,
 * 3 = 18%. Nothing bleeds; the gutter always holds.
 *
 * The columns are also chosen so grid auto-placement packs two or three
 * plates onto a row — a start column has to clear where the previous plate
 * ended or the figure drops to a row of its own with half the viewport
 * empty beside it, which is what made the old layout read as scattered
 * junk. `drop` then staggers plates down their row so a packed row reads
 * as a composition rather than as cells of a table.
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

type Slot = { span: number; start: number; drop?: string };

const PATTERN: Slot[] = [
  { span: 8, start: 4 }, //  67% — their biggest plate, right of centre
  { span: 3, start: 1, drop: '20vh' }, //  18% — small left plate
  { span: 4, start: 5 }, //  30%
  { span: 4, start: 9, drop: '14vh' }, //  30% — right
  { span: 7, start: 2 }, //  58%
  { span: 3, start: 10, drop: '24vh' }, //  18% — small right plate
  { span: 5, start: 4 }, //  40% — centred
  { span: 4, start: 1, drop: '10vh' }, //  30% — left
  { span: 6, start: 6, drop: '18vh' }, //  48% — right
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
        let { span, start, drop } = slotFor(i, img);
        if (softenLarge && span > 6) {
          span = 6;
          start = 4;
        }
        const ratio = img.w && img.h ? `${img.w} / ${img.h}` : '3 / 2';
        return (
          <figure
            key={img.src}
            data-parallax
            data-lum={img.lum ?? 0.5}
            className="frame"
            style={{
              gridColumn: `${start} / span ${span}`,
              marginTop: drop,
              aspectRatio: ratio,
              /* No plate on the reference is taller than 78% of the
                 window. A portrait in a 40%-wide slot works out at 115%
                 from its own ratio, which is a plate you cannot see the
                 whole of — so the frame clamps and the image crops to it
                 rather than the page growing to fit. */
              maxHeight: '78vh',
            }}
          >
            <img
              src={img.src}
              srcSet={`${img.sm} 900w, ${img.src} 2000w`}
              sizes={`${Math.round((span / 12) * 100)}vw`}
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
