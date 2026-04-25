/**
 * RecentProjectsSection: Sección de proyectos recientes.
 * Muestra una lista de proyectos con animaciones y navegación.
 */
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
              <a
                href={project.href}
                className="group flex items-center gap-6 py-5 hover:pl-1 transition-all duration-200"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="font-mono text-xs text-muted w-6 shrink-0">{project.num}</span>
                <span className="flex-1 text-base font-medium text-ink tracking-tight">
                  {project.title}
                </span>
                <span className="hidden sm:block text-sm text-muted">{project.tipo}</span>
                <span className="font-mono text-xs text-muted">{project.year}</span>
                <span
                  className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-150"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
