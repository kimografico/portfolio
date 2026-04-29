import packagingData from '../../data/graphic-design/packaging.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import CategoryGalleryPage from '../../components/layout/CategoryGalleryPage';
import { IconCode } from '../../components/iconos';

const projects = packagingData as GraphicDesignProject[];

export default function GraphicDesignPackaging() {
  return (
    <CategoryGalleryPage
      projects={projects}
      basePath="/graphic-design/packaging"
      title="Packaging"
      description="Diseño de empaques, cajas y etiquetas para productos."
      color="amber"
      opacity={0.1}
      backLink="/graphic-design"
      backLinkText="Volver a Diseño Gráfico"
      IconFallback={IconCode}
      emptyStateDescription="Esta sección está en preparación. Pronto encontrarás aquí los diseños de packaging."
      dataIdPrefix="packaging"
    />
  );
}
