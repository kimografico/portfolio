import frameworksData from '../../data/development/frameworks.json';
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
  LogoReact,
  LogoAngular,
  LogoVue,
  IconCode,
  LogoAjax,
} from '../../components/iconos';

// Mapeo de tecnologías a iconos
const stackIconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  HTML: LogoHTML,
  CSS: LogoCSS,
  JAVASCRIPT: LogoJS,
  JS: LogoJS,
  REACT: LogoReact,
  ANGULAR: LogoAngular,
  VUE: LogoVue,
  AJAX: LogoAjax,
};

const projects = frameworksData as WebProject[];

export default function DeveloperFrameworks() {
  return (
    <div className="min-h-screen flex flex-col" data-id="developer-frameworks">
      <CategoryHero
        title="Frameworks"
        description="Proyectos desarrollados con frameworks modernos: React, Vue y otros."
        icon={LogoReact}
        dataId="developer-frameworks-hero"
        color="green"
        opacity={0.1}
      />

      {/* Grid de proyectos o estado vacío */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-12"
        data-id="frameworks-projects-main"
      >
        {projects.length === 0 ? (
          <EmptyState
            description="Esta sección está en preparación. Pronto encontrarás aquí los proyectos desarrollados con frameworks modernos."
            dataId="frameworks-empty"
          />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            data-id="frameworks-grid"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                to={`/dev/frameworks/${project.id}`}
                stackIconMap={stackIconMap}
                webProject
                dataId={`frameworks-card-${project.id}`}
                IconFallback={IconCode}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
