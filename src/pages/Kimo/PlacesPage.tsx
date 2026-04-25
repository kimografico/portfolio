import PlacesTable from './PlacesTable';
import VisitedWorldMap from '../../components/combinations/VisitedWorldMap';
import type { MapPoint } from '../../interfaces/map';
import places from '../../data/places.json';

// Mocks locales: puntos destacados. Se podrian añadir al JSON los lugares y crear un array
const MOCK_POINTS: MapPoint[] = [
  // { name: 'Valencia', lat: 39.4699, lon: -0.3763 },
  // { name: 'París', lat: 48.8566, lon: 2.3522 },
];

/**
 * Página de lugares visitados: muestra mapa y tabla
 * Los mocks de países y puntos están definidos localmente para mantener el componente agnóstico.
 */

// Devuelve una lista de países únicos del fichero places.json
function getUniqueCountries() {
  const allCountries = places.map((p) => p.country?.toUpperCase()).filter(Boolean);
  return Array.from(new Set(allCountries));
}

export default function PlacesPage() {
  // Lista de países únicos extraídos del JSON
  const countries = getUniqueCountries();
  return (
    <section data-id="places-page" className="flex flex-col gap-8">
      {/* Mapa de países visitados */}
      <div data-id="places-map">
        <VisitedWorldMap highlightedCountries={countries} points={MOCK_POINTS} height={500} />
      </div>
      <div data-id="places-table">
        <PlacesTable />
      </div>
    </section>
  );
}
