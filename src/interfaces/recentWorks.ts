/**
 * Interfaz para Recent Works (trabajos recientes en la landing)
 */

export interface RecentWork {
  num: string;
  title: string;
  tipo: string;
  year: string;
  category: 'Developer' | 'GraphicDesign';
  href: string;
}

export interface RecentWorksManagerProps {
  onSave?: (data: RecentWork[]) => void;
}
