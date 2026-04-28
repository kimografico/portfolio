import logotypesData from '../../data/graphic-design/logotipos.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import { ProjectCard } from '../../components/ui/ProjectCard';
import CategoryHero from '../../components/ui/CategoryHero';
import EmptyState from '../../components/ui/EmptyState';
import { IconCode } from '../../components/iconos';

const projects = logotypesData as GraphicDesignProject[];

export default function GraphicDesignLogotipos() {
  return (
    <div className="min-h-screen flex flex-col" data-id="graphic-design-logotipos">
      <CategoryHero
        title="Logotipos"
        description="Diseño de logotipos e identidades visuales para empresas y proyectos."
        color="purple"
        opacity={0.1}
        dataId="graphic-design-logotipos-hero"
        backLink="/graphic-design"
        backLinkText="Volver a Diseño Gráfico"
      />

      {/* Grid de proyectos o estado vacío */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-12"
        data-id="logotipos-projects-main"
      >
        {projects.length === 0 ? (
          <EmptyState
            description="Esta sección está en preparación. Pronto encontrarás aquí los logotipos y diseños de marca."
            dataId="logotipos-empty"
          />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            data-id="logotipos-grid"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                to={`/graphic-design/logotipos/${project.id}`}
                dataId={`logotipos-card-${project.id}`}
                IconFallback={IconCode}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
