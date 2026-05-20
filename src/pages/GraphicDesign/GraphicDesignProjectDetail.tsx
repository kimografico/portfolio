import { useParams } from 'react-router-dom';
import UIButton from '../../components/ui/UIButton';
import ProjectDetailPage from '../../components/compositions/ProjectDetailPage';
import logotypesData from '../../data/graphic-design/logotipos.json';
import papeleriaData from '../../data/graphic-design/papeleria.json';
import carteriaData from '../../data/graphic-design/carteleria.json';
import multimediaData from '../../data/graphic-design/multimedia.json';
import packagingData from '../../data/graphic-design/packaging.json';
import proyectosEspecialesData from '../../data/graphic-design/proyectos-especiales.json';
import etiquetasData from '../../data/graphic-design/etiquetas.json';
import editorialData from '../../data/graphic-design/editorial.json';
import {
  processProjectsImages,
  buildGraphicDesignImagePath,
} from '../../data/config/imagePathHelper';
import { useProjectDetail } from '../../hooks/useProjectDetail';
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import '../../styles/Developer.css';
import { APP_BASENAME } from '../../data/config/app';

// Mapeo de categoría a datos y etiqueta
const projectDataMap: Record<string, { data: GraphicDesignProject[]; label: string }> = {
  logotipos: {
    data: processProjectsImages(logotypesData as GraphicDesignProject[]),
    label: 'Logotipos',
  },
  papeleria: {
    data: processProjectsImages(papeleriaData as GraphicDesignProject[]),
    label: 'Papelería',
  },
  carteleria: {
    data: processProjectsImages(carteriaData as GraphicDesignProject[]),
    label: 'Cartelería',
  },
  multimedia: {
    data: processProjectsImages(multimediaData as GraphicDesignProject[]),
    label: 'Multimedia',
  },
  packaging: {
    data: processProjectsImages(packagingData as GraphicDesignProject[]),
    label: 'Packaging',
  },
  'proyectos-especiales': {
    data: processProjectsImages(proyectosEspecialesData as GraphicDesignProject[]),
    label: 'Proyectos especiales',
  },
  etiquetas: {
    data: processProjectsImages(etiquetasData as GraphicDesignProject[]),
    label: 'Etiquetas',
  },
  editorial: {
    data: processProjectsImages(editorialData as GraphicDesignProject[]),
    label: 'Editorial',
  },
};

function getYear(date: string): string {
  return date.slice(0, 4);
}

export default function GraphicDesignProjectDetail() {
  const { category, id } = useParams();

  const { category: categoryInfo, navigation } = useProjectDetail<GraphicDesignProject>({
    projectDataMap,
    categoryParam: category,
    projectId: id,
    basePath: '/graphic-design',
  });

  // Si categoría no es válida, renderizar error
  if (!categoryInfo.isValid) {
    return (
      <div
        className="max-w-7xl mx-auto py-16 px-4"
        data-id="graphic-design-detail-invalid-category"
      >
        <p className="text-muted mb-4">Categoría no encontrada.</p>
        <UIButton
          onClick={() => navigation.goBack()}
          link
          arrowBack
          dataId="back-to-graphic-design"
        >
          Volver a Diseño Gráfico
        </UIButton>
      </div>
    );
  }

  const { project, hasPrev, hasNext, goToPrev, goToNext, goBack } = navigation;

  // Si proyecto no existe, renderizar error
  if (!project) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4" data-id={`${category}-detail-not-found`}>
        <p className="text-muted mb-4">Proyecto no encontrado.</p>
        <UIButton onClick={goBack} link arrowBack dataId="back-to-category-btn">
          Volver a {categoryInfo.label}
        </UIButton>
      </div>
    );
  }

  return (
    <ProjectDetailPage
      dataId={`graphic-design-${category}-detail`}
      galleryGridDataId={`${category}-gallery-grid`}
      videosGridDataId={`${category}-videos-grid`}
      backButtonDataId="back-to-category-btn"
      imageButtonDataIdPrefix="graphic-design"
      backButtonLabel={`Volver a ${categoryInfo.label}`}
      editButtonHref={`${APP_BASENAME}/kimo/edit-project/${project.id}`}
      editButtonDataId="graphic-design-edit-project-btn"
      onBack={goBack}
      onPrev={goToPrev}
      onNext={goToNext}
      disabledPrev={!hasPrev}
      disabledNext={!hasNext}
      year={getYear(project.date)}
      title={project.title}
      cliente={project.cliente}
      description={project.descripcion}
      images={project.imagenes}
      videos={project.videos}
      buildImagePath={(image) => buildGraphicDesignImagePath(category as string, image)}
    />
  );
}
