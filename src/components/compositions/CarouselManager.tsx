/**
 * CarouselManager
 *
 * Panel de administración para gestionar las imágenes del carrusel de la home.
 *
 * Arquitectura:
 * - `useCarousel` (hook) gestiona toda la comunicación con el backend (fetch/save)
 *   y expone los datos en formato API ({ src, alt }).
 * - `CarouselManager` (este componente) gestiona el estado visual local en formato
 *   ImageDropZone ({ image, label }) y coordina edición, reordenación y borrado.
 *
 * Prop `initialImages`:
 * - Si se pasa, el hook arranca con esos datos y NO hace ninguna llamada al backend.
 * - Esto permite usar el componente en Storybook y tests sin necesidad de mockear fetch.
 *
 * Conversión de URLs:
 * - Si el usuario pega una URL absoluta (ej. http://localhost:5173/portfolio/images/...),
 *   se extrae automáticamente el pathname para almacenar solo la ruta relativa.
 */

import { useRef, useState, type ChangeEventHandler } from 'react';
import ImageDropZone, { type ProjectImageItem } from './ImageDropZone';
import UIButton from '../ui/UIButton';
import { useCarousel } from '../../hooks/useCarousel';
import type { CarouselImageItem } from '../../api/apiClient';

interface CarouselManagerProps {
  /**
   * Datos iniciales opcionales (formato API { src, alt }).
   * Si se pasan, el hook los convierte a formato UI y no hace fetch al backend.
   * Útil para Storybook y tests.
   */
  initialImages?: CarouselImageItem[];
}

/** Extrae el pathname de una URL absoluta; devuelve el valor original si ya es relativa. */
function toRelativePath(value: string): string {
  try {
    const url = new URL(value);
    if (url.protocol === 'http:' || url.protocol === 'https:') return url.pathname;
    return value;
  } catch {
    return value;
  }
}

export default function CarouselManager({ initialImages }: CarouselManagerProps = {}) {
  // useCarousel convierte internamente: API ({ src, alt }) ↔ UI ({ image, label }).
  // El componente solo trabaja con el formato UI; sin conversiones ni sync effects.
  const { images, setImages, status, errorMsg, save } = useCarousel(initialImages);

  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // fileInputRef obligatorio en ImageDropZone aunque en modo minimalistic no se use
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // save() recibe los items directamente para evitar condición de carrera con setState
  async function handleSave() {
    await save(images);
  }

  // --- Handlers de ImageDropZone ---

  function handleAddImage() {
    setImages((prev) => [...prev, { image: '', label: '' }]);
  }

  function handleImageChange(index: number, field: 'image' | 'label', value: string) {
    setImages((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: field === 'image' ? toRelativePath(value) : value };
      return next;
    });
    if (field === 'image') setImgErrors((prev) => ({ ...prev, [index]: false }));
  }

  function handleRemoveImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImgErrors((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  }

  function handleImageError(index: number) {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  }

  function handleImageDragStart(index: number) {
    setDragIndex(index);
  }

  function handleImageDragOver(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function handleImageDrop(index: number) {
    if (dragIndex === null || dragIndex === index) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function handleImageDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function noop() {}
  function noopEvent(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  const isSaving = status === 'saving';
  const isLoading = status === 'loading';

  return (
    <section data-id="carousel-manager" className="mt-12">
      <h2 className="text-xl font-semibold mb-6">Administrar carrusel</h2>

      {isLoading && <p className="text-sm text-muted">Cargando imágenes del carrusel…</p>}

      {!isLoading && (
        <ImageDropZone
          images={images as ProjectImageItem[]}
          imgErrors={imgErrors}
          dragIndex={dragIndex}
          dragOverIndex={dragOverIndex}
          minimalistic
          fileInputRef={fileInputRef}
          onSelectFilesClick={noop}
          onAddImage={handleAddImage}
          onFileSelect={noop as ChangeEventHandler<HTMLInputElement>}
          onDropZoneDragOver={noopEvent}
          onDropZoneDrop={noopEvent}
          onImageDragStart={handleImageDragStart}
          onImageDragOver={handleImageDragOver}
          onImageDrop={handleImageDrop}
          onImageDragEnd={handleImageDragEnd}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
          onImageError={handleImageError}
        />
      )}

      <div className="flex gap-4 mt-6">
        <UIButton
          saveBtn
          onClick={handleSave}
          disabled={isSaving || isLoading}
          data-id="carousel-save-btn"
        >
          {isSaving ? 'Guardando…' : 'Guardar cambios en Carrusel'}
        </UIButton>
        <div className="text-xs text-muted flex items-center">
          Total: {images.length} imagen(es)
        </div>
      </div>

      {status === 'saved' && (
        <p className="mt-3 text-sm text-green-600 font-semibold">
          ✓ Carrusel guardado correctamente. Los cambios se verán en la home al recargar.
        </p>
      )}
      {status === 'error' && errorMsg && (
        <p className="mt-3 text-sm text-red-500">Error: {errorMsg}</p>
      )}
    </section>
  );
}
