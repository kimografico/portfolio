import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ImageLightbox from '../../components/ui/ImageLightbox';
import PrevNextBtns from '../../components/ui/PrevNextBtns';
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
import { renderMultilineText } from '../../utils/renderMultilineText';
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

function getYouTubeEmbedUrl(url: string): string | null {
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return null;
}

function getYear(date: string): string {
  return date.slice(0, 4);
}

export default function GraphicDesignProjectDetail() {
  const { category, id } = useParams();
  const navigate = useNavigate();

  const [lightbox, setLightbox] = useState<{ open: boolean; src: string; alt: string }>({
    open: false,
    src: '',
    alt: '',
  });

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
        <button
          onClick={() => navigate('/graphic-design')}
          className="text-sm text-muted hover:text-ink transition-colors"
          type="button"
        >
          ← Volver a Diseño Gráfico
        </button>
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

  const handleOpenLightbox = (src: string, alt: string) => {
    setLightbox({ open: true, src, alt });
  };

  const handleCloseLightbox = () => {
    setLightbox((s) => ({ ...s, open: false }));
  };

  // Si proyecto no existe, renderizar error (categoría ya fue validada arriba)
  if (!project) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4" data-id={`${category}-detail-not-found`}>
        <p className="text-muted mb-4">Proyecto no encontrado.</p>
        <button
          onClick={() => navigate(`/graphic-design/${category}`)}
          className="text-sm text-muted hover:text-ink transition-colors"
          type="button"
        >
          ← Volver a {label}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col" data-id={`graphic-design-${category}-detail`}>
      {/* Cabecera de navegación */}
      <section data-id="detail-nav">
        <div className="max-w-7xl mx-auto pt-6 px-4 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(`/graphic-design/${category}`)}
            className="text-sm text-muted hover:text-ink transition-colors duration-150"
            type="button"
          >
            ← Volver a {label}
          </button>
          <PrevNextBtns
            onPrev={() => prev && navigate(`/graphic-design/${category}/${prev.id}`)}
            onNext={() => next && navigate(`/graphic-design/${category}/${next.id}`)}
            disabledPrev={!prev}
            disabledNext={!next}
          />
        </div>
      </section>

      {/* Info del proyecto */}
      <section className="border-b border-border" data-id="detail-info">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <p className="text-xs text-muted font-mono mb-2 uppercase tracking-widest">
            {getYear(project.date)}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6 leading-tight">
            {project.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-widest block mb-1">
                Cliente
              </span>
              <span className="text-sm text-ink">{project.cliente}</span>
            </div>
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-widest block mb-1">
                Año
              </span>
              <span className="text-sm text-ink">{getYear(project.date)}</span>
            </div>
          </div>

          <div className="max-w-3xl text-base text-muted leading-relaxed mb-4">
            {renderMultilineText(project.descripcion)}
          </div>
        </div>
      </section>

      {/* Galería de imágenes */}
      {project.imagenes.length > 0 && (
        <section className="border-b border-border" data-id="detail-gallery">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              data-id={`${category}-gallery-grid`}
            >
              {project.imagenes.map((img: { image: string; label: string }, i: number) => {
                // Construir ruta completa basada en categoría y nombre de archivo
                const fullImagePath = buildGraphicDesignImagePath(category as string, img.image);
                return (
                  <figure key={i} className="flex flex-col gap-2" data-id={`gallery-item-${i}`}>
                    <button
                      type="button"
                      className="bg-surface rounded overflow-hidden border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      onClick={() => handleOpenLightbox(fullImagePath, img.label || project.title)}
                      aria-label={`Ampliar: ${img.label || project.title}`}
                    >
                      <img
                        src={fullImagePath}
                        alt={img.label || project.title}
                        className="wp-gallery-image"
                        loading="lazy"
                      />
                    </button>
                    {img.label && (
                      <figcaption className="text-xs text-muted leading-snug px-1">
                        {img.label}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Vídeos */}
      {(project.videos?.length ?? 0) > 0 && (
        <section data-id="detail-videos">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <p className="font-mono text-xs text-muted uppercase tracking-widest mb-6">Vídeos</p>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              data-id={`${category}-videos-grid`}
            >
              {(project.videos ?? []).map((video: { image: string; label: string }, i: number) => {
                const embedUrl = getYouTubeEmbedUrl(video.image);
                if (!embedUrl) return null;
                return (
                  <div key={i} className="flex flex-col gap-2">
                    <iframe
                      src={embedUrl}
                      title={video.label || `Vídeo ${i + 1}`}
                      className="wp-embed-video rounded border border-border"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    {video.label && <p className="text-xs text-muted">{video.label}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <ImageLightbox
        open={lightbox.open}
        src={lightbox.src}
        alt={lightbox.alt}
        onClose={handleCloseLightbox}
      />
    </div>
  );
}
