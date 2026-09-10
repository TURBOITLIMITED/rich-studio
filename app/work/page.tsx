import type { Metadata } from 'next';
import Block from '@/components/Block';
import WorkList, { type WorkRow } from '@/components/WorkList';
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
 *
 * Rich's note: "it's just all lists, obviously nobody knows what any of
 * those things are — if you rolled over it maybe it could just have a
 * flow-in preview." So the register stays and the pictures arrive on
 * hover, where they cost the reader nothing until they want one.
 */
export default function Work() {
  const projects = allProjects().sort(
    (a, b) => Number(b.home) - Number(a.home) || b.quality - a.quality || a.title.localeCompare(b.title),
  );

  const rows: WorkRow[] = projects.map((p) => {
    // The cover unless the cover is a portrait and something landscape
    // is available — a preview that changes shape between rows draws the
    // eye to the box rather than the work inside it.
    const cover = p.images.find((i) => i.orient === 'landscape') ?? p.images[0];
    return {
      slug: p.slug,
      title: p.title,
      category: p.category,
      meta: p.credit ?? p.kind,
      count: String(p.images.length).padStart(2, '0'),
      preview: cover ? { src: cover.sm, w: cover.w, h: cover.h } : null,
    };
  });

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
        {/* The RSC mark is pinned at the left edge, vertically centred, so
            the list is inset past it or the project titles run underneath
            the rings. */}
        <WorkList rows={rows} />
      </section>

    </div>
  );
}
