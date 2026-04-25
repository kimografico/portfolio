interface ProjectLineProps {
  num: string;
  title: string;
  tipo: string;
  year: string;
  href: string;
  animationDelay?: string;
}

/**
 * ProjectLine: Renderiza una línea de proyecto para la lista de proyectos recientes.
 * Extraído de RecentProjectsSection para máxima reutilización y claridad.
 * Cumple buenas prácticas de accesibilidad y clean code.
 */
export default function ProjectLine({
  num,
  title,
  tipo,
  year,
  href,
  animationDelay = '0ms',
}: ProjectLineProps) {
  return (
    <a
      href={href}
      className="group flex items-center gap-6 py-5 hover:pl-1 transition-all duration-200"
      style={{ animationDelay }}
    >
      <span className="font-mono text-xs text-muted w-6 shrink-0 group-hover:text-ink transition-colors duration-150">
        {num}
      </span>
      <span className="flex-1 text-base font-medium text-ink tracking-tight group-hover:text-accent transition-colors duration-150">
        {title}
      </span>
      <span className="hidden sm:block text-sm text-muted group-hover:text-ink transition-colors duration-150">
        {tipo}
      </span>
      <span className="font-mono text-xs text-muted">{year}</span>
      <span
        className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-150"
        aria-hidden="true"
      >
        →
      </span>
    </a>
  );
}
