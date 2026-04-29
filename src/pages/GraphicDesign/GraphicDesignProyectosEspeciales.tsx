import proyectosEspecialesData from '../../data/graphic-design/proyectos-especiales.json';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import CategoryGalleryPage from '../../components/layout/CategoryGalleryPage';
import { IconCode } from '../../components/iconos';

const projects = proyectosEspecialesData as GraphicDesignProject[];

export default function GraphicDesignProyectosEspeciales() {
  return (
    <CategoryGalleryPage
      projects={projects}
      basePath="/graphic-design/proyectos-especiales"
      title="Proyectos especiales"
      description="Proyectos gráficos singulares, personalizados o fuera de categoría."
      color="indigo"
      opacity={0.1}
      backLink="/graphic-design"
      backLinkText="Volver a Diseño Gráfico"
      IconFallback={IconCode}
      emptyStateDescription="Esta sección está en preparación. Pronto encontrarás aquí los proyectos especiales."
      dataIdPrefix="proyectos-especiales"
    />
  );
}
