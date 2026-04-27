export interface DevImage {
  ruta: string;
  label: string;
}

export interface DevVideo {
  ruta: string;
  label: string;
}

export interface WordpressProject {
  id: number;
  date: string;
  title: string;
  cliente: string;
  descripcion: string;
  stack: string[];
  imagenes: DevImage[];
  videos: DevVideo[];
  extras: string[];
}
