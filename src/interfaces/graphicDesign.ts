export interface GraphicDesignProject {
  id: number;
  date: string;
  title: string;
  cliente: string;
  descripcion: string;
  imagenes: { ruta: string; label: string }[];
  videos?: { ruta: string; label: string }[];
  extras?: unknown[];
}
