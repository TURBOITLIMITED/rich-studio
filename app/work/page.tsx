import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { allProjects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Branding, packaging, campaign and creative production work from ®Rich Colvill Studio.',
};

const PAD = 'clamp(14px, 4vw, 64px)';

/**
 * The index is a list, not a grid of thumbnails. At 11px type
 * against the fixed wordmark it reads as an contents page, which
 * is the right register — the images do their arguing inside the
 * case studies, not here.
 */
export default function Work() {
  const projects = allProjects().sort(
    (a, b) => Number(b.home) - Number(a.home) || b.quality - a.quality || a.title.localeCompare(b.title),
  );

  return (
    <>
      <section
        style={{
          paddingTop: 'calc(var(--wordmark-size) * 1.15)',
          paddingInline: PAD,
          paddingBottom: 'clamp(40px, 8vh, 90px)',
        }}
      >
        <Reveal>
          <h1 className="t-meta m-0">Index — {projects.length} projects</h1>
        </Reveal>
      </section>

      <section style={{ paddingInline: PAD, paddingBottom: 'clamp(80px, 14vh, 180px)' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {projects.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={Math.min(i, 8) * 40}>
              <Link
                href={`/work/${p.slug}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,3fr) minmax(0,3fr) minmax(0,2fr) auto',
                  gap: 'clamp(10px, 2vw, 28px)',
                  alignItems: 'baseline',
                  paddingBlock: 'clamp(14px, 2.2vh, 22px)',
                  borderTop: '1px solid var(--color-rule)',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <span className="t-label">{p.title}</span>
                <span className="t-meta">{p.category}</span>
                <span className="t-meta">
                  {p.credit ?? p.kind}
                </span>
                <span className="t-meta" style={{ textAlign: 'right' }}>
                  {String(p.images.length).padStart(2, '0')}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <div aria-hidden="true" style={{ height: 'clamp(56px, 8vh, 88px)' }} />
    </>
  );
}
