import Link from 'next/link';
import type { Project } from '@/lib/projects';
import Collage from './Collage';
import Block from './Block';

/**
 * One homepage project: a small metadata stack at the left, then
 * the collage. The reference sets its project titles at ~11px
 * against a 217px wordmark, and that ratio is the whole point —
 * the work is loud, the labelling is quiet.
 */
export default function ProjectSection({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <section
      id={project.slug}
      aria-labelledby={`${project.slug}-title`}
      style={{ paddingBlock: 'clamp(90px, 14vh, 200px) 0' }}
    >
      <Block>
        <header
          className="project-head"
          style={{
            paddingInline: 'var(--gutter)',
            marginBottom: 'clamp(26px, 4vh, 56px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(12px, 2vw, 28px)',
            alignItems: 'start',
          }}
        >
          {/* Starts at column 2, not 1: the RSC mark is pinned at the left
              edge, vertically centred, and a label in column 1 collided
              with it. Theirs sits at 8.4vw for the same reason. */}
          <div style={{ gridColumn: '2 / span 3' }}>
            <p className="t-meta m-0" style={{ marginBottom: 6 }}>
              {String(index + 1).padStart(2, '0')}
            </p>
            <h2 id={`${project.slug}-title`} className="t-label m-0">
              <Link href={`/work/${project.slug}`} className="link-underline">
                {project.title}
              </Link>
            </h2>
            <p className="t-meta m-0" style={{ marginTop: 6 }}>
              {project.category}
              {' · '}
              {project.kind}
              {project.credit ? ` · ${project.credit}` : ''}
            </p>
          </div>

          <div style={{ gridColumn: '5 / span 7' }}>
            <p className="t-body m-0">{project.summary}</p>
          </div>
        </header>
      </Block>

      <Collage
        images={project.images}
        altBase={project.title}
        softenLarge={project.slug === 'ces-enfants'}
      />
    </section>
  );
}
