import { useParams, useNavigate } from 'react-router-dom';
import ProjectDetailPage from '../../components/compositions/ProjectDetailPage';
import UIButton from '../../components/ui/UIButton';
import frameworksData from '../../data/development/frameworks.json';
import vanillaData from '../../data/development/vanilla.json';
import wordpressData from '../../data/development/wordpress.json';
import { buildDeveloperImagePath } from '../../data/config/imagePathHelper';
import type { WebProject } from '../../interfaces/developer';
import '../../styles/Developer.css';
import { APP_BASENAME } from '../../data/config/app';

// Mapeo de parent a datos y etiqueta
const projectDataMap: Record<string, { data: WebProject[]; label: string }> = {
  frameworks: { data: frameworksData as WebProject[], label: 'Frameworks' },
  vanilla: { data: vanillaData as WebProject[], label: 'Vanilla' },
  wordpress: { data: wordpressData as WebProject[], label: 'WordPress' },
};

function getYear(date: string): string {
  return date.slice(0, 4);
}

export default function DeveloperProjectDetail() {
  const { parent, id } = useParams();
  const navigate = useNavigate();

  // Validar que parent sea válido
  const parentConfig = parent && parent in projectDataMap ? projectDataMap[parent] : null;

  // Si parent no es válido, renderizar error
  if (!parentConfig) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4" data-id="project-detail-invalid-parent">
        <p className="text-muted mb-4">Categoría no encontrada.</p>
        <UIButton onClick={() => navigate('/dev')} link arrowBack dataId="back-to-dev">
          Volver a Desarrollo
        </UIButton>
      </div>
    );
  }

  const { data: projects, label } = parentConfig;

  const currentIndex = projects.findIndex((p) => p.id.toString() === id);
  const project: WebProject | undefined = currentIndex !== -1 ? projects[currentIndex] : undefined;

  const prev = currentIndex > 0 ? projects[currentIndex - 1] : undefined;
  const next =
    currentIndex !== -1 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : undefined;

  // Si proyecto no existe, renderizar error (parent ya fue validado arriba)
  if (!project) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4" data-id={`${parent}-detail-not-found`}>
        <p className="text-muted mb-4">Proyecto no encontrado.</p>
        <UIButton
          onClick={() => navigate(`/dev/${parent}`)}
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
      dataId={`developer-${parent}-detail`}
      galleryGridDataId={`${parent}-gallery-grid`}
      videosGridDataId={`${parent}-videos-grid`}
      backButtonDataId="back-to-category-btn"
      imageButtonDataIdPrefix="developer"
      backButtonLabel={`Volver a ${label}`}
      editButtonHref={`${APP_BASENAME}/kimo/edit-project/${project.id}`}
      editButtonDataId="developer-edit-project-btn"
      onBack={() => navigate(`/dev/${parent}`)}
      onPrev={() => prev && navigate(`/dev/${parent}/${prev.id}`)}
      onNext={() => next && navigate(`/dev/${parent}/${next.id}`)}
      disabledPrev={!prev}
      disabledNext={!next}
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
