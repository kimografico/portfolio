import React, { useRef, useState, useEffect } from 'react';
import 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';
// Paleta única para el mapa (azul o imagen de fondo)
const mapColors = {
  ocean: '#f2f7fc',
  oceanImage: 'url(/portfolio/images/map-bg.jpg)',
  country: 'var(--color-border)',
  countryVisited: 'var(--color-accent)',
  marker: '#FFF',
  markerStroke: '#FFF',
  markerHover: 'yellow',
  border: 'var(--color-border)',
};
export interface MapPoint {
  name: string;
  lat: number;
  lon: number;
}

interface VisitedWorldMapProps {
  height?: number;
  highlightedCountries: string[]; // ISO 3166-1 alpha-2 codes, e.g. ['ES', 'FR', 'TH']
  points: MapPoint[];
}

/**
 * Mapa vectorial minimalista de países visitados usando JVM.
 * - Resalta países visitados
 * - Muestra puntos en ubicaciones concretas
 * - Zoom nativo habilitado (botones, rueda, pinch)
 * - Accesible: role="img", aria-label
 */
const VisitedWorldMap: React.FC<VisitedWorldMapProps> = ({
  height = 500,
  highlightedCountries,
  points,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Record<string, unknown> | null>(null);
  // antique ahora solo alterna fondo azul/fondo imagen
  const [antique, setAntique] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;
    // Limpia el mapa anterior si lo hay
    if (mapInstance.current) {
      // JVM puede lanzar error si destroy llama a dispose y ya está destruido
      try {
        const map = mapInstance.current as Record<string, unknown>;
        if (typeof map.destroy === 'function') {
          (map.destroy as () => void)();
        }
      } catch {
        // Silencia error de doble dispose
      }
    }
    // Inicializa JVM

    import('jsvectormap').then(({ default: jsVectorMap }) => {
      // Cambia aquí entre mapColors y mapAntique para el modo deseado
      mapInstance.current = new jsVectorMap({
        showTooltip: false,
        selector: mapRef.current,
        map: 'world',
        zoomButtons: true,
        zoomOnScroll: true,
        zoomOnTouch: true,
        regionStyle: {
          initial: {
            fill: mapColors.country,
            'fill-opacity': 1,
          },
          selected: {
            fill: mapColors.countryVisited,
          },
        },
        selectedRegions: highlightedCountries,
        markers: points.map((p) => ({
          name: p.name,
          coords: [p.lat, p.lon],
        })),
        markerStyle: {
          initial: {
            fill: mapColors.marker,
            stroke: mapColors.markerStroke,
            r: 2,
          },
          hover: {
            fill: mapColors.markerHover,
            cursor: 'pointer',
          },
        },
        labels: {
          regions: {
            render: () => '',
          },
        },
      });
      // Forzar fondo imagen y blend multiply en países
      setTimeout(() => {
        if (mapRef.current) {
          const svg = mapRef.current.querySelector('svg');
          if (svg) {
            // Limpia cualquier fondo previo
            svg.style.background = '';
            svg.style.backgroundImage = '';
            svg.style.backgroundSize = '';
            if (antique) {
              svg.style.backgroundImage = mapColors.oceanImage;
              svg.style.backgroundSize = 'cover';
              svg.style.borderRadius = '0';
              // Aplica blend multiply a los países no seleccionados
              svg
                .querySelectorAll('path[data-code]:not([fill="' + mapColors.countryVisited + '"])')
                .forEach((el) => {
                  (el as SVGPathElement).style.mixBlendMode = 'multiply';
                });
            } else {
              svg.style.background = mapColors.ocean;
              svg.style.backgroundSize = '';
              svg.style.borderRadius = '25rem';
              svg.querySelectorAll('path[data-code]').forEach((el) => {
                (el as SVGPathElement).style.mixBlendMode = '';
              });
            }
          }
        }
      }, 0);
    });

    // Cleanup
    return () => {
      if (mapInstance.current) {
        // JVM puede lanzar error si destroy llama a dispose y ya está destruido
        try {
          const map = mapInstance.current as Record<string, unknown>;
          if (typeof map.destroy === 'function') {
            (map.destroy as () => void)();
          }
        } catch {
          // Silencia error de doble dispose
        }
      }
    };
  }, [highlightedCountries, points, antique]);

  return (
    <div className="relative w-full" style={{ height, overflow: 'hidden' }}>
      <div
        key={antique ? 'antique' : 'modern'}
        ref={mapRef}
        role="img"
        aria-label="Mapa de países visitados y lugares destacados"
        className={`rounded-lg w-full h-full`}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          background: 'none',
          borderRadius: antique ? '0' : '10rem',
        }}
      />
      {/* Botón toggle abajo a la derecha */}
      <button
        type="button"
        onClick={() => setAntique((v) => !v)}
        className="absolute bottom-0 right-0 z-10 w-8 h-8 flex items-center justify-center text-base"
        aria-pressed={antique}
        title="Alternar estilo antiguo/moderno"
      >
        {antique ? '⚓️' : '☠️'}
      </button>
    </div>
  );
};

export default VisitedWorldMap;
