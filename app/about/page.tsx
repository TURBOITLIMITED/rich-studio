import type { Metadata } from 'next';
import Block from '@/components/Block';
import { STUDIO_EMAIL } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'About',
  description:
    'A team of creative creatures focussed on executing high end branding, visuals and roll-out. Over 25 years industry experience.',
};

/* Everything on this page is copy Rich has written elsewhere on his own
   site. Nothing is invented. He still owes a real studio bio and a
   portrait — the slots are noted in the handover, not filled with
   placeholder prose.

   Rich, 2026-09-16: "about needs to change, wrong format, everything
   looks off compared to the rest of the site — positioning of the logo on
   the left and the lines at the bottom." All three were real:

   1. THE LOGO ON THE LEFT. `clears-mark` was on the page ROOT, so the
      meta label and the h1 were inset 112px with the running copy. Every
      other route puts headings at the gutter and insets only the copy and
      lists that would actually run through the rings (/work/ sets its h1
      at 38px and insets the list separately). So About alone sat shifted
      right, out of register with the fixed mark at x 28.8–92.2. The class
      now goes on the sections that need it, which is the site's own
      convention rather than a new one.

   2. THE LINES AT THE BOTTOM. The client list was fifteen cells, each
      with its own `border-top`, which at 1440 resolved into three
      full-width rules in 11px caps — the same register as the running
      ticker band, stacked directly above it. It read as extra rows of the
      ticker. It is now one justified run, the idiom already used for the
      statement above it and on the home page: same names, no rules, and
      nothing left that mimics the band.

   3. THE FORMAT. The h1 was .t-wordmark (the MASTHEAD class, which is
      `white-space: nowrap`) with an inline font-size, so it ran off the
      right edge and was clipped mid-word. It is now .t-display, and the
      section rhythm comes from the shared tokens instead of three
      hand-picked clamps that matched no other page. */

const CLIENTS = [
  'SILVERSTONE', 'ADIDAS', 'ODEON', "WALL'S", 'PERNOD RICARD',
  'VIVIENNE WESTWOOD', 'NESTLE', 'ABSOLUT', 'DHL', 'COSTA',
  'SELLOTAPE', 'SONY', "PENHALIGON'S", 'CLOUD NINE', 'MOLTON BROWN',
];

const SECTORS = [
  'DRINKS', 'BEAUTY', 'FASHION', 'CONSUMER GOODS',
  'PROFESSIONAL SERVICES', 'AUTOMOTIVE',
];

const PAD = 'var(--gutter)';

export default function About() {
  return (
    <div className="reads-in-front">
      {/* Headings sit at the gutter, in register with the mark rather than
          pushed off it. No clears-mark here — the mark is beside the copy
          below, not beside the masthead. */}
      <section
        style={{
          marginTop: 'calc(var(--wordmark-size) * 1.15)',
          paddingInline: PAD,
          paddingBottom: 'var(--section-gap-lead)',
        }}
      >
        <Block>
          <p className="t-meta m-0">About</p>
        </Block>
        <Block>
          <h1 className="t-display m-0" style={{ marginTop: 18 }}>
            A team of creative creatures.
          </h1>
        </Block>
      </section>

      <section
        className="clears-mark"
        style={{ paddingInline: PAD, paddingBottom: 'var(--section-gap)' }}
      >
        <Block>
          <p className="t-statement" style={{ maxWidth: '70ch' }}>
            We help businesses stand out through creative production. — Rich
            Colvill® is a team of creative creatures focussed on executing high
            end branding, visuals and roll-out. — With over 25 years industry
            experience, working across a variety of brands.
          </p>
        </Block>
      </section>

      <section
        className="clears-mark"
        style={{ paddingInline: PAD, paddingBottom: 'var(--section-gap)' }}
      >
        <Block>
          <p className="t-meta" style={{ marginBottom: 18 }}>
            Sectors
          </p>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px 26px',
            }}
          >
            {SECTORS.map((s) => (
              <li key={s} className="t-label">
                {s}
              </li>
            ))}
          </ul>
        </Block>
      </section>

      {/* One run, not a ruled grid. Every name is still here; what has gone
          is fifteen border-tops resolving into three full-width rules in
          the ticker's own register, directly above the ticker. */}
      <section
        className="clears-mark"
        style={{ paddingInline: PAD, paddingBottom: 'var(--section-gap)' }}
      >
        <Block>
          <p className="t-meta" style={{ marginBottom: 18 }}>
            Selected clients
          </p>
          <p className="t-statement m-0" style={{ maxWidth: '70ch' }}>
            {CLIENTS.join(' — ')}.
          </p>
        </Block>
      </section>

      {/* Last section on the route, so it carries the band clearance. */}
      <section
        className="clears-mark"
        style={{ paddingInline: PAD, paddingBottom: 'var(--section-gap-end)' }}
      >
        <Block>
          <a href={`mailto:${STUDIO_EMAIL}`} className="t-label link-underline">
            Get ®Rich quick.
          </a>
        </Block>
      </section>

    </div>
  );
}
