import Link from 'next/link';
import { getProject } from '@/lib/projects';

/**
 * The scatter band — eight projects, 06 to 13, overlapping, between the last
 * pinned project and the doorway to the index.
 *
 * Asked for off redsofa.com's scattered work section. Measured there at
 * 1440x900 before copying anything: twelve tiles at two widths, 448px and
 * 290px (a 1.545x ratio), leftmost x 29px, and top-to-top steps of
 * 132/49/235/37/90/49px. Those STEPS are taken verbatim — at 1440 the tops
 * here land at 0/132/181/416/453/543/592. Its motion was measured too: the
 * image sits at scale(1.2) inside its frame and drifts, the wrapper
 * translates, and opacity stays 1 the whole way. No fade. That is exactly
 * what [data-parallax] already does on this site, so the entrance is ours
 * rather than a new primitive.
 *
 * WHAT WAS DELIBERATELY NOT COPIED:
 *
 *  - Rounded corners. The reference rounds a wrapper; the images themselves
 *    measure border-radius 0. Square is both faithful and this site's own
 *    language, so there was nothing to trade.
 *  - Free-roaming x. Tiles here snap to the page's OWN twelfths — 8.33vw
 *    units, the grid .project-pin (16.7%) and .project-stack (58.4%) are
 *    already measured on. So this reads as that grid loosened, not as a
 *    second website pasted into the page.
 *  - Its 0.67-1.78 aspect spread. Six of these eight projects are honestly
 *    16:9; only Physio Action (0.667), Sika (1.133) and Annabelles (1.333)
 *    have another shape in the archive at all. Cropping Rich's framing to
 *    manufacture variety is the one move this page must not make — he is a
 *    designer and the framing is the work. Three real shapes across eight
 *    tiles is what there is; the rhythm comes from SIZE and POSITION
 *    instead, which is where most of the reference's life comes from anyway.
 *
 * Each tile is a real plate at its real aspect, picked for reading small:
 * several of the obvious covers are near-white and would dissolve into
 * #f0f0ef with no border to stop them.
 *
 * NOTE for whoever touches BackdropContrast next: this is the first place on
 * the site where [data-lum] rects OVERLAP each other. It area-weights by
 * w*h*lum with no overlap subtraction, so overlapped area is counted twice.
 * Harmless here — every tile is 0.22-0.40, so the mean stays dark whatever
 * the weighting — but it becomes a real bug the day a light plate joins the
 * band.
 */

/** The page's twelfth. */
const COL = 100 / 12;
/** Two widths, 1.50x apart, against the reference's 1.545x. */
const WIDE = COL * 4.5;
const NARROW = COL * 3;

type Tile = {
  slug: string;
  /** Index into the project's own images — several of these are NOT the
   *  cover, because the cover does not always read at 300-450px wide. */
  img: number;
  /** Left edge, in twelfths of the viewport. */
  col: number;
  /** Top, in vw, from the band's top. */
  top: number;
  wide: boolean;
};

const TILES: Tile[] = [
  { slug: 'hayton', img: 0, col: 1.0, top: 0, wide: true },
  { slug: 'physio-action', img: 2, col: 3.25, top: 9.17, wide: false },
  { slug: 'sika', img: 0, col: 4.5, top: 12.57, wide: true },
  { slug: 'annabelles', img: 0, col: 6.0, top: 28.89, wide: false },
  { slug: 'apollo-financial', img: 1, col: 6.5, top: 31.46, wide: true },
  { slug: 'berry-s', img: 0, col: 7.5, top: 37.71, wide: false },
  { slug: 'burgo', img: 5, col: 8.0, top: 41.11, wide: false },
  // The eighth closes the composition rather than extending it: the drift
  // runs left-to-right down the page and leaves the bottom-left empty, so
  // this fills it and overlaps Physio Action on the way. It adds only
  // 0.9vw to the band's height.
  { slug: 'by-bryony', img: 3, col: 1.0, top: 42.0, wide: false },
];

export default function WorkScatter({ startIndex }: { startIndex: number }) {
  const rows = TILES.map((t) => {
    const p = getProject(t.slug);
    if (!p) throw new Error(`WorkScatter: no project "${t.slug}"`);
    const img = p.images[t.img];
    if (!img) throw new Error(`WorkScatter: ${t.slug} has no image ${t.img}`);
    const w = t.wide ? WIDE : NARROW;
    /* The -sm variant is generated to a 900px LONG EDGE, so on a portrait
       its WIDTH is not 900 — Physio Action's is 600x900. A hardcoded
       "900w" descriptor there tells the browser the file is half again
       wider than it is, and it picks it for slots it cannot fill: exactly
       the soft-image complaint this site has had before. Derived from the
       real aspect instead. */
    const smW = img.w >= img.h ? 900 : Math.round((900 * img.w) / img.h);
    return { t, p, img, w, h: w / (img.w / img.h), smW };
  });

  /* Absolutely positioned tiles do not size their parent, so the band's
     height is derived from the same table that places them and cannot
     drift out of step with it. Same approach as --foot-lockup-max. */
  const height = Math.max(...rows.map((r) => r.t.top + r.h));

  return (
    <section aria-label="More work" className="scatter" style={{ height: `${height}vw` }}>
      {rows.map(({ t, p, img, w, h, smW }, i) => (
        <Link
          key={t.slug}
          href={`/work/${t.slug}`}
          className="scatter-tile"
          style={{ left: `${t.col * COL}vw`, top: `${t.top}vw`, width: `${w}vw` }}
        >
          <figure
            className="frame"
            data-parallax
            data-lum={img.lum ?? 0.5}
            style={{ aspectRatio: `${img.w} / ${img.h}`, margin: 0, height: `${h}vw` }}
          >
            <img
              src={img.src}
              srcSet={`${img.sm} ${smW}w, ${img.src} ${img.w}w`}
              sizes={`(max-width: 860px) 100vw, ${Math.round(w)}vw`}
              width={img.w}
              height={img.h}
              alt={`${p.title} — ${p.category}`}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <span className="scatter-num t-meta">
            {String(startIndex + i + 1).padStart(2, '0')}
            <span className="scatter-title"> {p.title}</span>
          </span>
        </Link>
      ))}
    </section>
  );
}
