import editorialData from '../../data/graphic-design/editorial.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import CategoryGalleryPage from '../../components/layout/CategoryGalleryPage';
import { IconFile } from '../../components/iconos';

const projects = editorialData as GraphicDesignProject[];

export default function GraphicDesignEditorial() {
  return (
    <CategoryGalleryPage
      projects={projects}
      basePath="/graphic-design/editorial"
      title="Editorial"
      description="Diseño de publicaciones, revistas, libros y materiales editoriales."
      backLink="/graphic-design"
      backLinkText="Volver a Diseño Gráfico"
      IconFallback={IconFile}
      emptyStateDescription="Esta sección está en preparación. Pronto encontrarás aquí diseños de publicaciones y materiales editoriales."
      dataIdPrefix="editorial"
    />
  );
}
