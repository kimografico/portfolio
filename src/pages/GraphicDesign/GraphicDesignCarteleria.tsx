import carteriaData from '../../data/graphic-design/carteleria.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import CategoryGalleryPage from '../../components/layout/CategoryGalleryPage';
import { IconCode } from '../../components/iconos';

const projects = carteriaData as GraphicDesignProject[];

export default function GraphicDesignCarteleria() {
  return (
    <CategoryGalleryPage
      projects={projects}
      basePath="/graphic-design/carteleria"
      title="Cartelería"
      description="Diseño de carteles, señalética y material publicitario exterior."
      color="red"
      opacity={0.1}
      backLink="/graphic-design"
      backLinkText="Volver a Diseño Gráfico"
      IconFallback={IconCode}
      emptyStateDescription="Esta sección está en preparación. Pronto encontrarás aquí los diseños de cartelería."
      dataIdPrefix="carteleria"
    />
  );
}
