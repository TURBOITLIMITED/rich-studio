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
   placeholder prose. */

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
    <>
      <section
        style={{
          paddingTop: 'calc(var(--wordmark-size) * 1.15)',
          paddingInline: PAD,
          paddingBottom: 'clamp(50px, 10vh, 120px)',
        }}
      >
        <Block>
          <p className="t-meta m-0">About</p>
        </Block>
        <Block>
          <h1
            className="t-wordmark m-0"
            style={{ fontSize: 'clamp(1.9rem, 6.4vw, 5.4rem)', lineHeight: 0.92, marginTop: 18 }}
          >
            A team of creative creatures.
          </h1>
        </Block>
      </section>

      <section style={{ paddingInline: PAD, paddingBottom: 'clamp(70px, 12vh, 160px)' }}>
        <Block>
          <p className="t-statement" style={{ maxWidth: '70ch' }}>
            We help businesses stand out through creative production. — Rich
            Colvill® is a team of creative creatures focussed on executing high
            end branding, visuals and roll-out. — With over 25 years industry
            experience, working across a variety of brands.
          </p>
        </Block>
      </section>

      <section style={{ paddingInline: PAD, paddingBottom: 'clamp(70px, 12vh, 160px)' }}>
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

      <section style={{ paddingInline: PAD, paddingBottom: 'clamp(70px, 12vh, 160px)' }}>
        <Block>
          <p className="t-meta" style={{ marginBottom: 18 }}>
            Selected clients
          </p>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 190px), 1fr))',
              gap: '10px 26px',
            }}
          >
            {CLIENTS.map((c) => (
              <li key={c} className="t-label" style={{ borderTop: '1px solid var(--color-rule)', paddingTop: 10 }}>
                {c}
              </li>
            ))}
          </ul>
        </Block>
      </section>

      <section style={{ paddingInline: PAD, paddingBottom: 'clamp(90px, 16vh, 200px)' }}>
        <Block>
          <a href={`mailto:${STUDIO_EMAIL}`} className="t-label link-underline" style={{ color: 'var(--color-magenta)' }}>
            Get ®Rich quick.
          </a>
        </Block>
      </section>

    </>
  );
}
