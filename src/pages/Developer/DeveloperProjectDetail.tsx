import { useParams } from 'react-router-dom';
import ProjectDetailPage from '../../components/compositions/ProjectDetailPage';
import UIButton from '../../components/ui/UIButton';
import legacyData from '../../data/development/legacy.json';
import appsData from '../../data/development/apps.json';
import webData from '../../data/development/web.json';
import experimentsData from '../../data/development/experiments.json';
import { buildDeveloperImagePath } from '../../data/config/imagePathHelper';
import { useProjectDetail } from '../../hooks/useProjectDetail';
import type { WebProject } from '../../interfaces/developer';
import '../../styles/Developer.css';
import { APP_BASENAME } from '../../data/config/app';

// Mapeo de parent a datos y etiqueta
const projectDataMap: Record<string, { data: WebProject[]; label: string }> = {
  legacy: { data: legacyData as WebProject[], label: 'Legacy' },
  apps: { data: appsData as WebProject[], label: 'Aplicaciones' },
  web: { data: webData as WebProject[], label: 'Web' },
  experiments: { data: experimentsData as WebProject[], label: 'Experimentos' },
};

function getYear(date: string): string {
  return date.slice(0, 4);
}

export default function DeveloperProjectDetail() {
  const { parent, id } = useParams();

  const { category, navigation } = useProjectDetail<WebProject>({
    projectDataMap,
    categoryParam: parent,
    projectId: id,
    basePath: '/dev',
  });

  // Si parent no es válido, renderizar error
  if (!category.isValid) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4" data-id="project-detail-invalid-parent">
        <p className="text-muted mb-4">Categoría no encontrada.</p>
        <UIButton onClick={() => navigation.goBack()} link arrowBack dataId="back-to-dev">
          Volver a Desarrollo
        </UIButton>
      </div>
    );
  }

  const { project, hasPrev, hasNext, goToPrev, goToNext, goBack } = navigation;

  // Si proyecto no existe, renderizar error
  if (!project) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4" data-id={`${parent}-detail-not-found`}>
        <p className="text-muted mb-4">Proyecto no encontrado.</p>
        <UIButton onClick={goBack} link arrowBack dataId="back-to-category-btn">
          Volver a {category.label}
        </UIButton>
      </div>
    );
  }

  return (
    <ProjectDetailPage
      dataId={`developer-${parent}-detail`}
      galleryGridDataId={`${parent}-gallery-grid`}
      videosGridDataId={`${parent}-videos-grid`}
      backButtonDataId="back-to-category-btn"
      imageButtonDataIdPrefix="developer"
      backButtonLabel={`Volver a ${category.label}`}
      editButtonHref={`${APP_BASENAME}/kimo/edit-project/${project.id}`}
      editButtonDataId="developer-edit-project-btn"
      onBack={goBack}
      onPrev={goToPrev}
      onNext={goToNext}
      disabledPrev={!hasPrev}
      disabledNext={!hasNext}
      year={getYear(project.date)}
      title={project.title}
      cliente={project.cliente}
      stack={project.stack}
      description={project.descripcion}
      images={project.imagenes}
      videos={project.videos}
      buildImagePath={(image) => buildDeveloperImagePath(parent as string, image)}
    />
  );
}
