import papeleriaData from '../../data/graphic-design/papeleria.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import CategoryGalleryPage from '../../components/layout/CategoryGalleryPage';
import { IconCode } from '../../components/iconos';

const projects = papeleriaData as GraphicDesignProject[];

export default function GraphicDesignPapeleria() {
  return (
    <CategoryGalleryPage
      projects={projects}
      basePath="/graphic-design/papeleria"
      title="Papelería"
      description="Diseño de papelería corporativa, trípticos, flyers y material impreso."
      color="blue"
      opacity={0.1}
      backLink="/graphic-design"
      backLinkText="Volver a Diseño Gráfico"
      IconFallback={IconCode}
      emptyStateDescription="Esta sección está en preparación. Pronto encontrarás aquí los diseños de papelería."
      dataIdPrefix="papeleria"
    />
  );
}
