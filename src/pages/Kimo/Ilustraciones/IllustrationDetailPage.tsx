import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import type { Illustration } from '../../../interfaces/illustration';
import illustrations from '../../../data/illustrations.json';
import './IllustrationDetailPage.css';

const ILLUSTRATIONS_PATH = import.meta.env.VITE_ILLUSTRATIONS_PATH;

export default function IllustrationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const illustration = useMemo<Illustration | undefined>(
    () => illustrations.find((i) => i.id === id),
    [id],
  );

  if (!illustration) {
    return (
      <div className="flex flex-col gap-12">
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto py-16 md:py-24">
            <p className="text-muted text-center">Ilustración no encontrada.</p>
            <button
              onClick={() => navigate('/kimo/ilustraciones')}
              className="mt-6 text-accent hover:underline text-sm"
              type="button"
            >
              ← Volver a ilustraciones
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Botón volver */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto py-6">
          <button
            onClick={() => navigate('/kimo/ilustraciones')}
            className="text-sm text-muted hover:text-ink transition-colors duration-150"
            type="button"
          >
            ← Volver a ilustraciones
          </button>
        </div>
      </section>

      {/* Imagen principal */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto py-12">
          <img
            src={`${ILLUSTRATIONS_PATH}/${illustration.ilustracion}`}
            alt={illustration.nombre}
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
                  {illustration.nombre}
                </h2>
              </div>

              {(illustration.cliente || illustration.fecha) && (
                <div>
                  {illustration.cliente && (
                    <p className="text-sm text-muted mb-2">
                      <span className="font-mono text-xs tracking-widest uppercase">Cliente</span>
                      <br />
                      <span className="text-base font-medium text-ink">{illustration.cliente}</span>
                    </p>
                  )}
                  {illustration.fecha && (
                    <p className="text-sm text-muted">
                      <span className="font-mono text-xs tracking-widest uppercase">Fecha</span>
                      <br />
                      <span className="text-base font-medium text-ink">{illustration.fecha}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Descripción */}
            {illustration.descripcion && (
              <div>
                <p className="text-lg leading-relaxed text-muted">{illustration.descripcion}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Imágenes extra */}
      {illustration.imagenesExtra && illustration.imagenesExtra.length > 0 && (
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto py-16 md:py-20">
            <h3 className="font-mono text-xs tracking-widest uppercase text-muted mb-12">
              Proceso y detalles
            </h3>
            <div className="illustration-extras-grid">
              {illustration.imagenesExtra.map((extra, i) => (
                <div key={`${illustration.id}-extra-${i}`} className="illustration-extra">
                  <img
                    src={`${ILLUSTRATIONS_PATH}/${extra.ruta}`}
                    alt={extra.label}
                    className="illustration-extra-image"
                  />
                  <p className="text-xs text-muted mt-3">{extra.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
