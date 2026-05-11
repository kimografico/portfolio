import { useState, type FormEvent } from 'react';
import UIButton from '../../../components/ui/UIButton';
import {
  createKimoPlace,
  createKimoPlaceMarker,
  type KimoPlaceMarkerPayload,
  type KimoPlacePayload,
} from '../../../api/apiClient';

interface PlaceFormState {
  city: string;
  place: string;
  country: string;
  date: string;
  people: string;
}

interface MarkerFormState {
  name: string;
  country: string;
  lat: string;
  lon: string;
}

const initialPlaceForm: PlaceFormState = {
  city: '',
  place: '',
  country: 'es',
  date: '',
  people: '',
};

const initialMarkerForm: MarkerFormState = {
  name: '',
  country: 'ES',
  lat: '',
  lon: '',
};

const PLACE_COUNTRIES = [
  { value: 'es', label: 'España' },
  { value: 'fr', label: 'Francia' },
  { value: 'nl', label: 'Países Bajos' },
  { value: 'th', label: 'Tailandia' },
  { value: 'gr', label: 'Grecia' },
  { value: 'ie', label: 'Irlanda' },
  { value: 'ad', label: 'Andorra' },
];

const MARKER_COUNTRIES = [
  { value: 'ES', label: 'España' },
  { value: 'FR', label: 'Francia' },
  { value: 'NL', label: 'Países Bajos' },
  { value: 'TH', label: 'Tailandia' },
  { value: 'GR', label: 'Grecia' },
  { value: 'IE', label: 'Irlanda' },
  { value: 'AD', label: 'Andorra' },
];

