import { useParams, useNavigate } from 'react-router-dom';
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
import type { GraphicDesignProject } from '../../interfaces/graphicDesign';
import '../../styles/Developer.css';

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
  const navigate = useNavigate();

  // Validar que category sea válida
  const categoryConfig = category && category in projectDataMap ? projectDataMap[category] : null;

  // Si categoría no es válida, renderizar error
  if (!categoryConfig) {
    return (
      <div
        className="max-w-7xl mx-auto py-16 px-4"
        data-id="graphic-design-detail-invalid-category"
      >
        <p className="text-muted mb-4">Categoría no encontrada.</p>
        <UIButton
          onClick={() => navigate('/graphic-design')}
          link
          arrowBack
          dataId="back-to-graphic-design"
        >
          Volver a Diseño Gráfico
        </UIButton>
      </div>
    );
  }

  const { data: projects, label } = categoryConfig;

  const currentIndex = projects.findIndex((p) => p.id.toString() === id);
  const project: GraphicDesignProject | undefined =
    currentIndex !== -1 ? projects[currentIndex] : undefined;

  const prev = currentIndex > 0 ? projects[currentIndex - 1] : undefined;
  const next =
    currentIndex !== -1 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : undefined;

  // Si proyecto no existe, renderizar error (categoría ya fue validada arriba)
  if (!project) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4" data-id={`${category}-detail-not-found`}>
        <p className="text-muted mb-4">Proyecto no encontrado.</p>
        <UIButton
          onClick={() => navigate(`/graphic-design/${category}`)}
          link
          arrowBack
          dataId="back-to-category-btn"
        >
          Volver a {label}
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
      backButtonLabel={`Volver a ${label}`}
      onBack={() => navigate(`/graphic-design/${category}`)}
      onPrev={() => prev && navigate(`/graphic-design/${category}/${prev.id}`)}
      onNext={() => next && navigate(`/graphic-design/${category}/${next.id}`)}
      disabledPrev={!prev}
      disabledNext={!next}
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
