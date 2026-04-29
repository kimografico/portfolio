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
