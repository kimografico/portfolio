import editorialData from '../../data/graphic-design/editorial.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import { ProjectCard } from '../../components/ui/ProjectCard';
import CategoryHero from '../../components/ui/CategoryHero';
import EmptyState from '../../components/ui/EmptyState';
import { IconFile } from '../../components/iconos';

const projects = editorialData as GraphicDesignProject[];

export default function GraphicDesignEditorial() {
  return (
    <div className="min-h-screen flex flex-col" data-id="graphic-design-editorial">
      <CategoryHero
        title="Editorial"
        description="Diseño de publicaciones, revistas, libros y materiales editoriales."
        dataId="graphic-design-editorial-hero"
        backLink="/graphic-design"
        backLinkText="Volver a Diseño Gráfico"
      />

      {/* Grid de proyectos o estado vacío */}
      <main
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-12"
        data-id="editorial-projects-main"
      >
        {projects.length === 0 ? (
          <EmptyState
            description="Esta sección está en preparación. Pronto encontrarás aquí diseños de publicaciones y materiales editoriales."
            dataId="editorial-empty"
          />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            data-id="editorial-grid"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                to={`/graphic-design/editorial/${project.id}`}
                dataId={`editorial-card-${project.id}`}
                IconFallback={IconFile}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
