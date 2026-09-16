import type { Metadata } from 'next';
import Block from '@/components/Block';
import { DESKS, HOURS, STUDIO_EMAIL } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get ®Rich quick. Collaborations, enquiries and business — by appointment only, 11a–4p Monday and Thursday.',
};

/* His own words, from his own site. "GET ®RICH QUICK." is the line he
   already uses for this page; nothing here is written for him. Addresses
   come from lib/contact.ts so there is only ever one copy — an earlier
   build shipped an invented hello@ address. */

const PAD = 'var(--gutter)';

export default function Contact() {
  return (
    <div className="reads-in-front">
      {/* Headings at the gutter, in register with the fixed mark rather
          than inset past it. clears-mark moved off the page root and onto
          the sections whose copy actually runs beside the rings — the same
          change About needed, and for the same reason. */}
      <section
        style={{
          marginTop: 'calc(var(--wordmark-size) * 1.15)',
          paddingInline: PAD,
          paddingBottom: 'var(--section-gap-lead)',
        }}
      >
        <Block>
          <p className="t-meta m-0">Contact</p>
        </Block>
        <Block>
          {/* .t-display, not .t-wordmark: the masthead class is
              white-space:nowrap and a sentence set in it runs off the
              screen. About's h1 was clipped mid-word by exactly this. */}
          <h1 className="t-display m-0" style={{ marginTop: 18 }}>
            Get ®Rich quick.
          </h1>
        </Block>
        <Block>
          <p className="t-body" style={{ marginTop: 'clamp(22px, 4vh, 44px)' }}>
            Let’s get together, over e-mail, WhatsApp, Zoom, phone or even better
            over a beer, have a chat and see how we can take your brief to the
            next level.
          </p>
        </Block>
      </section>

      <section
        className="clears-mark"
        style={{ paddingInline: PAD, paddingBottom: 'var(--section-gap)' }}
      >
        <Block>
          <p className="t-meta" style={{ marginBottom: 10 }}>
            Email to arrange a time
          </p>
          <p
            className="t-wordmark m-0"
            style={{ fontSize: 'clamp(1.05rem, 3.4vw, 2.6rem)', lineHeight: 1 }}
          >
            <a
              href={`mailto:${STUDIO_EMAIL}`}
              className="link-underline"
            >
              {STUDIO_EMAIL}
            </a>
          </p>
          <p className="t-meta" style={{ marginTop: 16 }}>
            {HOURS}
          </p>
        </Block>
      </section>

      {/* Last section on the route, so it carries the band clearance —
          without it the desk list ends level with the fixed ticker and the
          running headline prints straight through it. */}
      <section
        className="clears-mark"
        style={{ paddingInline: PAD, paddingBottom: 'var(--section-gap-end)' }}
      >
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
            gap: 'clamp(18px, 3vw, 40px)',
          }}
        >
          {DESKS.map((d, i) => (
            <Block as="li" key={d.email}>
              <span className="t-meta" style={{ display: 'block', marginBottom: 8 }}>
                {d.role}
              </span>
              <a href={`mailto:${d.email.toLowerCase()}`} className="t-label link-underline">
                {d.email}
              </a>
            </Block>
          ))}
        </ul>
      </section>

    </div>
  );
}
