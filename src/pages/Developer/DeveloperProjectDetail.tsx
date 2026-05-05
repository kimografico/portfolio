import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ImageLightbox from '../../components/ui/ImageLightbox';
import PrevNextBtns from '../../components/ui/PrevNextBtns';
import frameworksData from '../../data/development/frameworks.json';
import vanillaData from '../../data/development/vanilla.json';
import wordpressData from '../../data/development/wordpress.json';
import { buildDeveloperImagePath } from '../../data/config/imagePathHelper';
import type { WebProject } from '../../interfaces/developer';
import '../../styles/Developer.css';
import { renderMultilineText } from '../../utils/renderMultilineText';

// Mapeo de parent a datos y etiqueta
const projectDataMap: Record<string, { data: WebProject[]; label: string }> = {
  frameworks: { data: frameworksData as WebProject[], label: 'Frameworks' },
  vanilla: { data: vanillaData as WebProject[], label: 'Vanilla' },
  wordpress: { data: wordpressData as WebProject[], label: 'WordPress' },
};

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return null;
}

function getYear(date: string): string {
  return date.slice(0, 4);
}

export default function DeveloperProjectDetail() {
  const { parent, id } = useParams();
  const navigate = useNavigate();

  const [lightbox, setLightbox] = useState<{ open: boolean; src: string; alt: string }>({
    open: false,
    src: '',
    alt: '',
  });

  // Validar que parent sea válido
  const parentConfig = parent && parent in projectDataMap ? projectDataMap[parent] : null;

  // Si parent no es válido, renderizar error
  if (!parentConfig) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4" data-id="project-detail-invalid-parent">
        <p className="text-muted mb-4">Categoría no encontrada.</p>
        <button
          onClick={() => navigate('/dev')}
          className="text-sm text-muted hover:text-ink transition-colors"
          type="button"
        >
          ← Volver a Desarrollo
        </button>
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

  const handleOpenLightbox = (src: string, alt: string) => {
    setLightbox({ open: true, src, alt });
  };

  const handleCloseLightbox = () => {
    setLightbox((s) => ({ ...s, open: false }));
  };

  // Si proyecto no existe, renderizar error (parent ya fue validado arriba)
  if (!project) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4" data-id={`${parent}-detail-not-found`}>
        <p className="text-muted mb-4">Proyecto no encontrado.</p>
        <button
          onClick={() => navigate(`/dev/${parent}`)}
          className="text-sm text-muted hover:text-ink transition-colors"
          type="button"
        >
          ← Volver a {label}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col" data-id={`developer-${parent}-detail`}>
      {/* Cabecera de navegación */}
      <section data-id="detail-nav">
        <div className="max-w-7xl mx-auto pt-6 px-4 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(`/dev/${parent}`)}
            className="text-sm text-muted hover:text-ink transition-colors duration-150"
            type="button"
          >
            ← Volver a {label}
          </button>
          <PrevNextBtns
            onPrev={() => prev && navigate(`/dev/${parent}/${prev.id}`)}
            onNext={() => next && navigate(`/dev/${parent}/${next.id}`)}
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
            {project.stack && (
              <div>
                <span className="font-mono text-xs text-muted uppercase tracking-widest block mb-1">
                  Tecnologías
                </span>
                <span className="text-sm text-ink">{project.stack.join(', ')}</span>
              </div>
            )}
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
              data-id={`${parent}-gallery-grid`}
            >
              {project.imagenes.map((img, i) => {
                // Construir ruta completa basada en categoría (parent) y nombre de archivo
                const fullImagePath = buildDeveloperImagePath(parent as string, img.image);
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
      {project.videos.length > 0 && (
        <section data-id="detail-videos">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <p className="font-mono text-xs text-muted uppercase tracking-widest mb-6">Vídeos</p>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              data-id={`${parent}-videos-grid`}
            >
              {project.videos.map((video, i) => {
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
