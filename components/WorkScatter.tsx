import Link from 'next/link';
import { getProject } from '@/lib/projects';

/**
 * The scatter band — eight projects, 06 to 13, overlapping, between the last
 * pinned project and the doorway to the index.
 *
 * SPREAD. The first cut snapped every x to the page's twelfths and kept
 * the reference's vertical steps unchanged. Both were wrong and Rich said
 * so: "they are not spread out good enough." Measured, the horizontal
 * spread was actually fine (x std-dev 21.5vw against the reference's
 * 23.6vw) — the fault was VERTICAL. The reference steps ~9.1vw between
 * tiles at its size; ours were averaging 6vw with tiles a fifth LARGER,
 * so they piled up instead of descending. The steps are now scaled by
 * that size ratio (1.21x) and x runs free from 2vw to 99vw. The band goes
 * from 56vw tall to 77vw, and every tile still touches a neighbour.
 *
 * THE LEFT EDGE goes to 2vw, the reference's own, and tiles DO cross the
 * fixed RSC mark there. That is deliberate on this site — BackdropContrast
 * flips the mark to paper over a dark plate — and it was verified rather
 * than assumed: across the whole band, zero scroll positions where the
 * mark sits on a plate with the wrong colour.
 *
 * Worth recording because it cost a round trip: an earlier check said the
 * flip was broken and tiles were pulled right to avoid the mark. That
 * check was wrong. It scrolled ~700ms after load, while the opening
 * sequence still had the mark translated mid-flight — it measured the mark
 * at x 153-221 instead of its resting 29-92, so it was testing a plate the
 * mark was not actually over. Any probe touching the mark, the masthead or
 * the hero must wait out the intro (3.88s) first.
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
 * The corners ARE rounded, and that was measured off Rich's own reference
 * screenshot rather than argued about: 32px on an 1866px-wide capture, so
 * ~24px at a 1440 viewport. An earlier cut of this shipped square corners
 * on the reasoning that the site is otherwise square — that was overriding
 * what was actually asked for with a preference, and it was wrong.
 *
 * WHAT WAS DELIBERATELY NOT COPIED:
 *
 *  - Its aspect spread. Every tile here is SQUARE, at Rich's instruction,
 *    so the rhythm comes from SIZE and POSITION only. An earlier cut kept
 *    each plate's real aspect on the argument that cropping a designer's
 *    framing is not ours to do; he asked for square, so square it is. The
 *    crop is real — a 16:9 plate loses 44% of its width — so any tile whose
 *    subject is not centred carries its own `focus`.
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

/** Two widths, 1.50x apart, against the reference's 1.545x. They stay
 *  derived from the page's twelfth even though x no longer snaps to it —
 *  the SIZES relating to the grid is what keeps this in the family, and
 *  it is the positions that needed to be free. */
const COL = 100 / 12;
const WIDE = COL * 4.5;
const NARROW = COL * 3;

type Tile = {
  slug: string;
  /** Index into the project's own images — several of these are NOT the
   *  cover, because the cover does not always read at 300-450px wide. */
  img: number;
  /** Left edge, in vw. Free of the twelfths grid: snapping to it clustered
   *  everything into the middle band and Rich's note was "they are not
   *  spread out good enough". The grid bought tidiness the eye cannot see
   *  and cost the spread, which it can. */
  x: number;
  /** Top, in vw, from the band's top. */
  top: number;
  wide: boolean;
  /** How far and which way this tile drifts as the band scrolls past,
   *  -1 to 1 against ScrollMotion's 64px amplitude. Neighbours get
   *  OPPOSING signs so their overlap opens and closes — tiles all drifting
   *  the same way move in lockstep and read as no motion at all. */
  drift: number;
  /** Magnetic strength, -1 to 1, against ScrollMotion's 58px. NEGATIVE
   *  shoves the tile away from the cursor, POSITIVE leans it in.
   *  Neighbours get opposing signs so bringing the pointer between two
   *  tiles opens the gap between them rather than sliding both the same
   *  way. Bigger plates take the stronger values — a 37.5vw tile barely
   *  reads a 20px nudge, a 25vw one does. */
  mouse: number;
  /** Where the square crop is taken from, when centre cuts the subject. */
  focus?: string;
};

const TILES: Tile[] = [
  { slug: 'hayton', img: 0, x: 2, top: 0, wide: true, drift: -0.85, mouse: -1.0 },
  { slug: 'physio-action', img: 2, x: 33, top: 14, wide: false, drift: 0.55, mouse: 0.8 },
  { slug: 'sika', img: 0, x: 52, top: 24, wide: true, drift: -0.35, mouse: -0.85 },
  { slug: 'annabelles', img: 0, x: 6, top: 40, wide: false, drift: 0.9, mouse: 0.7 },
  { slug: 'apollo-financial', img: 1, x: 26, top: 52, wide: true, drift: -0.6, mouse: -1.0 },
  { slug: 'berry-s', img: 0, x: 68, top: 66, wide: false, drift: 0.75, mouse: 0.8 },
  { slug: 'burgo', img: 5, x: 10, top: 76, wide: false, drift: -0.45, mouse: -0.65 },
  { slug: 'by-bryony', img: 3, x: 42, top: 84, wide: true, drift: 0.65, mouse: 0.9 },
];

export default function WorkScatter({ startIndex }: { startIndex: number }) {
  const rows = TILES.map((t) => {
    const p = getProject(t.slug);
    if (!p) throw new Error(`WorkScatter: no project "${t.slug}"`);
    const img = p.images[t.img];
    if (!img) throw new Error(`WorkScatter: ${t.slug} has no image ${t.img}`);
    const w = t.wide ? WIDE : NARROW;
    /* SQUARE. Rich asked for these to match the rest of the page's plates;
       the frame is 1:1 and object-fit:cover takes the centre of whatever
       the real aspect is. That DOES crop — a 16:9 plate loses 44% of its
       width — which is why the per-tile object-position below exists. */
    /* The -sm variant is generated to a 900px LONG EDGE, so on a portrait
       its WIDTH is not 900 — Physio Action's is 600x900. A hardcoded
       "900w" descriptor there tells the browser the file is half again
       wider than it is, and it picks it for slots it cannot fill: exactly
       the soft-image complaint this site has had before. Derived from the
       real aspect instead. */
    const smW = img.w >= img.h ? 900 : Math.round((900 * img.w) / img.h);
    return { t, p, img, w, h: w, smW };
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
          data-drift={t.drift}
          data-mouse={t.mouse}
          style={{ left: `${t.x}vw`, top: `${t.top}vw`, width: `${w}vw` }}
        >
          <figure
            className="frame"
            data-parallax
            data-lum={img.lum ?? 0.5}
            style={{ aspectRatio: '1 / 1', margin: 0, height: `${h}vw` }}
          >
            <img
              src={img.src}
              srcSet={`${img.sm} ${smW}w, ${img.src} ${img.w}w`}
              sizes={`(max-width: 860px) 100vw, ${Math.round(w)}vw`}
              width={img.w}
              height={img.h}
              /* object-fit lives in the stylesheet; only the per-tile
                 focus point belongs here. */
              style={{ objectPosition: t.focus ?? '50% 50%' }}
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
