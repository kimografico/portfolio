import PlacesTable from './PlacesTable';
import VisitedWorldMap from '../../../components/compositions/VisitedWorldMap';
import places from '../../../data/kimo/places.json';
import markers from '../../../data/kimo/places_markers.json';

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
        <VisitedWorldMap highlightedCountries={countries} points={markers} height={500} />
      </div>
      <div data-id="places-table">
        <PlacesTable />
      </div>
    </section>
  );
}
