/**
 * useCarousel
 *
 * Hook que encapsula toda la lógica de datos del carrusel de la home:
 * carga inicial desde la API y guardado de cambios.
 *
 * Separar esta lógica del componente `CarouselManager` tiene varias ventajas:
 * - El componente solo se ocupa de renderizar (separación de concerns).
 * - El hook es testeable en aislamiento, sin montar JSX.
 * - Storybook puede inyectar `initialImages` y saltarse la llamada al backend.
 * - Si en el futuro se necesita compartir el estado del carrusel entre varios
 *   componentes, el hook centraliza la fuente de verdad.
 *
 * @param initialImages - Si se proporciona, el hook usa estos datos como estado
 *   inicial y NO hace fetch al montar. Útil para Storybook y tests.
 */

import { useEffect, useState } from 'react';
import { getCarousel, updateCarousel, type CarouselImageItem } from '../api/apiClient';

export type CarouselStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

/**
 * Formato de imagen para el componente (UI).
 * Estructuralmente idéntico a ProjectImageItem de ImageDropZone.
 */
export type CarouselUiItem = { image: string; label: string };

export interface UseCarouselReturn {
  /** Imágenes en formato UI ({ image, label }), listas para usar en ImageDropZone */
  images: CarouselUiItem[];
  setImages: React.Dispatch<React.SetStateAction<CarouselUiItem[]>>;
  status: CarouselStatus;
  errorMsg: string;
  /** Guarda los items dados. Los convierte a formato API internamente. */
  save: (items: CarouselUiItem[]) => Promise<void>;
}

function toUi(items: CarouselImageItem[]): CarouselUiItem[] {
  return items.map((i) => ({ image: i.src, label: i.alt }));
}

function toApi(items: CarouselUiItem[]): CarouselImageItem[] {
  return items.map((i) => ({ src: i.image, alt: i.label }));
}

export function useCarousel(initialImages?: CarouselImageItem[]): UseCarouselReturn {
  // Convertimos al formato UI desde el inicio para que el componente no necesite hacerlo
  const [images, setImages] = useState<CarouselUiItem[]>(() =>
    initialImages !== undefined ? toUi(initialImages) : [],
  );
  const [status, setStatus] = useState<CarouselStatus>(
    initialImages !== undefined ? 'idle' : 'loading',
  );
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialImages !== undefined) return;

    let cancelled = false;

    async function load() {
      setStatus('loading');
      try {
        const result = await getCarousel();
        if (!cancelled) {
          // setState dentro de una función async anidada: no es síncrono en el body
          // del efecto, por lo que el linter no lo prohíbe.
          setImages(toUi(result.data ?? []));
          setStatus('idle');
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setErrorMsg(err instanceof Error ? err.message : 'Error al cargar el carrusel');
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
    // initialImages no cambia en runtime; se excluye del dep array intencionadamente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save(items: CarouselUiItem[]) {
    setStatus('saving');
    setErrorMsg('');
    try {
      await updateCarousel(toApi(items));
      setImages(items);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error al guardar');
    }
  }

  return { images, setImages, status, errorMsg, save };
}
