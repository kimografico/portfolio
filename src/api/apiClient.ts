/**
 * Cliente HTTP para la API backend local.
 * Centraliza la base URL y el manejo de errores para todas las llamadas a la API.
 */

export const API_BASE = 'http://localhost:3001';

import type { ResumeData } from '../interfaces/resume';
import { isKimoAuthenticated } from '../utils/kimoAuth';

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
  const authHeaders = isKimoAuthenticated()
    ? { Authorization: `Bearer ${import.meta.env.VITE_KIMO_PASSWORD_HASH?.trim() ?? ''}` }
    : {};

  const headers = new Headers({ 'Content-Type': 'application/json' });
  Object.entries(authHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  const optionHeaders = new Headers(options.headers);
  optionHeaders.forEach((value, key) => {
    headers.set(key, value);
  });

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      // Try to parse JSON error body, fall back to statusText
      try {
        const errJson = await res.json();
        const errMsg = (errJson && (errJson.error || errJson.message)) || res.statusText;
        throw new Error(String(errMsg || `HTTP ${res.status}`));
      } catch {
        throw new Error(res.statusText || `HTTP ${res.status}`);
      }
    }

    const json: ApiResponse<T> = await res.json();

    if (!json.success) {
      throw new Error(json.error ?? 'Error desconocido');
    }

    return json;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const lower = message.toLowerCase();
    if (
      lower.includes('failed to fetch') ||
      lower.includes('networkrequestfailed') ||
      lower.includes('network error') ||
      lower.includes('fetch')
    ) {
      throw new Error('No se pudo conectar con el backend. Arranca el backend con: pnpm backend');
    }
    throw err;
  }
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

export type KimoUploadCollection = 'books' | 'illustrations';

export interface KimoBookPayload {
  id?: string;
  title: string;
  author: string;
  language: string;
  cover: string;
  dateRead: string;
  genre: string;
  isbn: string;
  series: string;
  synopsis: string;
}

export interface KimoIllustrationPayload {
  id?: string;
  nombre: string;
  image: string;
  fecha: string;
  cliente: string;
  descripcion: string;
  imagenesExtra: Array<{ image: string; label: string }>;
}

export interface KimoPlacePayload {
  city: string;
  place: string;
  country: string;
  date: string;
  people: string;
}

export interface KimoPlaceMarkerPayload {
  name: string;
  country: string;
  lat: number;
  lon: number;
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
    headers: isKimoAuthenticated()
      ? { Authorization: `Bearer ${import.meta.env.VITE_KIMO_PASSWORD_HASH?.trim() ?? ''}` }
      : undefined,
    body: formData,
    // No establecer Content-Type: el navegador pone el boundary automáticamente
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error ?? 'Error al subir imágenes');
  }

  return json.data as UploadedImage[];
}

/**
 * Sube imágenes para los formularios de Kimo (libros e ilustraciones).
 */
export async function uploadKimoImages(
  files: File[],
  collection: KimoUploadCollection,
  title: string,
): Promise<UploadedImage[]> {
  const formData = new FormData();
  formData.append('collection', collection);
  formData.append('title', title);
  files.forEach((file) => formData.append('images', file));

  const res = await fetch(`${API_BASE}/api/kimo/upload`, {
    method: 'POST',
    headers: isKimoAuthenticated()
      ? { Authorization: `Bearer ${import.meta.env.VITE_KIMO_PASSWORD_HASH?.trim() ?? ''}` }
      : undefined,
    body: formData,
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error ?? 'Error al subir imágenes');
  }

  return json.data as UploadedImage[];
}

export function createKimoBook(data: KimoBookPayload) {
  return apiFetch('/api/kimo/books', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function createKimoIllustration(data: KimoIllustrationPayload) {
  return apiFetch('/api/kimo/illustrations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function createKimoPlace(data: KimoPlacePayload) {
  return apiFetch('/api/kimo/places', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function createKimoPlaceMarker(data: KimoPlaceMarkerPayload) {
  return apiFetch('/api/kimo/places-markers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// --- Carrusel home ---

export interface CarouselImageItem {
  src: string;
  alt: string;
}

/** Obtiene la lista de imágenes del carrusel desde el backend */
export function getCarousel() {
  return apiFetch<CarouselImageItem[]>('/api/carousel');
}

/** Sobrescribe la lista de imágenes del carrusel */
export function updateCarousel(data: CarouselImageItem[]) {
  return apiFetch('/api/carousel', {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
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
