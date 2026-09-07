/**
 * The case-study hero: one crisp full-bleed plate.
 *
 * This used to print itself — a WebGL separation from lib/press.ts painted
 * the image as four ink plates pulling into register under the scroll. The
 * client has settled on a reference whose heroes are simply photographs,
 * so the canvas, the shader wiring and the sessionStorage hand-off from
 * the rail are all gone and this is an <img>.
 *
 * lib/press.ts itself STAYS: components/PressHero.tsx still imports it for
 * the homepage book rail, which is preserved by client instruction.
 *
 * `caption` defaults true so any future caller keeps the old behaviour;
 * the case study passes false because its <h1> now lives in .cs-masthead
 * below the plate, which is where the reference sets it. That keeps
 * exactly one h1 on the page.
 *
 * The .pin-host wrapper stays even though nothing here pins any more:
 * lib/motion.ts can still pin .cs-hero, and that wrapper is the
 * React-owned node that stops ScrollTrigger's generated .pin-spacer
 * throwing on unmount.
 */
export default function RegistrationHero({
  src,
  alt,
  title,
  client,
  meta,
  caption = true,
}: {
  src: string;
  alt: string;
  title: string;
  client: string;
  meta: string;
  caption?: boolean;
}) {
  return (
    <div className="pin-host">
      <div className="cs-hero">
        <div className="cs-hero-media">
          <img src={src} alt={alt} className="cs-hero-img" />
        </div>

        {caption && (
          <div className="cs-hero-caption sheet">
            <span className="t-mono cs-hero-client">{client}</span>
            <h1 className="t-display cs-hero-title">{title}</h1>
            <span className="t-mono cs-hero-meta">{meta}</span>
          </div>
        )}
      </div>
    </div>
  );
}
