import { Link } from 'react-router-dom';
import vanillaData from '../../data/development/vanilla.json';
import type { WordpressProject } from '../../interfaces/developer';
import './Developer.css';

const projects = vanillaData as WordpressProject[];

function getYear(date: string): string {
  return date.slice(0, 4);
}

export default function DeveloperVanilla() {
  return (
    <div className="min-h-screen flex flex-col" data-id="developer-vanilla">
      {/* Hero */}
      <section
        className="bg-gradient-to-b from-bg to-surface border-b border-border py-16 px-4 text-center"
        data-id="developer-vanilla-hero"
      >
        <Link
          to="/dev"
          className="text-sm text-muted hover:text-ink transition-colors mb-6 inline-block"
        >
          ← Desarrollo web
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ink">Vanilla JS</h1>
        <p className="max-w-2xl mx-auto text-lg text-muted">
          Webs desarrolladas con HTML, CSS y JavaScript puro, sin depender de frameworks ni CMS.
        </p>
      </section>

      {/* Grid de proyectos o estado vacío */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12" data-id="vanilla-projects-main">
        {projects.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-id="vanilla-empty"
          >
            <p className="text-5xl mb-6" aria-hidden="true">
              🚧
            </p>
            <p className="text-lg font-semibold text-ink mb-2">Próximamente</p>
            <p className="text-sm text-muted max-w-sm">
              Esta sección está en preparación. Pronto encontrarás aquí los proyectos desarrollados
              en Vanilla JS.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            data-id="vanilla-grid"
          >
            {projects.map((project) => (
              <Link
                to={`/dev/vanilla/${project.id}`}
                key={project.id}
                className="group flex flex-col bg-surface rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
                data-id={`vanilla-card-${project.id}`}
              >
                {project.imagenes[0] && (
                  <div className="overflow-hidden">
                    <img
                      src={project.imagenes[0].ruta}
                      alt={project.title}
                      className="wp-card-image group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col gap-1">
                  <h2 className="text-sm font-semibold text-ink group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {project.title}
                  </h2>
                  <p className="text-xs text-muted">
                    {project.cliente} · {getYear(project.date)}
                  </p>
                  {project.stack && (
                    <p className="text-xs text-muted mt-1 font-mono truncate">{project.stack}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