export default function AddPlacePage() {
  const [placeForm, setPlaceForm] = useState<PlaceFormState>(initialPlaceForm);
  const [markerForm, setMarkerForm] = useState<MarkerFormState>(initialMarkerForm);
  const [placeStatus, setPlaceStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [markerStatus, setMarkerStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  );
  const [placeError, setPlaceError] = useState('');
  const [markerError, setMarkerError] = useState('');
  const [createdPlaceId, setCreatedPlaceId] = useState('');
  const [createdMarkerId, setCreatedMarkerId] = useState('');

  function handlePlaceField<K extends keyof PlaceFormState>(key: K, value: PlaceFormState[K]) {
    setPlaceForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleMarkerField<K extends keyof MarkerFormState>(key: K, value: MarkerFormState[K]) {
    setMarkerForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePlaceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPlaceStatus('loading');
    setPlaceError('');

    try {
      if (!placeForm.place.trim()) {
        throw new Error('El lugar es obligatorio');
      }

      const payload: KimoPlacePayload = {
        city: placeForm.city.trim(),
        place: placeForm.place.trim(),
        country: placeForm.country.trim().toLowerCase(),
        date: placeForm.date.trim(),
        people: placeForm.people.trim(),
      };

      const result = await createKimoPlace(payload);
      const created = result.data as { id?: string } | undefined;
      setCreatedPlaceId(created?.id ?? '');
      setPlaceStatus('success');
      setPlaceForm(initialPlaceForm);
    } catch (error) {
      setPlaceStatus('error');
      setPlaceError(error instanceof Error ? error.message : 'Error al crear el lugar');
    }
  }

  async function handleMarkerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMarkerStatus('loading');
    setMarkerError('');

    try {
      const lat = Number(markerForm.lat);
      const lon = Number(markerForm.lon);
      if (!markerForm.name.trim()) {
        throw new Error('El nombre del marcador es obligatorio');
      }
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        throw new Error('Latitud y longitud deben ser números válidos');
      }

      const payload: KimoPlaceMarkerPayload = {
        name: markerForm.name.trim(),
        country: markerForm.country.trim().toUpperCase(),
        lat,
        lon,
      };

      const result = await createKimoPlaceMarker(payload);
      const created = result.data as { id?: string } | undefined;
      setCreatedMarkerId(created?.id ?? '');
      setMarkerStatus('success');
      setMarkerForm(initialMarkerForm);
    } catch (error) {
      setMarkerStatus('error');
      setMarkerError(error instanceof Error ? error.message : 'Error al crear el marcador');
    }
  }

  return (
    <section className="flex flex-col gap-8" data-id="add-place-page">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Añadir lugares</h2>
          <p className="text-sm text-muted">
            Se pueden crear lugares visitados y marcadores del mapa.
          </p>
        </div>
        <UIButton href="/kimo/places" arrowBack link dataId="add-place-back-btn">
          Volver a Viajes
        </UIButton>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <form
          className="grid gap-6 rounded-2xl border border-border bg-surface p-6"
          onSubmit={handlePlaceSubmit}
          data-id="add-place-form"
        >
          <div>
            <h3 className="text-xl font-semibold text-ink">Nuevo lugar</h3>
            <p className="text-sm text-muted">Se guardará en places.json.</p>
          </div>

          {placeStatus === 'success' && (
            <div
              className="rounded-lg border border-green-300 bg-green-50 p-4 text-green-800"
              data-id="add-place-success"
            >
              ✅ Lugar creado correctamente {createdPlaceId ? `(${createdPlaceId})` : ''}
            </div>
          )}
          {placeStatus === 'error' && (
            <div
              className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800"
              data-id="add-place-error"
            >
              ❌ {placeError}
            </div>
          )}

          <label className="grid gap-2 text-sm font-medium text-ink">
            Ciudad
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={placeForm.city}
              onChange={(e) => handlePlaceField('city', e.target.value)}
              data-id="add-place-city"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Lugar *
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={placeForm.place}
              onChange={(e) => handlePlaceField('place', e.target.value)}
              required
              data-id="add-place-name"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            País
            <select
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={placeForm.country}
              onChange={(e) => handlePlaceField('country', e.target.value)}
              data-id="add-place-country"
            >
              {PLACE_COUNTRIES.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Fecha
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={placeForm.date}
              onChange={(e) => handlePlaceField('date', e.target.value)}
              placeholder="YYYY / MM o texto libre"
              data-id="add-place-date"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Personas
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={placeForm.people}
              onChange={(e) => handlePlaceField('people', e.target.value)}
              data-id="add-place-people"
            />
          </label>

          <UIButton saveBtn disabled={placeStatus === 'loading'} dataId="add-place-save-btn">
            {placeStatus === 'loading' ? 'Guardando…' : 'Añadir lugar'}
          </UIButton>
        </form>

        <form
          className="grid gap-6 rounded-2xl border border-border bg-surface p-6"
          onSubmit={handleMarkerSubmit}
          data-id="add-place-marker-form"
        >
          <div>
            <h3 className="text-xl font-semibold text-ink">Nuevo marcador</h3>
            <p className="text-sm text-muted">Se guardará en places_markers.json.</p>
          </div>

          {markerStatus === 'success' && (
            <div
              className="rounded-lg border border-green-300 bg-green-50 p-4 text-green-800"
              data-id="add-place-marker-success"
            >
              ✅ Marcador creado correctamente {createdMarkerId ? `(${createdMarkerId})` : ''}
            </div>
          )}
          {markerStatus === 'error' && (
            <div
              className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800"
              data-id="add-place-marker-error"
            >
              ❌ {markerError}
            </div>
          )}

          <label className="grid gap-2 text-sm font-medium text-ink">
            Nombre *
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={markerForm.name}
              onChange={(e) => handleMarkerField('name', e.target.value)}
              required
              data-id="add-marker-name"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            País
            <select
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={markerForm.country}
              onChange={(e) => handleMarkerField('country', e.target.value)}
              data-id="add-marker-country"
            >
              {MARKER_COUNTRIES.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-ink">
              Latitud
              <input
                className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                value={markerForm.lat}
                onChange={(e) => handleMarkerField('lat', e.target.value)}
                placeholder="39.5696"
                data-id="add-marker-lat"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink">
              Longitud
              <input
                className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                value={markerForm.lon}
                onChange={(e) => handleMarkerField('lon', e.target.value)}
                placeholder="2.65016"
                data-id="add-marker-lon"
              />
            </label>
          </div>

          <UIButton saveBtn disabled={markerStatus === 'loading'} dataId="add-marker-save-btn">
            {markerStatus === 'loading' ? 'Guardando…' : 'Añadir marcador'}
          </UIButton>
        </form>
      </div>
    </section>
  );
}
