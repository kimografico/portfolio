export interface Illustration {
  id: string;
  nombre: string;
  ilustracion: string; // Ruta a imagen principal en /src/assets/images/illustrations
  fecha?: string; // YYYY-MM
  cliente?: string;
  descripcion?: string;
  imagenesExtra?: Array<{
    ruta: string;
    label: string; // mockup, detalle, proceso, etc.
  }>;
}
