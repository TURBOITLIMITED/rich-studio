import type { ProjectImage } from '@/lib/projects';

/**
 * The image column of a project.
 *
 * Measured off maisonauge.com at 1700x887. Their project block is not a
 * scattered grid at all — it is two columns. A title pinned on the left at
 * 8.3%-25% of the viewport, and everything else in a single stack on the
 * right running 33.3%-91.7%, flex column, 15dvh between rows. The rows
 * inside that stack are:
 *
 *   a small plate      18.3% of the viewport  (31.3% of the column)
 *   a full-width plate the whole column
 *   a two-up row       two plates at 47% each, one left, one right
 *
 * That right-hand plate of the two-up is what reads as "then it scrolls on
 * right": it is not travelling sideways — nothing on their page does, the
 * tx component of every sampled transform matrix is 0 — it simply lives in
 * the right of the column and rises into view while the title holds still
 * on the left.
 *
 * Rich's projects run 1 to 10+ images against their fixed four, so the
 * rows repeat full / two-up after the opening plate, which keeps the
 * rhythm without needing a hand-built layout per project.
 *
 * Each plate is a CLIPPED FRAME holding an oversized image. The frame owns
 * the layout box; the image inside rests at scale 1.1 and settles into it
 * from 1.2 — see ScrollMotion. Without the clip you would see the image
 * spill over its neighbours.
 */

type Row =
  | { kind: 'solo'; width: string }
  | { kind: 'pair' };

/** After the opening plate the stack alternates full-width and two-up. */
function rowsFor(count: number): Row[] {
  const rows: Row[] = [];
  let placed = 0;
  // The opener is the small plate, at 31.3% of the column.
  if (placed < count) {
    rows.push({ kind: 'solo', width: '31.3%' });
    placed += 1;
  }
  let full = true;
  while (placed < count) {
    if (full || count - placed === 1) {
      rows.push({ kind: 'solo', width: '100%' });
      placed += 1;
    } else {
      rows.push({ kind: 'pair' });
      placed += 2;
    }
    full = !full;
  }
  return rows;
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
  /** Ces Enfants ships at 1366x768 and falls apart at full width, so its
   *  section holds every plate to the two-up size. */
  softenLarge?: boolean;
}) {
  const rows = rowsFor(images.length);
  let cursor = 0;

  return (
    <div className="plate-stack">
      {rows.map((row, ri) => {
        if (row.kind === 'pair') {
          const pair = images.slice(cursor, cursor + 2);
          const base = cursor;
          cursor += 2;
          return (
            <div className="plate-pair" key={`r${ri}`}>
              {pair.map((img, k) => (
                <Plate
                  key={img.src}
                  img={img}
                  index={base + k}
                  total={images.length}
                  altBase={altBase}
                  width="47%"
                />
              ))}
            </div>
          );
        }
        const img = images[cursor];
        const index = cursor;
        cursor += 1;
        const width = softenLarge && row.width === '100%' ? '72%' : row.width;
        return (
          <Plate
            key={img.src}
            img={img}
            index={index}
            total={images.length}
            altBase={altBase}
            width={width}
          />
        );
      })}
    </div>
  );
}

function Plate({
  img,
  index,
  total,
  altBase,
  width,
}: {
  img: ProjectImage;
  index: number;
  total: number;
  altBase: string;
  width: string;
}) {
  return (
    <figure
      data-parallax
      data-lum={img.lum ?? 0.5}
      className="frame"
      style={{
        width,
        margin: 0,
        aspectRatio: img.w && img.h ? `${img.w} / ${img.h}` : '3 / 2',
        /* No plate on the reference is taller than 78% of the window. */
        maxHeight: '78vh',
      }}
    >
      <img
        src={img.src}
        srcSet={`${img.sm} 900w, ${img.src} 2000w`}
        sizes="58vw"
        width={img.w}
        height={img.h}
        alt={`${altBase} — image ${index + 1} of ${total}`}
        loading={index === 0 ? 'eager' : 'lazy'}
        decoding="async"
      />
    </figure>
  );
}
