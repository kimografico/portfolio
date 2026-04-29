import etiquetasData from '../../data/graphic-design/etiquetas.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import CategoryGalleryPage from '../../components/layout/CategoryGalleryPage';
import { IconBottle } from '../../components/iconos';

const projects = etiquetasData as GraphicDesignProject[];

export default function GraphicDesignEtiquetas() {
  return (
    <CategoryGalleryPage
      projects={projects}
      basePath="/graphic-design/etiquetas"
      title="Etiquetas"
      description="Diseño de etiquetas, pegatinas y elementos gráficos para packaging y branding."
      backLink="/graphic-design"
      backLinkText="Volver a Diseño Gráfico"
      IconFallback={IconBottle}
      emptyStateDescription="Esta sección está en preparación. Pronto encontrarás aquí diseños de etiquetas y elementos gráficos."
      dataIdPrefix="etiquetas"
    />
  );
}
