import { useBackendStatus } from '../../contexts/BackendStatusContext';
import UIButton from './UIButton';
import { IconAddDB } from '../iconos/IconAddDB';

export default function BackendOfflineAlert() {
  const { alive, checking, check } = useBackendStatus();

  if (checking || alive) return null;

  return (
    <div
      className="rounded-xl p-4 mb-6"
      data-id="backend-offline-alert"
      style={{
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span aria-hidden className="inline-flex mr-2" style={{ color: 'var(--color-accent)' }}>
            <IconAddDB size={48} strokeWidth={1} />
          </span>
          <div className="text-sm">
            <p>
              <b>Backend no disponible</b>
            </p>
            Para hacer uso de las funcionalidades de administrador, levanta el backend con {' - '}
            <code className="font-mono font-bold"> pnpm run backend</code>
          </div>
        </div>
        <div>
          <UIButton onClick={() => check()} solid dataId="backend-offline-retry-btn">
            Reintentar
          </UIButton>
        </div>
      </div>
    </div>
  );
}
