import React, { useEffect, useRef } from 'react';
import 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';

// Tipos para los props
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
    // @ts-expect-error jsvectormap types are incomplete

    import('jsvectormap').then(({ default: jsVectorMap }) => {
      mapInstance.current = new jsVectorMap({
        showTooltip: false,
        selector: mapRef.current,
        map: 'world',
        zoomButtons: true,
        zoomOnScroll: true,
        zoomOnTouch: true,
        regionStyle: {
          initial: {
            fill: '#e9e7e0',
            'fill-opacity': 1,
          },
          selected: {
            fill: '#d4542a',
          },
        },
        selectedRegions: highlightedCountries,
        markers: points.map((p) => ({
          name: p.name,
          coords: [p.lat, p.lon],
        })),
        markerStyle: {
          initial: {
            fill: '#FFF',
            stroke: '#FFF',
            r: 2,
          },
          hover: {
            fill: 'yellow',
            cursor: 'pointer',
          },
        },
        labels: {
          regions: {
            render: () => '',
          },
        },
      });
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
  }, [highlightedCountries, points]);

  return (
    <div className="relative w-full" style={{ height, overflow: 'hidden' }}>
      <div
        ref={mapRef}
        role="img"
        aria-label="Mapa de países visitados y lugares destacados"
        className="rounded-lg shadow border border-gray-200 bg-white w-full h-full"
        style={{ width: '100%', height: '100%', overflow: 'hidden' }}
      />
    </div>
  );
};

export default VisitedWorldMap;
