export interface Illustration {
  id: string;
  nombre: string;
  image: string; // Nombre de archivo de imagen principal en /src/assets/images/illustrations
  fecha?: string; // YYYY-MM
  cliente?: string;
  descripcion?: string;
  imagenesExtra?: Array<{
    image: string;
    label: string; // mockup, detalle, proceso, etc.
  }>;
}
