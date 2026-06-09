export interface BaseProject {
  id: number | string;
  date: string;
  title: string;
  cliente?: string;
  thumb?: string;
  imagenes?: Array<{ image: string; label?: string }>;
  stack?: string[];
  [key: string]: unknown;
}

export interface Project {
  num: string;
  title: string;
  tipo: string;
  year: string;
  category?: string;
  href: string;
}

export interface RecentProjectsSectionProps {
  projects: Project[];
  viewAllHref?: string;
}
