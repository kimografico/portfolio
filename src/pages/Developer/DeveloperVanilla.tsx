import { Link } from 'react-router-dom';

import vanillaData from '../../data/development/vanilla.json';
import type { WebProject } from '../../interfaces/developer';
import { ProjectCard } from '../../components/ui/ProjectCard';
import './Developer.css';

// Importar iconos relevantes
import {
  LogoHTML,
  LogoCSS,
  LogoJS,
  LogoPHP,
  LogoPrestashop,
  LogoFlash,
  IconCode,
  LogoAjax,
  IconTPV,
} from '../../components/iconos';

// Mapeo de tecnologías a iconos
const stackIconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  HTML: LogoHTML,
  CSS: LogoCSS,
  JAVASCRIPT: LogoJS,
  JS: LogoJS,
  PHP: LogoPHP,
  PRESTASHOP: LogoPrestashop,
  AJAX: LogoAjax,
  'TPV VIRTUAL': IconTPV,
  FLASH: LogoFlash,
};

const projects = vanillaData as WebProject[];

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
              <ProjectCard
                key={project.id}
                project={project}
                to={`/dev/vanilla/${project.id}`}
                stackIconMap={stackIconMap}
                webProject
                dataId={`vanilla-card-${project.id}`}
                IconFallback={IconCode}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
