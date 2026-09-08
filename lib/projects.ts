import data from '@/content/projects.json';

export type ProjectImage = {
  src: string;
  sm: string;
  w: number;
  h: number;
  orient: 'portrait' | 'landscape' | 'square';
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

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
