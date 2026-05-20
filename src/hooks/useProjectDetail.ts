import { useNavigate } from 'react-router-dom';

/**
 * Resultado de la navegación de proyectos
 */
interface ProjectNavigation<T> {
  /** Proyecto actual (undefined si no existe) */
  project: T | undefined;
  /** Índice del proyecto actual en la lista */
  currentIndex: number;
  /** Proyecto anterior (undefined si no hay más) */
  prev: T | undefined;
  /** Proyecto siguiente (undefined si no hay más) */
  next: T | undefined;
  /** Si hay proyecto anterior habilitado */
  hasPrev: boolean;
  /** Si hay proyecto siguiente habilitado */
  hasNext: boolean;
  /** Navegar al proyecto anterior */
  goToPrev: () => void;
  /** Navegar al proyecto siguiente */
  goToNext: () => void;
  /** Volver a la lista de proyectos */
  goBack: () => void;
}

/**
 * Configuración de categoría para projectDataMap
 */
interface ProjectCategoryConfig<T> {
  data: T[];
  label: string;
}

/**
 * Opciones del hook useProjectDetail
 */
interface UseProjectDetailOptions<T extends { id: string | number }> {
  /** Mapeo de categoría → datos y etiqueta */
  projectDataMap: Record<string, ProjectCategoryConfig<T>>;
  /** Nombre del parámetro de ruta que contiene la categoría (ej: 'parent', 'category') */
  categoryParam: string | undefined;
  /** ID del proyecto de la URL */
  projectId: string | undefined;
  /** Ruta base para navegación (ej: '/dev' o '/graphic-design') */
  basePath: string;
}

/**
 * useProjectDetail
 *
 * Hook genérico que unifica la lógica de navegación y búsqueda de proyectos
 * entre las páginas de detalle (Developer, GraphicDesign).
 *
 * Abstrae:
 * - Validación de categoría contra el mapa de datos
 * - Búsqueda del proyecto por ID
 * - Cálculo de proyecto anterior/siguiente
 * - Funciones de navegación (prev, next, back)
 *
 * @example
 * ```tsx
 * const { project, goToPrev, goToNext, goBack, hasPrev, hasNext, category } =
 *   useProjectDetail({
 *     projectDataMap,
 *     categoryParam: parent,
 *     projectId: id,
 *     basePath: '/dev',
 *   });
 *
 * if (!category.isValid) {
 *   return <InvalidCategoryError />;
 * }
 * if (!project) {
 *   return <ProjectNotFoundError />;
 * }
 * ```
 */
export function useProjectDetail<T extends { id: string | number }>({
  projectDataMap,
  categoryParam,
  projectId,
  basePath,
}: UseProjectDetailOptions<T>): {
  /** Información de la categoría (validez, datos, etiqueta) */
  category: {
    isValid: boolean;
    key: string | undefined;
    data: T[];
    label: string;
  };
  /** Resultado de navegación entre proyectos */
  navigation: ProjectNavigation<T>;
} {
  const navigate = useNavigate();

  // Validar que categoryParam sea válido
  const categoryConfig =
    categoryParam && categoryParam in projectDataMap ? projectDataMap[categoryParam] : null;

  const isValidCategory = categoryConfig !== null;
  const projects = categoryConfig?.data ?? [];
  const label = categoryConfig?.label ?? '';

  // Encontrar el proyecto actual y sus vecinos
  const currentIndex = projects.findIndex((p) => p.id.toString() === projectId);
  const project = currentIndex !== -1 ? projects[currentIndex] : undefined;
  const prev = currentIndex > 0 ? projects[currentIndex - 1] : undefined;
  const next = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : undefined;

  // Funciones de navegación
  const goToPrev = () => {
    if (prev) {
      navigate(`${basePath}/${categoryParam}/${prev.id}`);
    }
  };

  const goToNext = () => {
    if (next) {
      navigate(`${basePath}/${categoryParam}/${next.id}`);
    }
  };

  const goBack = () => {
    navigate(`${basePath}/${categoryParam}`);
  };

  return {
    category: {
      isValid: isValidCategory,
      key: categoryParam,
      data: projects,
      label,
    },
    navigation: {
      project,
      currentIndex,
      prev,
      next,
      hasPrev: !!prev,
      hasNext: !!next,
      goToPrev,
      goToNext,
      goBack,
    },
  };
}
