import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/**
 * Store compartido a nivel de módulo.
 * Cuando cualquier instancia de useTheme() llama a toggle(),
 * TODAS las instancias se actualizan vía los listeners.
 * Sin esto, cada useState sería independiente y CategoryHero
 * no se enteraría del cambio hecho en MainHeader.
 */
const listeners = new Set<() => void>();

function getTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
  // Notificar a todos los hooks suscritos
  listeners.forEach((fn) => fn());
}

/**
 * Hook para gestionar el tema claro/oscuro.
 *
 * - Persiste la preferencia en localStorage.
 * - Aplica el atributo `data-theme` en el `<html>` para que las CSS variables
 *   de variables.css se activen automáticamente.
 * - Múltiples componentes pueden usar este hook y todos se sincronizan
 *   gracias al store compartido a nivel de módulo.
 */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(getTheme);

  useEffect(() => {
    // Aplicar tema al montar (por si localStorage ya tenía un valor)
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Suscribirse a cambios de otros componentes
    const handler = () => setTheme(getTheme());
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  function toggle() {
    const next = getTheme() === 'light' ? 'dark' : 'light';
    applyTheme(next);
  }

  return [theme, toggle];
}
