export interface GraphicDesignProject {
  id: number;
  date: string;
  title: string;
  cliente: string;
  descripcion: string;
  imagenes: { image: string; label: string }[];
  videos?: { image: string; label: string }[];
  extras?: unknown[];
}
