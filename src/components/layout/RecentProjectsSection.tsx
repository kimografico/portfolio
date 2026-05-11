/**
 * RecentProjectsSection: Sección de proyectos recientes.
 * Muestra una lista de proyectos con animaciones y navegación.
 */

import ProjectLine from '../ui/ProjectLine';

import type { RecentProjectsSectionProps } from '../../interfaces/project';

export default function RecentProjectsSection({ projects }: RecentProjectsSectionProps) {
  return (
    <section
      aria-labelledby="proyectos-heading"
      className="border-b border-border"
      data-id="recent-projects-section"
    >
      <div
        className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20"
        data-id="recent-projects-wrapper"
      >
        <div className="flex items-baseline justify-between mb-8" data-id="recent-projects-header">
          <h2
            id="proyectos-heading"
            className="font-mono text-xs tracking-widest uppercase text-muted"
          >
            Proyectos recientes
          </h2>
        </div>
        <ul className="divide-y divide-border list-none m-0 p-0" data-id="recent-projects-list">
          {projects.map((project, i) => (
            <li key={project.num} data-id={`recent-projects-list-item-${project.num}`}>
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
