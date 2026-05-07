import type { ReactNode } from 'react';

interface UIButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  arrow?: boolean;
  dataId?: string;
}

/**
 * UIButton: Botón de acción reutilizable para enlaces.
 * Usa el estilo btn-outline por defecto, pero permite override de clase.
 */
export default function UIButton({
  href,
  children,
  className = '',
  arrow = false,
  dataId,
}: UIButtonProps) {
  return (
    <a href={href} className={`btn-outline group ${className}`} data-id={dataId}>
      {children}
      {arrow && (
        <span
          className="ml-2 inline-block align-middle transition-transform duration-150 group-hover:translate-x-2"
          aria-hidden="true"
        >
          →
        </span>
      )}
    </a>
  );
}
