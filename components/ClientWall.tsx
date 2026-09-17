/**
 * The client wall — Rich's slide, placed as artwork.
 *
 * He sent the slide and asked for it "towards the bottom of the page".
 * This was first rebuilt as markup: his portrait, his copy, and the 25
 * clients set as TYPE, because the logo files have never arrived. That was
 * wrong twice over — it used a different photograph, and setting the
 * clients as words threw away the one thing the section exists for, which
 * is the logos. His answer: "the logos have gone, drop the image in."
 *
 * So the slide goes in whole. It is his own artwork, so there is nothing
 * to adapt: the photograph, the line-art, the copy, the rules and all 25
 * marks are exactly as he drew them, because they ARE his file.
 *
 * WHAT THIS COSTS, so that it is a decision rather than an accident:
 *  - It is a 1390x732 JPEG. Full-bleed that is native at a 1390px window
 *    and roughly a 2x upscale on a retina laptop. It gets sharper only if
 *    he sends the artwork bigger — an export around 2800px wide would be
 *    exact.
 *  - The copy inside it is pixels: it cannot reflow, cannot be selected,
 *    and is invisible to search. The alt text carries the whole sentence
 *    and all 25 client names so the content still exists for anything that
 *    cannot see the picture.
 *  - A 1.9:1 slide holding 25 marks cannot stay legible on a phone at any
 *    sane height. Below 860px it simply scales to the width and gets
 *    smaller; if that is not good enough the answer is a second, portrait
 *    artwork from him rather than CSS.
 *
 * Going back to markup later is a contained job — this component is the
 * only thing that would change.
 */

const CLIENTS =
  'Birra Moretti, Cloud Nine, Odeon, Wall’s, Vivienne Westwood, Sony, ' +
  'Molton Brown, Nestlé, Penhaligon’s, Lego, Absolut, Silverstone, Henkel, ' +
  'BP, BBC, Virgin, Hisense, Hellmann’s, Sika, Strongbow, Johnson & Johnson, ' +
  'Jägermeister, Sellotape, DHL, Costa';

export default function ClientWall() {
  return (
    /* data-lum so BackdropContrast colours the fixed mark and the running
       ticker against it — the slide's ground is #0c0f14, and without this
       the mark stays ink on ink and disappears for the height of the band. */
    <section className="wall" aria-label="Selected clients" data-lum={0.12}>
      <img
        src="/about/client-wall.webp"
        srcSet="/about/client-wall-sm.webp 900w, /about/client-wall.webp 1390w"
        sizes="100vw"
        width={1390}
        height={732}
        alt={`With over 25 years industry experience, I’ve been lucky enough to work across a variety of categories and brands shown below. Clients: ${CLIENTS}.`}
        loading="lazy"
        decoding="async"
      />
    </section>
  );
}
