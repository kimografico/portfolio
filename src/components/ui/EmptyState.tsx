/**
 * EmptyState
 * Componente de estado vacío/en preparación para mostrar cuando una sección no tiene contenido.
 * Muestra un emoji, título y descripción personalizable.
 */
interface EmptyStateProps {
  description: string;
  dataId?: string;
  emoji?: string; // Emoji a mostrar (por defecto 🚧)
}

export default function EmptyState({
  description,
  dataId = 'empty-state',
  emoji = '🚧',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center" data-id={dataId}>
      <p className="text-5xl mb-6" aria-hidden="true">
        {emoji}
      </p>
      <p className="text-lg font-semibold text-ink mb-2">Próximamente</p>
      <p className="text-sm text-muted max-w-sm">{description}</p>
    </div>
  );
}
