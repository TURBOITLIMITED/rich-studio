import Link from 'next/link';
import ProjectSection from '@/components/ProjectSection';
import Block from '@/components/Block';
import { homeProjects, indexProjects } from '@/lib/projects';
import { STUDIO_EMAIL } from '@/lib/contact';

/* Every word on this page is Rich's own, from richcolvill.com. The
   reference site's register — "own the beauty" — belongs to a French
   luxury house and would be a costume on him. */

const PAD = 'clamp(14px, 4vw, 64px)';

export default function Home() {
  const featured = homeProjects();
  const rest = indexProjects();

  return (
    <>
      {/* ---------- Hero: his showreel, under the fixed wordmark ---------- */}
      <section
        aria-label="Showreel"
        style={{
          minHeight: '100svh',
          display: 'grid',
          gridTemplateRows: '1fr auto',
          paddingTop: 'calc(var(--wordmark-size) * 0.92)',
          paddingInline: PAD,
          paddingBottom: 'clamp(48px, 8vh, 96px)',
        }}
      >
        <div style={{ position: 'relative', width: '100%' }}>
          <video
            src="/video/reel.mp4"
            poster="/video/reel-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Rich Colvill Studio showreel"
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              maxHeight: '62vh',
            }}
          />
        </div>

        {/* The page's real heading. The wordmark above is fixed furniture
            repeated on every route and hidden from assistive tech, so it
            cannot carry the h1. */}
        <h1
          className="t-label"
          style={{ textAlign: 'center', marginTop: 'clamp(20px, 4vh, 44px)', marginBottom: 0 }}
        >
          Branding / Design / Creative Production
        </h1>
      </section>

      {/* ---------- What the studio does. His words, justified. ---------- */}
      <section
        aria-label="What we do"
        style={{ paddingInline: PAD, paddingBlock: 'clamp(80px, 16vh, 220px)' }}
      >
        <Block>
          <p className="t-meta" style={{ textAlign: 'center', marginBottom: 'clamp(24px, 4vh, 48px)' }}>
            What we do
          </p>
        </Block>
        <Block>
          <p className="t-statement" style={{ maxWidth: '78ch', marginInline: 'auto' }}>
            We help businesses stand out through creative production. — A team of
            creative creatures focussed on executing high end branding, visuals and
            roll-out. — Over 25 years working with Silverstone, Absolut, Odeon,
            Wall’s, Vivienne Westwood, Molton Brown and more.
          </p>
        </Block>
      </section>

      {/* ---------- The outlined pull-quote. His line, not a written one. ---------- */}
      <section aria-label="Get in touch" style={{ paddingInline: PAD, paddingBottom: 'clamp(60px, 12vh, 160px)' }}>
        <Block>
          <div
            style={{
              border: '1.5px solid var(--color-ink)',
              maxWidth: 620,
              marginInline: 'auto',
              padding: 'clamp(22px, 3vw, 38px) clamp(18px, 3vw, 40px)',
            }}
          >
            <p className="t-quote m-0">
              Let’s get together, over e-mail, WhatsApp, Zoom, phone or even better
              over a beer, have a chat and see how we can take your brief to the
              next level.
            </p>
            <p className="t-quote m-0" style={{ marginTop: '1.2em', color: 'var(--color-magenta)' }}>
              <a href={`mailto:${STUDIO_EMAIL}`} className="link-underline">
                Get ®Rich quick.
              </a>
            </p>
          </div>
        </Block>
      </section>

      {/* ---------- The work ---------- */}
      {featured.map((p, i) => (
        <ProjectSection key={p.slug} project={p} index={i} />
      ))}

      {/* ---------- Everything else ---------- */}
      <section
        aria-label="More work"
        style={{
          paddingInline: PAD,
          paddingBlock: 'clamp(100px, 18vh, 240px)',
          textAlign: 'center',
        }}
      >
        <Block>
          <p className="t-meta" style={{ marginBottom: 18 }}>
            {rest.length} more projects
          </p>
          <p className="t-wordmark m-0" style={{ fontSize: 'clamp(2rem, 7vw, 6rem)', lineHeight: 0.9 }}>
            <Link href="/work" className="link-underline">
              See the work
            </Link>
          </p>
        </Block>
      </section>

    </>
  );
}
