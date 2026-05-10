import UIButton from '../ui/UIButton';

interface DataActionBarProps {
  selectedCount: number;
  loading: boolean;
  error: string;
  onMarkHidden: () => void;
  onMarkVisible: () => void;
  onDelete: () => void;
  onCancel: () => void;
  dataId?: string;
  IconFallback?: React.FC<{ size?: number; color?: string }>;
  buildImagePath?: (filename: string) => string;
}

export default function DataActionBar({
  selectedCount,
  loading,
  error,
  onMarkHidden,
  onMarkVisible,
  onDelete,
  onCancel,
  dataId = 'data-action-bar',
}: DataActionBarProps) {
  return (
    <div
      className="flex items-center gap-3 mb-4 p-3 bg-[var(--color-bg-modal)] border rounded"
      data-id={dataId}
    >
      <span className="text-sm font-semibold">
        {selectedCount} {selectedCount === 1 ? 'proyecto seleccionado' : 'proyectos seleccionados'}
      </span>

      <UIButton
        onClick={onMarkHidden}
        disabled={loading}
        color="accent"
        dataId="data-mark-hidden-btn"
      >
        ○ Ocultos
      </UIButton>

      <UIButton
        onClick={onMarkVisible}
        disabled={loading}
        color="cta"
        dataId="data-mark-visible-btn"
      >
        ● Visibles
      </UIButton>

      <UIButton onClick={onDelete} disabled={loading} color="accent" dataId="data-delete-btn">
        Eliminar
      </UIButton>

      <div className="ml-auto">
        <UIButton onClick={onCancel} link dataId="data-cancel-selection-btn">
          Cancelar
        </UIButton>
      </div>

      {loading && <span className="text-xs text-muted">Guardando…</span>}
      {error && <span className="text-xs text-red-600">❌ {error}. ¿El backend está activo?</span>}
    </div>
  );
}
