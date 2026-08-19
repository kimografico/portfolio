import type { FeatureCollection } from 'geojson';
import type { VisitedWorldMapProps } from '../../interfaces/map';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import * as topojson from 'topojson-client';
import { VISITED_COUNTRIES } from '../../data/config/visitedCountries';
import subunitsTopologyRaw from '../../data/config/world-subunits-50m.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const subunitsTopology = subunitsTopologyRaw as any;

const mapColors = {
  country: 'var(--color-border)',
  countryVisited: 'var(--color-accent)',
  marker: 'orange',
  markerHover: 'yellow',
};

export default function VisitedWorldMap({
  height = 500,
  highlightedCountries,
  points,
}: VisitedWorldMapProps) {
  const geos = useMemo(() => {
    const geojson = topojson.feature(
      subunitsTopology,
      subunitsTopology.objects.ne_50m_admin_0_map_subunits,
    ) as unknown as FeatureCollection;
    return geojson.features as unknown as Array<Record<string, unknown>>;
  }, []);

  const [hoveredMarker, setHoveredMarker] = useState<{ name: string; x: number; y: number } | null>(
    null,
  );
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const highlightedSuA3 = useMemo(() => {
    const codes = new Set<string>();
    for (const iso2 of highlightedCountries) {
      const suA3 = VISITED_COUNTRIES[iso2.toUpperCase()];
      if (suA3) suA3.forEach((c) => codes.add(c));
    }
    return codes;
  }, [highlightedCountries]);

  const isVisited = useCallback(
    (geo: { properties?: Record<string, unknown> }): boolean => {
      const suA3 = String(geo.properties?.SU_A3 ?? '');
      return highlightedSuA3.has(suA3);
    },
    [highlightedSuA3],
  );

  return (
    <div
      ref={mapRef}
      className="relative w-full"
      style={{ height, overflow: 'hidden' }}
      data-id="visited-world-map-section"
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 100,
          center: [20, 50],
        }}
        width={800}
        height={450}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup zoom={1.6} maxZoom={25}>
          <Geographies geography={geos}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const name = String(geo.properties?.NAME_ES ?? geo.properties?.NAME ?? '');
                    if (!name) return;
                    setHoveredCountry(name);
                  }}
                  onMouseLeave={() => setHoveredCountry(null)}
                  style={{
                    default: {
                      fill: isVisited(geo) ? mapColors.countryVisited : mapColors.country,
                      stroke: '#000',
                      strokeWidth: 0.1,
                      outline: 'none',
                    },
                    hover: {
                      fill: isVisited(geo) ? mapColors.countryVisited : mapColors.country,
                      stroke: '#000',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: 'default',
                    },
                    pressed: {
                      fill: isVisited(geo) ? mapColors.countryVisited : mapColors.country,
                      stroke: '#000',
                      strokeWidth: 0.1,
                      outline: 'none',
                    },
                  }}
                />
              ))
            }
          </Geographies>
          {points.map((p, i) => (
            <Marker key={`${p.name}-${p.lat}-${p.lon}-${i}`} coordinates={[p.lon, p.lat]}>
              <circle
                r={0.25}
                fill={mapColors.marker}
                stroke="none"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  (e.target as SVGCircleElement).setAttribute('fill', mapColors.markerHover);
                  const rect = mapRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  setHoveredMarker({
                    name: p.name,
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  });
                }}
                onMouseLeave={(e) => {
                  (e.target as SVGCircleElement).setAttribute('fill', mapColors.marker);
                  setHoveredMarker(null);
                }}
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      {hoveredCountry && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            padding: '3px 8px',
            fontSize: 20,
            fontWeight: 600,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        >
          {hoveredCountry}
        </div>
      )}
      {hoveredMarker && (
        <div
          style={{
            position: 'absolute',
            left: hoveredMarker.x,
            top: hoveredMarker.y - 10,
            transform: 'translate(-50%, -100%)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: 11,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        >
          {hoveredMarker.name}
        </div>
      )}
    </div>
  );
}
