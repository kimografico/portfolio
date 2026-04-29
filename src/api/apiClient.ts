/**
 * Cliente HTTP para la API backend local.
 * Centraliza la base URL y el manejo de errores para todas las llamadas a la API.
 */

export const API_BASE = 'http://localhost:3001';

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
  imagenes?: { ruta: string; label: string }[];
  videos?: string[];
  extras?: string[];
  stack?: string[];
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
