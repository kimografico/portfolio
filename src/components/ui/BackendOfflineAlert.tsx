import { useBackendStatus } from '../../contexts/BackendStatusContext';
import UIButton from './UIButton';
import { IconServerDown } from '../iconos/IconServerDown';
import { IconRefresh } from '../iconos';

export default function BackendOfflineAlert() {
  const { alive, checking, check } = useBackendStatus();

  if (checking || alive) return null;

  return (
    <div
      className="rounded-xl p-4 mb-6"
      data-id="backend-offline-alert"
      style={{
        border: '1px solid var(--color-accent)',
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <span
            aria-hidden
            className="inline-flex mb-2 md:mr-2"
            style={{ color: 'var(--color-accent)' }}
          >
            <IconServerDown size={48} strokeWidth={1} />
          </span>
          <div className="text-sm">
            <p>
              <b>Backend no disponible</b>
            </p>
            Para hacer uso de las funcionalidades de administrador, levanta el backend con {' - '}
            <code className="font-mono font-bold"> pnpm run backend</code>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <UIButton
            onClick={() => check()}
            solid
            icon={<IconRefresh size={24} />}
            dataId="backend-offline-retry-btn"
            mobileFullWidth
          >
            Reintentar
          </UIButton>
        </div>
      </div>
    </div>
  );
}
