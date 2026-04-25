import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import PrevNextBtns from '../../../components/ui/PrevNextBtns';
import ImageLightbox from '../../../components/ui/ImageLightbox';
import type { Illustration } from '../../../interfaces/illustration';
import illustrations from '../../../data/illustrations.json';
import './IllustrationDetailPage.css';

const ILLUSTRATIONS_PATH = import.meta.env.VITE_ILLUSTRATIONS_PATH;

export default function IllustrationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estado para lightbox de imagen extra
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; alt?: string } | null>(null);

  const handleOpenLightbox = (src: string, alt?: string) => {
    setLightboxImg({ src, alt });
    setLightboxOpen(true);
  };
  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setTimeout(() => setLightboxImg(null), 500); // Espera animación
  };

  const illustration = useMemo<Illustration | undefined>(
    () => illustrations.find((i) => i.id === id),
    [id],
  );
  const currentIndex = useMemo(() => illustrations.findIndex((i) => i.id === id), [id]);
  const prev = currentIndex > 0 ? illustrations[currentIndex - 1] : undefined;
  const next =
    currentIndex < illustrations.length - 1 && currentIndex !== -1
      ? illustrations[currentIndex + 1]
      : undefined;

  return (
    <div className="flex flex-col gap-8">
      {/* Cabecera con volver y navegación */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto py-6 flex items-center justify-between gap-4">
          {/* Botón volver */}
          <button
            onClick={() => navigate('/kimo/ilustraciones')}
            className="text-sm text-muted hover:text-ink transition-colors duration-150"
            type="button"
          >
            ← Volver a ilustraciones
          </button>
          {/* Navegación con componente extraído */}
          <PrevNextBtns
            onPrev={() => prev && navigate(`/kimo/ilustraciones/${prev.id}`)}
            onNext={() => next && navigate(`/kimo/ilustraciones/${next.id}`)}
            disabledPrev={!prev}
            disabledNext={!next}
          />
        </div>
      </section>

      {/* Imagen principal */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto py-12">
          <img
            src={`${ILLUSTRATIONS_PATH}/${illustration!.ilustracion}`}
            alt={illustration!.nombre}
            className="illustration-main-image"
          />
        </div>
      </section>

      {/* Información */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
            {/* Metadatos */}
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl md:text-6xl font-semibold tracking-tighter leading-none text-ink mb-6">
                  {illustration!.nombre}
                </h2>
              </div>

              {(illustration!.cliente || illustration!.fecha) && (
                <div>
                  {illustration!.cliente && (
                    <p className="text-sm text-muted mb-2">
                      <span className="font-mono text-xs tracking-widest uppercase">Cliente</span>
                      <br />
                      <span className="text-base font-medium text-ink">
                        {illustration!.cliente}
                      </span>
                    </p>
                  )}
                  {illustration!.fecha && (
                    <p className="text-sm text-muted">
                      <span className="font-mono text-xs tracking-widest uppercase">Fecha</span>
                      <br />
                      <span className="text-base font-medium text-ink">{illustration!.fecha}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Descripción */}
            {illustration!.descripcion && (
              <div>
                <p className="text-lg leading-relaxed text-muted">{illustration!.descripcion}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Imágenes extra */}
      {illustration!.imagenesExtra && illustration!.imagenesExtra.length > 0 && (
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto py-16 md:py-20">
            <h3 className="font-mono text-xs tracking-widest uppercase text-muted mb-12">
              Proceso y detalles
            </h3>
            <div className="illustration-extras-grid">
              {illustration!.imagenesExtra.map((extra, i) => (
                <div key={`${illustration!.id}-extra-${i}`} className="illustration-extra">
                  <img
                    src={`${ILLUSTRATIONS_PATH}/${extra.ruta}`}
                    alt={extra.label}
                    className="illustration-extra-image cursor-zoom-in"
                    onClick={() =>
                      handleOpenLightbox(`${ILLUSTRATIONS_PATH}/${extra.ruta}`, extra.label)
                    }
                    tabIndex={0}
                    role="button"
                    aria-label={`Ampliar imagen: ${extra.label}`}
                    onKeyDown={(e) =>
                      (e.key === 'Enter' || e.key === ' ') &&
                      handleOpenLightbox(`${ILLUSTRATIONS_PATH}/${extra.ruta}`, extra.label)
                    }
                  />
                  <p className="text-xs text-muted mt-3">{extra.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox de imagen ampliada */}
      {lightboxImg && (
        <ImageLightbox
          open={lightboxOpen}
          src={lightboxImg.src}
          alt={lightboxImg.alt}
          onClose={handleCloseLightbox}
        />
      )}
    </div>
  );
}
