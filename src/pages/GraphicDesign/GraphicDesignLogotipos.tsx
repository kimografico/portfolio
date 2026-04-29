import logotypesData from '../../data/graphic-design/logotipos.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import CategoryGalleryPage from '../../components/layout/CategoryGalleryPage';
import { IconCode } from '../../components/iconos';

const projects = logotypesData as GraphicDesignProject[];

export default function GraphicDesignLogotipos() {
  return (
    <CategoryGalleryPage
      projects={projects}
      basePath="/graphic-design/logotipos"
      title="Logotipos"
      description="Diseño de logotipos e identidades visuales para empresas y proyectos."
      color="purple"
      opacity={0.1}
      backLink="/graphic-design"
      backLinkText="Volver a Diseño Gráfico"
      IconFallback={IconCode}
      emptyStateDescription="Esta sección está en preparación. Pronto encontrarás aquí los logotipos y diseños de marca."
      dataIdPrefix="logotipos"
    />
  );
}
