import multimediaData from '../../data/graphic-design/multimedia.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import CategoryGalleryPage from '../../components/layout/CategoryGalleryPage';
import { IconCode } from '../../components/iconos';

const projects = multimediaData as GraphicDesignProject[];

export default function GraphicDesignMultimedia() {
  return (
    <CategoryGalleryPage
      projects={projects}
      basePath="/graphic-design/multimedia"
      title="Multimedia"
      description="Contenido multimedia, animaciones, vídeos y efectos visuales."
      color="pink"
      opacity={0.1}
      backLink="/graphic-design"
      backLinkText="Volver a Diseño Gráfico"
      IconFallback={IconCode}
      emptyStateDescription="Esta sección está en preparación. Pronto encontrarás aquí los proyectos multimedia."
      dataIdPrefix="multimedia"
    />
  );
}
