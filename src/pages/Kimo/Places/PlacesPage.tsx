import UIButton from '../../../components/ui/UIButton';
import PlacesTable from './PlacesTable';
import VisitedWorldMap from '../../../components/compositions/VisitedWorldMap';
import { APP_BASENAME } from '../../../data/config/app';
import places from '../../../data/kimo/places.json';
import markers from '../../../data/kimo/places_markers.json';
import { useBackendStatus } from '../../../contexts/BackendStatusContext';
import { isKimoAuthenticated } from '../../../lib/kimoAuth';

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
  const { alive } = useBackendStatus();
  // Lista de países únicos extraídos del JSON
  const countries = getUniqueCountries();
  return (
    <section data-id="places-page" className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink">Lugares visitados</h2>
          <p className="text-sm text-muted">Mapa con marcadores y tabla de viajes.</p>
        </div>
        {isKimoAuthenticated() && (
          <UIButton
            href={`${APP_BASENAME}/kimo/add-place`}
            dataId="places-add-place-btn"
            addBtn
            arrow
            disabled={alive === false}
          >
            Añadir lugar
          </UIButton>
        )}
      </div>
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
