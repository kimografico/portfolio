import { ProjectCard, type BaseProject } from '../ui/ProjectCard';
import CategoryHero from '../ui/CategoryHero';
import EmptyState from '../ui/EmptyState';
import type { IconProps } from '../../types/icons';
import type { ComponentType } from 'react';
import { useShowHidden } from '../../hooks/useShowHidden';

/*
 * CategoryGalleryPage
 *
 * Componente genérico para páginas de galería de proyectos.
 * Unifica el patrón repetido en GraphicDesignLogotipos, DeveloperWordpress, etc.
 *
 * Recibe los proyectos ya cargados desde el exterior, por lo que es agnóstico
 * del origen de datos y del tipo de proyecto (GraphicDesign, Developer...).
 *
 * ¿Por qué genérico con <T extends BaseProject>?
 * TypeScript necesita saber que los proyectos tienen al menos { id, date, title }.
 * El tipo genérico T permite que ProjectCard reciba el tipo exacto sin perder
 * información de tipado, aunque en runtime no cambia nada.
 */

interface CategoryGalleryPageProps<T extends BaseProject> {
  // --- Datos ---
  projects: T[]; // Array de proyectos a mostrar
  basePath: string; // Ruta base para construir el enlace de cada proyecto. Ej: "/graphic-design/logotipos"

  // --- CategoryHero ---
  title: string;
  description: string;
  icon?: ComponentType<{ size: number; strokeWidth: number; className: string }>; // Icono del hero (componente React, opcional)
  color?: string; // Color del overlay del hero
  opacity?: number; // Opacidad del overlay del hero
  backLink?: string; // Ruta del enlace de retroceso
  backLinkText?: string; // Texto del enlace de retroceso

  // --- ProjectCard ---
  IconFallback?: ComponentType<IconProps>; // Icono fallback para tarjetas sin imagen
  webProject?: boolean; // Si true, muestra barra de tecnologías (modo Developer)
  stackIconMap?: Record<string, ComponentType<IconProps>>; // Mapeo de tecnologías a iconos (solo necesario si webProject=true)
  widescreen?: boolean; // Si true, usa proporción 16:9 para el thumbnail. Si false, usa 4:3.
  // --- Construcción de rutas de imágenes ---
  buildImagePath?: (filename: string) => string; // Función opcional para construir rutas de imágenes completas
  // --- Mensajes ---
  emptyStateDescription?: string; // Texto del EmptyState cuando no hay proyectos

  // --- data-id ---
  dataIdPrefix?: string; // Prefijo para los atributos data-id de los elementos clave
}

export default function CategoryGalleryPage<T extends BaseProject>({
  projects,
  basePath,
  title,
  description,
  icon,
  color,
  opacity,
  backLink,
  backLinkText = 'Atrás',
  IconFallback,
  webProject = false,
  stackIconMap,
  widescreen = false,
  buildImagePath,
  emptyStateDescription = 'Esta sección está en preparación. Pronto encontrarás proyectos aquí.',
  dataIdPrefix = 'gallery',
}: CategoryGalleryPageProps<T>) {
  const [showHidden] = useShowHidden(); // Lee desde localStorage si el usuario quiere ver proyectos ocultos

  // Ordenar proyectos por fecha descendente (más nuevo primero) y filtrar según la preferencia de visibilidad
  const sortedProjects = [...projects]
    .filter((p) => showHidden || (p as BaseProject & { visible?: boolean }).visible !== false)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen flex flex-col" data-id={`${dataIdPrefix}-page`}>
      <CategoryHero
        title={title}
        description={description}
        icon={icon}
        color={color}
        opacity={opacity}
        dataId={`${dataIdPrefix}-hero`}
        backLink={backLink}
        backLinkText={backLinkText}
      />

      <section
        className="flex-1 max-w-7xl mx-auto w-full px-4 py-12"
        data-id={`${dataIdPrefix}-main`}
      >
        {sortedProjects.length === 0 ? (
          <EmptyState description={emptyStateDescription} dataId={`${dataIdPrefix}-empty`} />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            data-id={`${dataIdPrefix}-grid`}
          >
            {sortedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                to={`${basePath}/${project.id}`}
                dataId={`${dataIdPrefix}-card-${project.id}`}
                IconFallback={IconFallback}
                webProject={webProject}
                stackIconMap={stackIconMap}
                widescreen={widescreen}
                buildImagePath={buildImagePath}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
