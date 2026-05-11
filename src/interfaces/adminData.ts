export type AdminEntryType = 'Diseño Gráfico' | 'Desarrollo';

export type AdminEntryId = number | string;

export interface AdminMediaItem {
  image: string;
  label?: string;
}

export interface AdminVideoItem {
  image: string;
  label?: string;
}

export interface AdminSourceEntry {
  id: AdminEntryId;
  date?: string;
  title?: string;
  cliente?: string;
  descripcion?: string;
  imagenes?: AdminMediaItem[];
  videos?: AdminVideoItem[];
  extras?: string[];
  visible?: boolean;
  type?: string;
  category?: string;
  stack?: string[];
  [key: string]: unknown;
}

export interface AdminDataSource {
  data: AdminSourceEntry[];
  type: AdminEntryType;
  category: string;
}

export interface DataEntry {
  id: AdminEntryId;
  date: string;
  title: string;
  cliente: string;
  type: AdminEntryType;
  category: string;
  visible: boolean;
}

export interface PendingEntry extends DataEntry {
  extrasCount: number;
  extras: string[];
}

export interface FilterOptions {
  filterType: string;
  filterCategory: string;
  filterCliente: string;
  filterVisibility: 'all' | 'visible' | 'hidden';
  localVisibility: Record<AdminEntryId, boolean>;
}
