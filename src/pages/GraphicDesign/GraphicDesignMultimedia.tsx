import multimediaData from '../../data/graphic-design/multimedia.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import { ProjectCard } from '../../components/ui/ProjectCard';
import CategoryHero from '../../components/ui/CategoryHero';
import EmptyState from '../../components/ui/EmptyState';
import { IconCode } from '../../components/iconos';

const projects = multimediaData as GraphicDesignProject[];

export default function GraphicDesignMultimedia() {
  return (
    <div className="min-h-screen flex flex-col" data-id="graphic-design-multimedia">
      <CategoryHero
        title="Multimedia"
        description="Contenido multimedia, animaciones, vídeos y efectos visuales."
        color="pink"
        opacity={0.1}
        dataId="graphic-design-multimedia-hero"
        backLink="/graphic-design"
        backLinkText="Volver a Diseño Gráfico"
      />

      {/* Grid de proyectos o estado vacío */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-12"
        data-id="multimedia-projects-main"
      >
        {projects.length === 0 ? (
          <EmptyState
            description="Esta sección está en preparación. Pronto encontrarás aquí los proyectos multimedia."
            dataId="multimedia-empty"
          />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            data-id="multimedia-grid"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                to={`/graphic-design/multimedia/${project.id}`}
                dataId={`multimedia-card-${project.id}`}
                IconFallback={IconCode}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
