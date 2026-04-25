/**
 * RecentProjectsSection: Sección de proyectos recientes.
 * Muestra una lista de proyectos con animaciones y navegación.
 */

import ProjectLine from '../ui/ProjectLine';

interface Project {
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

export default function RecentProjectsSection({
  projects,
  viewAllHref = '/diseno',
}: RecentProjectsSectionProps) {
  return (
    <section aria-labelledby="proyectos-heading" className="border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="flex items-baseline justify-between mb-8">
          <h2
            id="proyectos-heading"
            className="font-mono text-xs tracking-widest uppercase text-muted"
          >
            Proyectos recientes
          </h2>
          <a
            href={viewAllHref}
            className="text-xs text-muted hover:text-ink transition-colors duration-150"
          >
            Ver todos →
          </a>
        </div>
        <ul className="divide-y divide-border list-none m-0 p-0">
          {projects.map((project, i) => (
            <li key={project.num}>
              <ProjectLine
                num={project.num}
                title={project.title}
                tipo={project.tipo}
                year={project.year}
                href={project.href}
                animationDelay={`${i * 60}ms`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
