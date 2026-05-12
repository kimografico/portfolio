import type { VisitedWorldMapProps } from '../../interfaces/map';
import { useEffect, useRef, useState } from 'react';

// Paleta única para el mapa (azul o imagen de fondo)
const UI_IMG_PATH =
  import.meta.env.VITE_UI_IMG_PATH?.trim() || `${import.meta.env.BASE_URL}images/ui`;

const mapColors = {
  ocean: 'var(--color-bg-map)',
  oceanImage: `url(${UI_IMG_PATH}/map-bg.jpg)`,
  country: 'var(--color-border)',
  countryVisited: 'var(--color-accent)',
  marker: 'orange',
  markerSize: 1,
  markerStroke: '',
  markerHover: 'yellow',
  border: 'var(--color-border)',
};

type JsVectorMapInstance = {
  destroy?: () => void;
};

function destroyMapInstance(instance: JsVectorMapInstance | null): void {
  if (!instance || typeof instance.destroy !== 'function') {
    return;
  }

  try {
    instance.destroy();
  } catch {
    // Silencia error de doble dispose
  }
}

function applyBackgroundMode(mapElement: HTMLDivElement, antique: boolean): void {
  const svg = mapElement.querySelector('svg');

  if (!svg) {
    return;
  }

  svg.style.background = '';
  svg.style.backgroundImage = '';
  svg.style.backgroundSize = '';

  if (antique) {
    svg.style.backgroundImage = mapColors.oceanImage;
    svg.style.backgroundSize = 'cover';

    svg.querySelectorAll<SVGPathElement>('path[data-code]').forEach((path) => {
      const fill = path.getAttribute('fill');
      path.style.mixBlendMode = fill && fill !== mapColors.countryVisited ? 'multiply' : '';
    });
    return;
  }

  svg.style.background = mapColors.ocean;
  svg.querySelectorAll<SVGPathElement>('path[data-code]').forEach((path) => {
    path.style.mixBlendMode = '';
  });
}

/**
 * Mapa vectorial minimalista de países visitados usando JVM.
 * - Resalta países visitados
 * - Muestra puntos en ubicaciones concretas
 * - Zoom nativo habilitado (botones, rueda, pinch)
 * - Accesible: role="img", aria-label
 */
export default function VisitedWorldMap({
  height = 500,
  highlightedCountries,
  points,
}: VisitedWorldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<JsVectorMapInstance | null>(null);
  const antiqueRef = useRef(false);
  const [antique, setAntique] = useState(false);

  useEffect(() => {
    antiqueRef.current = antique;
  }, [antique]);

  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;
    let styleTimeoutId: number | undefined;

    const initializeMap = async () => {
      const { default: jsVectorMap } = await import('jsvectormap');
      await import('jsvectormap/dist/maps/world.js');

      if (cancelled || !mapRef.current) {
        return;
      }

      destroyMapInstance(mapInstance.current);

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
            r: mapColors.markerSize,
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

      styleTimeoutId = window.setTimeout(() => {
        if (mapRef.current) {
          applyBackgroundMode(mapRef.current, antiqueRef.current);
        }
      }, 0);
    };

    void initializeMap();

    return () => {
      cancelled = true;

      if (styleTimeoutId !== undefined) {
        window.clearTimeout(styleTimeoutId);
      }

      destroyMapInstance(mapInstance.current);
      mapInstance.current = null;
    };
  }, [highlightedCountries, points]);

  useEffect(() => {
    if (!mapRef.current) return;

    const styleTimeoutId = window.setTimeout(() => {
      applyBackgroundMode(mapRef.current as HTMLDivElement, antique);
    }, 0);

    return () => {
      window.clearTimeout(styleTimeoutId);
    };
  }, [antique]);

  return (
    <div
      className="relative w-full"
      style={{ height, overflow: 'hidden' }}
      data-id="visited-world-map-section"
    >
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
        }}
      />
      {/* Botón toggle abajo a la derecha */}
      <button
        type="button"
        onClick={() => setAntique((v) => !v)}
        className="absolute bottom-0 right-0 z-10 w-8 h-8 flex items-center justify-center text-base"
        aria-pressed={antique}
        title="Alternar estilo antiguo/moderno"
        aria-label={antique ? 'Cambiar a estilo moderno' : 'Cambiar a estilo antiguo'}
        data-id="visited-world-map-toggle"
      >
        {antique ? '⚓️' : '☠️'}
      </button>
    </div>
  );
}
