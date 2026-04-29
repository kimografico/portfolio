import { useState } from 'react';

const STORAGE_KEY = 'kimo-show-hidden';

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
  const [showHidden, setShowHiddenState] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === 'true',
  );

  function setShowHidden(value: boolean) {
    localStorage.setItem(STORAGE_KEY, String(value));
    setShowHiddenState(value);
  }

  return [showHidden, setShowHidden];
}
