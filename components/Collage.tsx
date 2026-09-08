import type { ProjectImage } from '@/lib/projects';
import Reveal from './Reveal';

/**
 * The scattered editorial layout.
 *
 * The reference gets its rhythm from mixing portrait against
 * landscape. Rich's archive is almost entirely 16:9 presentation
 * frames — 179 landscape against 3 portrait — so copying that
 * rhythm directly would produce a page of identical letterboxes
 * stepping down the screen. The variety here comes from scale and
 * horizontal offset instead: a figure is either a full-bleed
 * statement, a half-width plate pushed to one edge, or a small
 * inset that leaves most of the row empty.
 *
 * The pattern repeats every 7, which is long enough that a
 * ten-image project never reads as a loop.
 */

type Slot = { span: number; start: number; bleed?: boolean };

const PATTERN: Slot[] = [
  { span: 12, start: 1, bleed: true }, // opener, edge to edge
  { span: 4, start: 2 }, //  small, left
  { span: 6, start: 7 }, //  medium, right
  { span: 9, start: 3 }, //  large, centred-ish
  { span: 5, start: 1 }, //  small, hard left
  { span: 7, start: 6 }, //  medium, right
  { span: 10, start: 2 }, //  large
];

function slotFor(i: number, img: ProjectImage): Slot {
  const base = PATTERN[i % PATTERN.length];
  // A portrait is rare enough here that it should never be forced
  // full-bleed — it would tower over everything around it.
  if (img.orient === 'portrait' && base.span > 6) {
    return { span: 5, start: base.start > 6 ? 7 : 2 };
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
        paddingInline: 'clamp(14px, 4vw, 64px)',
      }}
    >
      {images.map((img, i) => {
        let { span, start, bleed } = slotFor(i, img);
        if (softenLarge && span > 8) {
          span = 8;
          start = start > 4 ? 4 : 3;
          bleed = false;
        }
        return (
          <Reveal
            key={img.src}
            as="figure"
            delay={(i % 3) * 90}
            className="m-0"
            style={{
              gridColumn: `${start} / span ${span}`,
              marginInline: bleed ? 'calc(-1 * clamp(14px, 4vw, 64px))' : undefined,
            }}
          >
            <div>
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
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
