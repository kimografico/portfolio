import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { IconProps } from '../../types/icons';

/**
 * Propiedades mínimas requeridas para un proyecto en ProjectCard
 * Agnóstico de la fuente (web, diseño gráfico, etc.)
 */
export interface BaseProject {
  id: number | string;
  date: string;
  title: string;
  cliente?: string;
  imagenes?: Array<{ image: string; label?: string }>;
  stack?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Permite propiedades adicionales tipadas dinámicamente
}

interface ProjectCardProps<T extends BaseProject> {
  /** Proyecto a renderizar (tipo genérico) */
  project: T;
  /** Ruta a la que navegar al hacer clic */
  to: string;
  /** Mapeo de tecnologías a componentes de icono */
  stackIconMap?: Record<string, React.FC<IconProps>>;
  /** Si true, muestra la barra de iconos de stack + hover label. Por defecto false. */
  webProject?: boolean;
  /** ID para atributos data-id (tests/debugging) */
  dataId?: string;
  /** Componente de icono fallback */
  IconFallback?: React.FC<IconProps>;
  /** Si true, el thumbnail usa proporción 16:9. Si false (default), usa 4:3 */
  widescreen?: boolean;
  /** Función opcional para construir la ruta completa de la imagen (ej: buildGraphicDesignImagePath) */
  buildImagePath?: (filename: string) => string;
}

/**
 * ProjectCard
 * Tarjeta reutilizable y agnóstica para mostrar un proyecto (Web, Diseño Gráfico, etc.)
 * Puede mostrar u ocultar la barra de tecnologías según la prop `webProject`.
 *
 * @template T - Tipo del proyecto (debe extender BaseProject)
 * @param project - Datos del proyecto
 * @param to - Ruta de navegación
 * @param stackIconMap - Mapeo opcional de tecnologías a iconos
 * @param webProject - Si true, muestra la barra de iconos. Por defecto false
 * @param dataId - Identificador para tests/debugging
 * @param IconFallback - Icono fallback a usar si la tecnología no está en el mapeo
 */
export const ProjectCard = <T extends BaseProject>({
  project,
  to,
  stackIconMap,
  webProject = false,
  dataId = `project-card-${project.id}`,
  IconFallback,
  widescreen = false,
  buildImagePath,
}: ProjectCardProps<T>) => {
  // Lógica robusta de miniatura:
  // 1. Intenta cargar la miniatura generada (thumbs/${id}.jpg)
  // 2. Si falla, usa la imagen original del proyecto
  // 3. Si también falla, usa un fallback genérico
  // El estado local controla el src actual

  const thumbUrl = `/portfolio/images/portfolio/thumbs/${project.id}.jpg`;
  const originalImage =
    buildImagePath && project.imagenes?.[0]?.image
      ? buildImagePath(project.imagenes[0].image)
      : project.imagenes?.[0]?.image || '';
  const fallbackImage = '/portfolio/images/portfolio/no-cover.jpg';

  const [imgSrc, setImgSrc] = useState<string>(thumbUrl);
  const [triedOriginal, setTriedOriginal] = useState(false);

  const handleImgError = () => {
    if (!triedOriginal && originalImage && imgSrc !== originalImage) {
      setImgSrc(originalImage);
      setTriedOriginal(true);
    } else if (imgSrc !== fallbackImage) {
      setImgSrc(fallbackImage);
    }
  };

  const year = project.date?.slice(0, 4);

  return (
    <Link
      to={to}
      className="group flex flex-col bg-surface rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
      data-id={dataId}
      tabIndex={0}
      data-id-link={dataId}
    >
      {/* Thumbnail */}
      <div
        className={`overflow-hidden flex items-center justify-center bg-gray-100 ${
          widescreen ? 'aspect-video' : 'aspect-[4/3]'
        }`}
      >
        <img
          src={imgSrc}
          alt={project.title}
          className="object-cover w-full h-full group-hover:scale-125 transition-transform"
          loading="lazy"
          onError={handleImgError}
          data-id={`${dataId}-thumb`}
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1" data-id={`${dataId}-info`}>
        <h2 className="text-sm font-semibold text-ink group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          {project.title}
        </h2>

        {/* Cliente y año (solo si existen) */}
        {(project.cliente || year) && (
          <p className="text-xs text-muted">
            {project.cliente} {project.cliente && year ? '·' : ''} {year}
          </p>
        )}

        {/* Stack icons - Solo si webProject es true y stackIconMap existe */}
        {webProject && project.stack && stackIconMap && IconFallback && (
          <div className="flex flex-row gap-2 mt-1 items-center" data-id={`${dataId}-stack`}>
            {project.stack.map((tech) => {
              const key = tech.trim().toUpperCase();
              const Icon = stackIconMap[key] || IconFallback;
              return (
                <span key={tech} className="inline-block align-middle" aria-hidden="true">
                  <Icon size={28} className="text-muted hover:text-ink transition-colors" />
                </span>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
};
