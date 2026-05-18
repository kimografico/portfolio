import { useState } from 'react';
import ImageLightbox from '../ui/ImageLightbox';
import PrevNextBtns from '../ui/PrevNextBtns';
import UIButton from '../ui/UIButton';
import { useBackendStatus } from '../../contexts/BackendStatusContext';
import { renderMultilineText } from '../../utils/renderMultilineText';

interface ProjectMediaItem {
  image: string;
  label?: string;
}

interface ProjectDetailPageProps {
  dataId: string;
  navDataId?: string;
  infoDataId?: string;
  galleryDataId?: string;
  videosDataId?: string;
  galleryGridDataId: string;
  videosGridDataId: string;
  backButtonDataId: string;
  imageButtonDataIdPrefix: string;
  backButtonLabel: string;
  editButtonHref?: string;
  editButtonDataId?: string;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
  disabledPrev?: boolean;
  disabledNext?: boolean;
  year: string;
  title: string;
  cliente: string;
  stack?: string[];
  description: string;
  images: ProjectMediaItem[];
  videos?: ProjectMediaItem[];
  buildImagePath: (image: string) => string;
}

export default function ProjectDetailPage({
  dataId,
  navDataId = 'detail-nav',
  infoDataId = 'detail-info',
  galleryDataId = 'detail-gallery',
  videosDataId = 'detail-videos',
  galleryGridDataId,
  videosGridDataId,
  backButtonDataId,
  imageButtonDataIdPrefix,
  backButtonLabel,
  editButtonHref,
  editButtonDataId,
  onBack,
  onPrev,
  onNext,
  disabledPrev = false,
  disabledNext = false,
  year,
  title,
  cliente,
  stack,
  description,
  images,
  videos,
  buildImagePath,
}: ProjectDetailPageProps) {
  const { alive } = useBackendStatus();
  const [lightbox, setLightbox] = useState<{ open: boolean; src: string; alt: string }>({
    open: false,
    src: '',
    alt: '',
  });

  const handleOpenLightbox = (src: string, alt: string) => {
    setLightbox({ open: true, src, alt });
  };

  const handleCloseLightbox = () => {
    setLightbox((current) => ({ ...current, open: false }));
  };

  return (
    <div className="flex flex-col" data-id={dataId}>
      <section data-id={navDataId}>
        <div className="max-w-7xl mx-auto pt-6 px-4 flex items-center justify-between gap-4">
          <UIButton onClick={onBack} link arrowBack dataId={backButtonDataId}>
            {backButtonLabel}
          </UIButton>
          <div className="flex items-center gap-3">
            {editButtonHref && alive && (
              <UIButton href={editButtonHref} link dataId={editButtonDataId ?? 'edit-project-btn'}>
                Editar
              </UIButton>
            )}
            <PrevNextBtns
              onPrev={onPrev}
              onNext={onNext}
              disabledPrev={disabledPrev}
              disabledNext={disabledNext}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border" data-id={infoDataId}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <p className="text-xs text-muted font-mono mb-2 uppercase tracking-widest">{year}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6 leading-tight">{title}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-widest block mb-1">
                Cliente
              </span>
              <span className="text-sm text-ink">{cliente}</span>
            </div>
            {stack && stack.length > 0 && (
              <div>
                <span className="font-mono text-xs text-muted uppercase tracking-widest block mb-1">
                  Tecnologías
                </span>
                <span className="text-sm text-ink">{stack.join(', ')}</span>
              </div>
            )}
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-widest block mb-1">
                Año
              </span>
              <span className="text-sm text-ink">{year}</span>
            </div>
          </div>

          <div className="max-w-3xl text-base text-muted leading-relaxed mb-4">
            {renderMultilineText(description)}
          </div>
        </div>
      </section>

      {images.length > 0 && (
        <section className="border-b border-border" data-id={galleryDataId}>
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              data-id={galleryGridDataId}
            >
              {images.map((img, index) => {
                const fullImagePath = buildImagePath(img.image);
                const label = img.label || title;

                return (
                  <figure
                    key={`${img.image}-${index}`}
                    className="flex flex-col gap-2"
                    data-id={`gallery-item-${index}`}
                  >
                    <button
                      type="button"
                      className="bg-surface rounded overflow-hidden border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      data-id={`${imageButtonDataIdPrefix}-image-btn-${index}`}
                      onClick={() => handleOpenLightbox(fullImagePath, label)}
                      aria-label={`Ampliar: ${label}`}
                    >
                      <img
                        src={fullImagePath}
                        alt={label}
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

      {(videos?.length ?? 0) > 0 && (
        <section data-id={videosDataId}>
          <div className="max-w-7xl mx-auto px-4 py-10">
            <p className="font-mono text-xs text-muted uppercase tracking-widest mb-6">Vídeos</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id={videosGridDataId}>
              {(videos ?? []).map((video, index) => {
                const embedUrl = getYouTubeEmbedUrl(video.image);
                if (!embedUrl) return null;

                return (
                  <div key={`${video.image}-${index}`} className="flex flex-col gap-2">
                    <iframe
                      src={embedUrl}
                      title={video.label || `Vídeo ${index + 1}`}
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

      <ImageLightbox
        open={lightbox.open}
        src={lightbox.src}
        alt={lightbox.alt}
        onClose={handleCloseLightbox}
      />
    </div>
  );
}

function getYouTubeEmbedUrl(url: string): string | null {
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return null;
}
