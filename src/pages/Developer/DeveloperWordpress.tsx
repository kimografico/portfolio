import { Link } from 'react-router-dom';
import { useState } from 'react';

import wordpressData from '../../data/development/wordpress.json';
import type { WordpressProject } from '../../interfaces/developer';
import './Developer.css';

// Importar iconos relevantes
import {
  LogoWordpress,
  LogoWoo,
  LogoPHP,
  LogoJS,
  LogoCSS,
  LogoHTML,
  LogoReact,
  LogoAngular,
  LogoVue,
  LogoPrestashop,
  LogoFlash,
  IconCode,
  LogoAjax,
  IconTPV,
} from '../../components/iconos';

// Mapeo de tecnologías a iconos
const stackIconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  WORDPRESS: LogoWordpress,
  WOOCOMMERCE: LogoWoo,
  PHP: LogoPHP,
  JS: LogoJS,
  JAVASCRIPT: LogoJS,
  CSS: LogoCSS,
  HTML: LogoHTML,
  REACT: LogoReact,
  ANGULAR: LogoAngular,
  VUE: LogoVue,
  PRESTASHOP: LogoPrestashop,
  FLASH: LogoFlash,
  AJAX: LogoAjax,
  'TPV VIRTUAL': IconTPV,
};

const projects = wordpressData as WordpressProject[];

function getYear(date: string): string {
  return date.slice(0, 4);
}

function ProjectCard({ project }: { project: WordpressProject }) {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <Link
      to={`/dev/wordpress/${project.id}`}
      className="group flex flex-col bg-surface rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
      data-id={`wp-card-${project.id}`}
    >
      {/* Thumbnail */}
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

      {/* Info */}
      <div className="p-4 flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-ink group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          {project.title}
        </h2>
        <p className="text-xs text-muted">
          {project.cliente} · {getYear(project.date)}
        </p>
        {project.stack && (
          <div className="flex flex-row gap-2 mt-1 items-center" data-id="wp-stack-icons">
            {project.stack.map((tech) => {
              const key = tech.trim().toUpperCase();
              const Icon = stackIconMap[key] || IconCode;
              return (
                <span
                  key={tech}
                  className="inline-block align-middle cursor-pointer"
                  onMouseEnter={() => setHoveredTech(tech)}
                  onMouseLeave={() => setHoveredTech(null)}
                  onFocus={() => setHoveredTech(tech)}
                  onBlur={() => setHoveredTech(null)}
                  tabIndex={0}
                  aria-label={tech}
                >
                  <Icon size={28} className="text-muted hover:text-ink transition-colors" />
                </span>
              );
            })}
            <div className="ml-auto text-xs text-muted min-w-[80px] text-right">
              {hoveredTech && <span>{hoveredTech.toUpperCase()}</span>}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function DeveloperWordpress() {
  return (
    <div className="min-h-screen flex flex-col" data-id="developer-wordpress">
      {/* Hero */}
      <section
        className="bg-gradient-to-b from-bg to-surface border-b border-border py-16 px-4 text-center"
        data-id="developer-wordpress-hero"
      >
        <Link
          to="/dev"
          className="text-sm text-muted hover:text-ink transition-colors mb-6 inline-block"
        >
          ← Desarrollo web
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ink">WordPress</h1>
        <p className="max-w-2xl mx-auto text-lg text-muted">
          Webs desarrolladas con CMS WordPress: catálogos, tiendas online, portfolios y webs
          corporativas.
        </p>
      </section>

      {/* Grid de proyectos o estado vacío */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-12"
        data-id="wordpress-projects-main"
      >
        {projects.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-id="wordpress-empty"
          >
            <p className="text-5xl mb-6" aria-hidden="true">
              🚧
            </p>
            <p className="text-lg font-semibold text-ink mb-2">Próximamente</p>
            <p className="text-sm text-muted max-w-sm">
              Esta sección está en preparación. Pronto encontrarás aquí los proyectos desarrollados
              con WordPress.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" data-id="wp-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
