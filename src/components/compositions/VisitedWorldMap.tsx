import type { FeatureCollection } from 'geojson';
import type { VisitedWorldMapProps } from '../../interfaces/map';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import * as topojson from 'topojson-client';
import countriesTopologyRaw from '../../data/config/countries-50m.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const countriesTopology = countriesTopologyRaw as any;

const mapColors = {
  country: 'var(--color-border)',
  countryVisited: 'var(--color-accent)',
  border: 'var(--color-border)',
  marker: 'orange',
  markerHover: 'yellow',
};

// ISO-3166-1 numeric codes for the visited countries
const ISO2_TO_NUMERIC: Record<string, string> = {
  AD: '020',
  FR: '250',
  GR: '300',
  IE: '372',
  NL: '528',
  ES: '724',
  TH: '764',
  GB: '826',
};

export default function VisitedWorldMap({
  height = 500,
  highlightedCountries,
  points,
}: VisitedWorldMapProps) {
  const geos = useMemo(() => {
    const geojson = topojson.feature(
      countriesTopology,
      countriesTopology.objects.countries,
    ) as unknown as FeatureCollection;

    // Split France (id 250) MultiPolygon into individual polygons.
    // Mainland keeps id 250 (highlighted as visited).
    // Overseas territories get synthetic ids (appear as separate countries).
    const FRANCE_ID = '250';
    const MAINLAND_BBOX = { lonMin: -5, lonMax: 8.5, latMin: 41, latMax: 51 };
    let overseasIndex = 0;

    return geojson.features.flatMap((f) => {
      if (String(f.id) !== FRANCE_ID) return [f as unknown as Record<string, unknown>];
      if (f.geometry.type !== 'MultiPolygon') return [f as unknown as Record<string, unknown>];
      return f.geometry.coordinates.map((polygon) => {
        const ring = polygon[0];
        const avgLon = ring.reduce((s, c) => s + c[0], 0) / ring.length;
        const avgLat = ring.reduce((s, c) => s + c[1], 0) / ring.length;
        const isMainland =
          avgLon >= MAINLAND_BBOX.lonMin &&
          avgLon <= MAINLAND_BBOX.lonMax &&
          avgLat >= MAINLAND_BBOX.latMin &&
          avgLat <= MAINLAND_BBOX.latMax;
        return {
          ...f,
          id: isMainland ? f.id : `fr-territory-${overseasIndex++}`,
          geometry: { type: 'Polygon' as const, coordinates: polygon },
        } as unknown as Record<string, unknown>;
      });
    });
  }, []);

  const [hoveredMarker, setHoveredMarker] = useState<{ name: string; x: number; y: number } | null>(
    null,
  );
  const mapRef = useRef<HTMLDivElement>(null);

  const highlightedSet = useMemo(
    () => new Set(highlightedCountries.map((c) => c.toUpperCase())),
    [highlightedCountries],
  );

  const isVisited = useCallback(
    (geo: { id?: string | number }): boolean => {
      const numericId = String(geo.id ?? '');
      // Find which ISO-2 code this numeric id corresponds to
      const iso2 = Object.entries(ISO2_TO_NUMERIC).find(([, num]) => num === numericId)?.[0];
      if (!iso2) return false;
      // France: at 110m the overseas territories are tiny/invisible,
      // so highlighting id 250 effectively highlights mainland only
      return highlightedSet.has(iso2);
    },
    [highlightedSet],
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
        <ZoomableGroup zoom={1.6}>
          <Geographies geography={geos}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
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
                r={0.5}
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
