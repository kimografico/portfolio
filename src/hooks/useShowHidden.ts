import { useState } from 'react';

const STORAGE_KEY = 'kimo-show-hidden';

const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof localStorage !== 'undefined';

function getStoredShowHidden(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return localStorage.getItem(STORAGE_KEY) === 'true';
}

/**
 * Hook para gestionar la preferencia "mostrar proyectos ocultos".
 *
 * Persiste en localStorage para que el estado sobreviva entre navegaciones
 * y recargas de página. Al ser un hook, cualquier componente que lo use
 * leerá y escribirá en la misma clave, manteniéndose sincronizados.
 *
 * @returns [showHidden, setShowHidden]
 */
export function useShowHidden(): [boolean, (value: boolean) => void] {
  const [showHidden, setShowHiddenState] = useState<boolean>(getStoredShowHidden);

  function setShowHidden(value: boolean) {
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEY, String(value));
    }
    setShowHiddenState(value);
  }

  return [showHidden, setShowHidden];
}
