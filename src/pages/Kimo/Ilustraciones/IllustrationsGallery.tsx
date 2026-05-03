import { useState } from 'react';
import type { Illustration } from '../../../interfaces/illustration';
import '../../../styles/IllustrationsGallery.css';

const ILLUSTRATIONS_PATH = import.meta.env.VITE_ILLUSTRATIONS_PATH;

interface IllustrationsGalleryProps {
  illustrations: Illustration[];
  onSelectIllustration?: (id: string) => void;
}

export default function IllustrationsGallery({
  illustrations,
  onSelectIllustration,
}: IllustrationsGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="illustrations-gallery" data-id="illustrations-gallery">
      <div className="illustrations-grid" data-id="illustrations-gallery-grid">
        {illustrations.map((illustration) => (
          <button
            key={illustration.id}
            className="illustration-card"
            onMouseEnter={() => setHoveredId(illustration.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectIllustration?.(illustration.id)}
            type="button"
            aria-label={`Ver ilustración: ${illustration.nombre}`}
            data-id={`illustration-card-${illustration.id}`}
          >
            <div className="illustration-image-wrapper">
              <img
                src={`${ILLUSTRATIONS_PATH}/${illustration.ilustracion}`}
                alt={illustration.nombre}
                className="illustration-image"
              />
              {hoveredId === illustration.id && (
                <div className="illustration-overlay">
                  <span className="illustration-overlay-text">Ver detalles →</span>
                </div>
              )}
              <div className="illustration-info">
                <h3 className="illustration-title">{illustration.nombre}</h3>
                {illustration.fecha && <p className="illustration-meta">{illustration.fecha}</p>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
