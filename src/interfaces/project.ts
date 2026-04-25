export interface Project {
  num: string;
  title: string;
  tipo: string;
  year: string;
  href: string;
}

export interface RecentProjectsSectionProps {
  projects: Project[];
  viewAllHref?: string;
}
