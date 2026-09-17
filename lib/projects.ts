import data from '@/content/projects.json';

export type ProjectImage = {
  src: string;
  sm: string;
  w: number;
  h: number;
  orient: 'portrait' | 'landscape' | 'square';
  /** Mean luminance, 0-1, measured off the file by scripts/luminance.py.
   *  The running band is fixed to the foot of the viewport with no plate
   *  behind it, so it has to know how dark the plate passing underneath it
   *  is. 129 of Rich's 193 images sit below 0.45 — a permanently black
   *  band would be unreadable on two thirds of the archive. */
  lum?: number;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  client: string;
  summary: string;
  /** CONCEPT vs CLIENT. Curated from the archive, pending Rich's confirmation —
   *  the homepage opens on speculative work, so the distinction has to be visible. */
  kind: 'CONCEPT' | 'CLIENT';
  /** Set where the work is craft on someone else's campaign (retouching,
   *  compositing, photography). Without it the page implies full authorship. */
  credit?: string | null;
  home: boolean;
  order: number;
  quality: number;
  images: ProjectImage[];
  sourceFolder: string;
};

const projects = data as Project[];

export function allProjects(): Project[] {
  return projects;
}

export function homeProjects(): Project[] {
  return projects.filter((p) => p.home).sort((a, b) => a.order - b.order);
}

export function indexProjects(): Project[] {
  return projects
    .filter((p) => !p.home)
    .sort((a, b) => b.quality - a.quality || a.title.localeCompare(b.title));
}

/** The eight projects in the home page's scatter band, 06-13.
 *
 *  An explicit list rather than indexProjects().slice(0, 8): each tile's
 *  plate, its width and the corner its number sits in were chosen against
 *  that ONE image, so the composition must not silently re-order itself
 *  the day somebody edits a quality score. It equals the first eight
 *  today — see WorkScatter for how each was picked. */
export const SCATTER_SLUGS = [
  'hayton', 'physio-action', 'sika', 'annabelles',
  'apollo-financial', 'berry-s', 'burgo', 'by-bryony',
] as const;

/** What is left for the index once the band has already shown eight. The
 *  doorway copy counts THIS, not indexProjects() — otherwise it offers 22
 *  more projects while eight of them are on screen directly above it. */
export function restProjects(): Project[] {
  const shown = new Set<string>(SCATTER_SLUGS);
  return indexProjects().filter((p) => !shown.has(p.slug));
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
