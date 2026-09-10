import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Collage from '@/components/Collage';
import Block from '@/components/Block';
import { getProject, projectSlugs } from '@/lib/projects';

const PAD = 'var(--gutter)';

/* output: 'export' means every route is built ahead of time, so the
   slug list has to be exhaustive — there is no fallback renderer. */
export function generateStaticParams() {
  return projectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: 'Not found' };
  return {
    title: p.title,
    description: p.summary,
    openGraph: {
      title: `${p.title} — ®RICH COLVILL`,
      description: p.summary,
      images: p.images[0] ? [{ url: p.images[0].src }] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      {/* The reference pins the project name and a close control at the
          top of the case study. The close goes back to the index rather
          than history, so a shared link never dead-ends. */}
      <section
        style={{
          paddingTop: 'calc(var(--wordmark-size) * 1.15)',
          paddingInline: PAD,
          paddingBottom: 'clamp(30px, 6vh, 70px)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 24,
          alignItems: 'start',
        }}
      >
        <div>
          <h1 className="t-label m-0">{project.title}</h1>
          <p className="t-meta m-0" style={{ marginTop: 6 }}>
            {project.category}
            {' · '}
            {project.kind}
            {project.credit ? ` · ${project.credit}` : ''}
          </p>
        </div>
        <Link href="/work" className="t-meta link-underline" aria-label="Close and return to the index">
          Close ×
        </Link>
      </section>

      <section
        className="clears-mark"
        style={{ paddingInline: PAD, paddingBottom: 'clamp(50px, 10vh, 120px)' }}
      >
        <Block>
          <p className="t-body" style={{ maxWidth: '52ch' }}>
            {project.summary}
          </p>
        </Block>
      </section>

      <Collage images={project.images} altBase={project.title} softenLarge={project.slug === 'ces-enfants'} />

      <section
        style={{
          paddingInline: PAD,
          paddingBlock: 'clamp(90px, 16vh, 200px)',
          textAlign: 'center',
        }}
      >
        <Block>
          <Link href="/work" className="t-label link-underline">
            All work
          </Link>
        </Block>
      </section>

    </>
  );
}
