export interface MapPoint {
  name: string;
  lat: number;
  lon: number;
}

export interface VisitedWorldMapProps {
  height?: number;
  highlightedCountries: string[]; // ISO 3166-1 alpha-2 codes, e.g. ['ES', 'FR', 'TH']
  points: MapPoint[];
}
