---
name: add-place
description: Use when the user wants to add a visited place or map marker to their travel diary/portfolio. Trigger keywords: "añadir lugar", "agregar lugar", "nuevo lugar", "add place", "viaje", "lugar", "marcador", "mapa". Handles searching for coordinates, country codes, and creating entries via the API.
---

# Add Place Skill

You help the user add a visited place (and optionally a map marker) to their travel diary stored in `src/data/kimo/places.json` and `src/data/kimo/places_markers.json` via the backend API.

## Data Structures

### Place

| Field | Required | Format | Notes |
|-------|----------|--------|-------|
| `id` | No | `"place-NNN"` | Auto-generated server-side |
| `city` | No | string | Can be empty |
| `place` | **Yes** | string | Name of the place |
| `country` | **Yes** | ISO 2 lowercase | `"es"`, `"fr"`, `"nl"`, `"th"`, `"gr"`, `"ie"`, `"ad"` |
| `date` | No | free text | `"2005"`, `"2013 / 08"`, or empty |
| `people` | No | CSV string | `"Mar, Verobe"` or empty |

### Place Marker

| Field | Required | Format | Notes |
|-------|----------|--------|-------|
| `id` | No | `"marker-NNN"` | Auto-generated server-side |
| `name` | **Yes** | string | Location name for the map |
| `country` | **Yes** | ISO 2 **UPPERCASE** | `"ES"`, `"FR"`, `"NL"`, `"TH"`, `"GR"`, `"IE"`, `"AD"` |
| `lat` | **Yes** | decimal number | e.g. `39.5696` |
| `lon` | **Yes** | decimal number | e.g. `2.65016` |

### Valid Countries

| Code (place) | Code (marker) | Label |
|--------------|---------------|-------|
| `es` | `ES` | España |
| `fr` | `FR` | Francia |
| `nl` | `NL` | Países Bajos |
| `th` | `TH` | Tailandia |
| `gr` | `GR` | Grecia |
| `ie` | `IE` | Irlanda |
| `gb` | `GB` | Reino Unido |
| `ad` | `AD` | Andorra |

## Workflow

### Step 1: Get the place name

Ask the user: **"¿Qué lugar quieres añadir? Dime el nombre del lugar."**

### Step 2: Search for metadata

Use `websearch` to find:
- **city** (nearest city or region)
- **country** (and its ISO code)
- **lat / lon** (coordinates for the marker)

Search queries like:
- `"[place name] coordenadas lat lon"`
- `"[place name] city country coordinates"`

### Step 3: Present what you found and ask for missing data

Show what you found and ask for what you **cannot** know:

```
He encontrado estos datos:
- Lugar: [place]
- Ciudad: [city]
- País: [country name] ([ISO code])
- Coordenadas: [lat], [lon]

Para completar el registro necesito:
1. ¿Cuándo visitaste este lugar? (ej: "2013 / 08", "2005", o texto libre)
2. ¿Con quién fuiste? (nombres separados por coma, o vacío si solo)
3. ¿Quieres añadir un marcador en el mapa para este lugar? (sí/no)
```

**Never skip asking for date and people.** The user must provide these.

### Step 4: Register new country (if needed)

If the country code is **not** already in the "Valid Countries" table above, you must add it to the frontend before creating the place. Two files need updating:

**4a. `src/pages/Kimo/Admin/AddPlacePage.tsx`** — Add the country to both arrays:

```typescript
const PLACE_COUNTRIES = [
  // ... existing entries ...
  { value: '[ISO lowercase]', label: '[Country name]' },
];

const MARKER_COUNTRIES = [
  // ... existing entries ...
  { value: '[ISO UPPERCASE]', label: '[Country name]' },
];
```

**4b. Update this skill file** — Add the new country to the "Valid Countries" table so future runs skip this step.

No changes needed in `PlacesTable.tsx` — it uses `flag-icons` CSS which supports all countries automatically via `<span className="fi fi-{country-code}">`.

If the country already exists in the table, skip this step.

### Step 5: Create the place

```bash
curl -s -X POST http://localhost:3001/api/kimo/places \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(cat .env | grep KIMO_PASSWORD_HASH | cut -d'=' -f2)" \
  -d '{
    "city": "[city]",
    "place": "[place]",
    "country": "[ISO lowercase]",
    "date": "[date]",
    "people": "[people]"
  }'
```

### Step 6: Create the marker (if user wants one)

If the user wants a map marker, ask for a name (or use the place name):

```bash
curl -s -X POST http://localhost:3001/api/kimo/places-markers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(cat .env | grep KIMO_PASSWORD_HASH | cut -d'=' -f2)" \
  -d '{
    "name": "[marker name]",
    "country": "[ISO UPPERCASE]",
    "lat": [latitude],
    "lon": [longitude]
  }'
```

### Step 7: Confirm

Tell the user:
- **"Lugar creado correctamente con ID: `[place-id]`"**
- If marker: **"Marcador creado correctamente con ID: `[marker-id]`"**

## Important Notes

- Place IDs are sequential: `"place-001"`, `"place-002"`, etc. (zero-padded to 3 digits)
- Marker IDs are sequential: `"marker-001"`, `"marker-002"`, etc.
- Country is stored **lowercase** for places (`"es"`) but **UPPERCASE** for markers (`"ES"`)
- The `date` field is free text, no strict format. Common patterns: `"2005"`, `"2013 / 08"`, `"2025 / 10"`
- The `people` field is comma-separated names: `"Mar, Verobe"` or empty string
- The backend must be running on `localhost:3001`
- Auth token comes from `KIMO_PASSWORD_HASH` in `.env`
