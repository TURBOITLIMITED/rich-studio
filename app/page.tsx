import Link from 'next/link';
import HeroReveal from '@/components/HeroReveal';
import ProjectSection from '@/components/ProjectSection';
import Block from '@/components/Block';
import WorkScatter from '@/components/WorkScatter';
import { homeProjects, restProjects } from '@/lib/projects';
import { STUDIO_EMAIL } from '@/lib/contact';

/* Every word on this page is Rich's own, from richcolvill.com. The
   reference site's register — "own the beauty" — belongs to a French
   luxury house and would be a costume on him. */

const PAD = 'var(--gutter)';

export default function Home() {
  const featured = homeProjects();
  const rest = restProjects();

  return (
    <>
      {/* ---------- Hero: the curtain opens on his showreel ---------- */}
      <HeroReveal>
        {/* The page's real heading. The wordmark is fixed furniture
            repeated on every route and hidden from assistive tech, so it
            cannot carry the h1. */}
        <h1 className="t-hero-caption" style={{ margin: 0 }}>
          Branding / Design / Creative Production
        </h1>
      </HeroReveal>

      {/* ---------- What the studio does. His words, justified. ---------- */}
      <section
        aria-label="What we do"
        className="clears-mark"
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
          {/* No rule around it. Rich, 2026-09-14: "lose that box around that
              get rich section at top. so its just copy." The measure and
              the centring stay — they are what hold it as a block — but
              the border and the padding it existed to create are gone. */}
          <div style={{ maxWidth: 620, marginInline: 'auto' }}>
            <p className="t-quote m-0">
              Let’s get together, over e-mail, WhatsApp, Zoom, phone or even better
              over a beer, have a chat and see how we can take your brief to the
              next level.
            </p>
            <p className="t-quote m-0" style={{ marginTop: '1.2em' }}>
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

      {/* ---------- The next eight, scattered ---------- */}
      {/* Asked for off redsofa.com. Eight more projects, 06-13, overlapping
          rather than listed — see WorkScatter for what was measured off the
          reference, what was deliberately not copied, and why each plate is
          the one it is. startIndex continues the featured five's numbering
          instead of hardcoding 6. */}
      <WorkScatter startIndex={featured.length} />

      {/* ---------- The doorway to everything else ---------- */}
      {/* Asymmetric on purpose. This is the last thing before the footer, so
          at the bottom of the page its DISTANCE FROM THE END is what decides
          where it sits on screen — the padding above it does nothing there.
          Closing up the bottom is what drops it down the window and fills
          the empty band that used to sit between it and the rule.
          The count is restProjects(), NOT indexProjects(): eight of them are
          now on screen immediately above this, and offering 22 more would be
          counting them twice. */}
      {/* A full screen of its own, and the reason is that nothing smaller
          is reliable. Scrolled to the very bottom, this section plus the
          footer are all that is on screen, and together they fell short of
          a viewport at every size tested — so the last scatter tile hung
          137-244px into the top of the window. Rich: "when I'm all the way
          at the bottom I can see number 13 at the top still."
          The obvious fix is a min-height tuned against the footer's share
          of the window, and it does not hold: the footer measures 44% of
          the viewport at 1440x900 but 29% at 768x1024, because its lockup
          is width-driven. 58svh left 16px showing, 63svh still failed on an
          iPad. So this is 100svh instead — the doorway alone fills the
          window, which guarantees the band is off-screen at EVERY size
          without estimating anything. The content centres in it rather
          than sitting under a big pad, so the extra height reads as a
          deliberate closing page instead of a gap. */}
      <section
        aria-label="The full index"
        style={{
          paddingInline: PAD,
          paddingBlock: 'clamp(50px, 9vh, 130px)',
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          textAlign: 'center',
        }}
      >
        <Block>
          <p className="t-meta" style={{ marginBottom: 18 }}>
            {rest.length} more projects
          </p>
          <p className="t-display m-0">
            <Link href="/work" className="link-underline">
              View more work
            </Link>
          </p>
        </Block>
      </section>

    </>
  );
}
