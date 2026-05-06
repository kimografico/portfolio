/**
 * Cliente HTTP para la API backend local.
 * Centraliza la base URL y el manejo de errores para todas las llamadas a la API.
 */

export const API_BASE = 'http://localhost:3001';

import type { ResumeData } from '../interfaces/resume';

/** Respuesta genérica de la API */
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

/** Realiza un fetch a la API y lanza un error si la respuesta no es exitosa */
async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error(json.error ?? 'Error desconocido');
  }

  return json;
}

// --- Proyectos ---

export interface ProjectPayload {
  type: 'gd' | 'dev';
  category: string;
  title: string;
  cliente: string;
  descripcion?: string;
  visible?: boolean;
  imagenes?: { image: string; label: string }[];
  videos?: { image: string; label: string }[];
  extras?: string[];
  stack?: string[];
}

/** Respuesta completa de un proyecto individual del backend */
export interface ProjectData extends ProjectPayload {
  id: number;
  date: string;
}

/** Obtiene un proyecto por su ID */
export function getProject(id: number) {
  return apiFetch<ProjectData>(`/api/projects/${id}`);
}

/** Crea un nuevo proyecto enviando un POST a /api/projects */
export function createProject(data: ProjectPayload) {
  return apiFetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Actualiza un proyecto por ID con PATCH parcial */
export function updateProject(id: number, data: Partial<ProjectPayload>) {
  return apiFetch(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/** Cambia la visibilidad de múltiples proyectos */
export function updateVisibilityBatch(ids: number[], visible: boolean) {
  return apiFetch('/api/projects/visibility', {
    method: 'PATCH',
    body: JSON.stringify({ ids, visible }),
  });
}

/** Elimina múltiples proyectos en lote */
export async function deleteProjectsBatch(ids: number[]) {
  // Elimina proyectos en paralelo llamando a DELETE para cada ID
  const results = await Promise.all(
    ids.map((id) =>
      apiFetch(`/api/projects/${id}`, {
        method: 'DELETE',
      }),
    ),
  );
  return results;
}

// --- Upload de imágenes ---

export interface UploadedImage {
  ruta: string;
  label: string;
}

// --- Curriculum (Resume) ---

export interface ResumeApiResponse {
  [key: string]: unknown;
}

/** Obtiene el curriculum completo desde el backend */
export function getResume() {
  return apiFetch<ResumeData>('/api/resume');
}

/** Sobrescribe el curriculum completo en el backend */
export function updateResume(data: ResumeData) {
  return apiFetch('/api/resume', {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
}

/**
 * Sube archivos de imagen al backend.
 * Los guarda en public/images/portfolio/{design|web}/{category}/{slug}{NNN}.{ext}
 * Devuelve las rutas públicas de las imágenes guardadas.
 *
 * Nota: NO usa apiFetch porque el Content-Type es multipart/form-data
 * (lo gestiona el navegador automáticamente al enviar FormData).
 */
export async function uploadImages(
  files: File[],
  type: 'gd' | 'dev',
  category: string,
  title: string,
): Promise<UploadedImage[]> {
  const formData = new FormData();
  formData.append('type', type);
  formData.append('category', category);
  formData.append('title', title);
  files.forEach((file) => formData.append('images', file));

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
    // No establecer Content-Type: el navegador pone el boundary automáticamente
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error ?? 'Error al subir imágenes');
  }

  return json.data as UploadedImage[];
}

// --- Recent Works ---

export type { RecentWork } from '../interfaces/recentWorks';

/** Obtiene los trabajos recientes actuales */
export function getRecentWorks() {
  return apiFetch('/api/recent-works');
}

/** Actualiza los trabajos recientes */
export function updateRecentWorks(data: unknown) {
  return apiFetch('/api/recent-works', {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
}
