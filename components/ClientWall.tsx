import { STUDIO_EMAIL } from '@/lib/contact';

/**
 * The client wall — Rich's own deck slide, rebuilt as a section.
 *
 * He sent the slide and said he liked it "towards the bottom of the page".
 * Unlike the scatter band, this is not a third-party reference to adapt:
 * it is his own artwork, so the job is to reproduce its structure in the
 * site's materials rather than to decide which parts transfer.
 *
 * What the slide does, measured off it (1390x732, ground #0c0f14):
 *   - it INVERTS. The whole page is paper; this one band is ink, which is
 *     what makes it read as a closing statement rather than another
 *     section. The site already owns both values, so nothing new is
 *     introduced.
 *   - a portrait fills the left half, bled to the edges
 *   - the right half carries his line about 25 years, then GET (R)RICH
 *     QUICK. spread across the measure, then the clients
 *   - the clients sit in a 5 x 5 grid between two hairlines
 *
 * THE LOGOS ARE TYPE, AND THAT IS TEMPORARY. The slide shows 25 real
 * client marks; we have none of them — the Logos/ folder Rich shared on
 * 2026-09-14 held only his own three. Rather than block the section on an
 * asset delivery, the names are set in the site's own face, which is
 * Helvetica bold caps for everything already, so the grid reads as
 * deliberate rather than as a placeholder. Swapping in real marks is then
 * a drop-in: replace the <span> in each cell with an <img>, keep the grid.
 * Ask Rich for all 25 as SVG.
 *
 * The portrait is the shot he supplied, centre-cropped to the slide's
 * panel. It is a different frame from the one on the slide but the same
 * session and wardrobe, and it measures 0.136 luminance — already dark
 * enough to sit on ink without a scrim.
 */

/* The 25 from his slide, in his order, read left-to-right off the artwork.
   Two on the site's older About list are NOT here — Adidas and Pernod
   Ricard — and twelve here were not there. His slide is the newer source,
   so it wins; the About page keeps its own longer run. */
const CLIENTS = [
  'Birra Moretti', 'Cloud Nine', 'Odeon', "Wall's", 'Vivienne Westwood',
  'Sony', 'Molton Brown', 'Nestlé', "Penhaligon's", 'Lego',
  'Absolut', 'Silverstone', 'Henkel', 'BP', 'BBC',
  'Virgin', 'Hisense', "Hellmann's", 'Sika', 'Strongbow',
  'Johnson & Johnson', 'Jägermeister', 'Sellotape', 'DHL', 'Costa',
];

export default function ClientWall() {
  return (
    /* data-lum on the WHOLE band, not just the portrait. BackdropContrast
       reads [data-lum] rects to decide the fixed mark's and the running
       ticker's colour, and without it this section is invisible to that
       system: the mark stayed ink on an ink ground and disappeared for the
       height of the band. 0.10 is the ink itself (#1a1b1e = 0.108); the
       portrait measures 0.136, so a single value covers both halves and
       the mark flips to paper across the whole thing. */
    <section className="wall" aria-label="Selected clients" data-lum={0.1}>
      <div className="wall-portrait">
        <img
          src="/about/rich-portrait.webp"
          srcSet="/about/rich-portrait-sm.webp 864w, /about/rich-portrait.webp 1344w"
          sizes="(max-width: 860px) 100vw, 46vw"
          width={1344}
          height={1400}
          alt="Rich Colvill"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="wall-body">
        <p className="wall-lead m-0">
          With over 25 years industry experience, I’ve been lucky enough to work
          across a variety of categories and brands shown below.
        </p>

        {/* His own line, set the way the slide sets it: three parts pushed
            apart across the full measure rather than a centred phrase. */}
        <p className="wall-cta m-0">
          <a href={`mailto:${STUDIO_EMAIL}`} className="link-underline">
            <span>Get</span>
            <span>®Rich</span>
            <span>quick.</span>
          </a>
        </p>

        <ul className="wall-grid">
          {CLIENTS.map((c) => (
            <li key={c} className="wall-client">
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
