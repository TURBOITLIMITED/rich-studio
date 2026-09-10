import type { Metadata } from 'next';
import Link from 'next/link';
import Block from '@/components/Block';
import { allProjects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Branding, packaging, campaign and creative production work from ®Rich Colvill Studio.',
};

const PAD = 'var(--gutter)';

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
    <div className="reads-in-front">
      <section
        style={{
          marginTop: 'calc(var(--wordmark-size) * 1.15)',
          paddingInline: PAD,
          paddingBottom: 'clamp(40px, 8vh, 90px)',
        }}
      >
        <Block>
          <h1 className="t-meta m-0">Index — {projects.length} projects</h1>
        </Block>
      </section>

      <section style={{ paddingInline: PAD, paddingBottom: 'clamp(80px, 14vh, 180px)' }}>
        {/* The RSC mark is pinned to the RIGHT edge, vertically centred, so
            the list is inset past it on that side or the image counts —
            which are right-aligned — run underneath the rings. The inset
            was on the left while the mark was. */}
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            paddingRight: 'clamp(0px, 5.2vw, 88px)',
          }}
        >
          {projects.map((p, i) => (
            <Block as="li" key={p.slug}>
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
            </Block>
          ))}
        </ul>
      </section>

    </div>
  );
}
