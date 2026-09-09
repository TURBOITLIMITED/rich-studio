import Link from 'next/link';
import type { Project } from '@/lib/projects';
import Collage from './Collage';

/**
 * One project, laid out the way the reference lays one out.
 *
 * Measured at 1700x887: a two-column block with the title column PINNED
 * (position: sticky, top 0, 100dvh tall, starting 15dvh below the section
 * top) at 8.3%-25% of the viewport, and the image stack static at
 * 33.3%-91.7%. Sections run back to back with no gap between them —
 * project[N].bottom === project[N+1].top at every sample.
 *
 * There is no handover animation, and that is the important part: nothing
 * cross-fades, nothing clips, nothing swaps text in place. Across ~1200
 * opacity samples over two handovers the reference measured opacity 1.000
 * with zero exceptions. The "and then it changes to the next one" is
 * emergent — section N's title is simply shoved off the top edge as its
 * track runs out while section N+1's is pushed up from below, and for
 * about a viewport height both are partly on screen. Stack the sections
 * and the transition happens by itself. Do not write handover code.
 *
 * 8.3% is also why the title clears the RSC mark, which is pinned to the
 * left edge and reaches about 108px at this width.
 *
 * The pinned column carries the name and the service tag and nothing else,
 * which is all the reference puts there. A summary paragraph was tried
 * here and had to come out: the column sits directly under the masthead,
 * and small copy passing behind 200px of solid black is the intended
 * effect for a line or two but not for a paragraph — it was unreadable.
 * The summary belongs on the case study, where it already is.
 */
export default function ProjectSection({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const cover = project.images.length >= 3 ? project.images[0] : null;
  const rest = cover ? project.images.slice(1) : project.images;

  return (
    <section
      id={project.slug}
      aria-labelledby={`${project.slug}-title`}
      className="project-block"
    >
      <div className="project-pin">
        <p className="t-meta m-0" style={{ marginBottom: '0.9em' }}>
          {String(index + 1).padStart(2, '0')}
        </p>
        <h2 id={`${project.slug}-title`} className="t-project m-0">
          <Link href={`/work/${project.slug}`} className="link-underline">
            {project.title}
          </Link>
        </h2>
        <p className="t-service m-0">
          {project.category}
          {' · '}
          {project.kind}
          {project.credit ? ` · ${project.credit}` : ''}
        </p>

        {/* The cover, under the title. The reference runs one here at
            x 7.5% and 18.3% wide — slightly wider than its own 8.3%
            column, so it sits a little proud of the type above it. A
            project with only a couple of images keeps them all in the
            stack rather than spending one on a thumbnail. */}
        {cover ? (
          <figure
            data-parallax
            data-lum={cover.lum ?? 0.5}
            className="frame project-cover"
            style={{ aspectRatio: cover.w && cover.h ? `${cover.w} / ${cover.h}` : '3 / 2' }}
          >
            <img
              src={cover.sm}
              width={cover.w}
              height={cover.h}
              alt={`${project.title} — image 1 of ${project.images.length}`}
              loading="lazy"
              decoding="async"
            />
          </figure>
        ) : null}
      </div>

      <div className="project-stack">
        <Collage
          images={rest}
          altBase={project.title}
          softenLarge={project.slug === 'ces-enfants'}
          offset={cover ? 1 : 0}
          total={project.images.length}
        />
      </div>
    </section>
  );
}
