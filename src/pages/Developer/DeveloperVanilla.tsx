import vanillaData from '../../data/development/vanilla.json';
import type { WebProject } from '../../interfaces/developer';
import { ProjectCard } from '../../components/ui/ProjectCard';
import CategoryHero from '../../components/ui/CategoryHero';
import EmptyState from '../../components/ui/EmptyState';
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
      <CategoryHero
        title="Vanilla JS"
        description="Webs desarrolladas con HTML, CSS y JavaScript puro, sin depender de frameworks ni CMS."
        icon={IconCode}
        color="yellow"
        opacity={0.15}
        dataId="developer-vanilla-hero"
      />

      {/* Grid de proyectos o estado vacío */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12" data-id="vanilla-projects-main">
        {projects.length === 0 ? (
          <EmptyState
            description="Esta sección está en preparación. Pronto encontrarás aquí los proyectos desarrollados en Vanilla JS."
            dataId="vanilla-empty"
          />
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
