import type { ChangeEvent, DragEvent, RefObject } from 'react';

import { IconImage } from '../iconos/IconImage';

export type ProjectImageItem = {
  image: string;
  label: string;
};

type ImageDropZoneProps = {
  images: ProjectImageItem[];
  imgErrors: Record<number, boolean>;
  dragIndex: number | null;
  dragOverIndex: number | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onSelectFilesClick: () => void;
  onAddImage: () => void;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  onDropZoneDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDropZoneDrop: (e: DragEvent<HTMLDivElement>) => void;
  onImageDragStart: (index: number) => void;
  onImageDragOver: (e: DragEvent<HTMLDivElement>, index: number) => void;
  onImageDrop: (index: number) => void;
  onImageDragEnd: () => void;
  onImageChange: (index: number, field: 'image' | 'label', value: string) => void;
  onRemoveImage: (index: number) => void;
  onImageError: (index: number) => void;
};

export default function ImageDropZone({
  images,
  imgErrors,
  dragIndex,
  dragOverIndex,
  fileInputRef,
  onSelectFilesClick,
  onAddImage,
  onFileSelect,
  onDropZoneDragOver,
  onDropZoneDrop,
  onImageDragStart,
  onImageDragOver,
  onImageDrop,
  onImageDragEnd,
  onImageChange,
  onRemoveImage,
  onImageError,
}: ImageDropZoneProps) {
  return (
    <div data-id="add-project-images">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-muted">Imágenes</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onSelectFilesClick}
            className="text-xs text-accent hover:underline"
            data-id="add-project-select-files-btn"
          >
            📁 Seleccionar archivos
          </button>
          <button
            type="button"
            onClick={onAddImage}
            className="text-xs text-accent hover:underline"
            data-id="add-project-add-image-btn"
          >
            + Añadir URL
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        data-id="add-project-file-input"
        onChange={onFileSelect}
      />

      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3 text-center text-sm text-muted hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer min-h-48"
        onDragOver={onDropZoneDragOver}
        onDrop={onDropZoneDrop}
        onClick={onSelectFilesClick}
        data-id="add-project-dropzone"
      >
        Arrastra imágenes aquí o haz clic para seleccionar
      </div>

      <div className="space-y-2">
        {images.map((img, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => onImageDragStart(i)}
            onDragOver={(e) => onImageDragOver(e, i)}
            onDrop={(e) => {
              e.preventDefault();
              onImageDrop(i);
            }}
            onDragEnd={onImageDragEnd}
            className={`flex gap-3 items-center p-2 rounded border transition-all ${
              dragOverIndex === i ? 'border-accent bg-accent/5' : 'border-gray-200'
            } ${dragIndex === i ? 'opacity-40' : ''}`}
          >
            <span
              className="cursor-grab active:cursor-grabbing text-muted select-none text-lg"
              title="Arrastra para reordenar"
            >
              ⠿
            </span>

            <div
              className="w-16 h-12 rounded overflow-hidden flex-shrink-0 border"
              style={{ background: 'var(--color-bg-btn)', borderColor: 'var(--color-border)' }}
              data-id="new-image-thumb"
            >
              {img.image && !imgErrors[i] ? (
                <img
                  src={img.image}
                  alt={img.label || `Imagen ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => onImageError(i)}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-lg"
                  style={{ color: 'var(--color-text-btn)' }}
                >
                  <IconImage aria-label="Sin imagen" className="w-7 h-7" />
                </div>
              )}
            </div>

            <div className="flex-1 flex gap-2">
              <input
                type="text"
                data-id={`add-project-image-url-${i}`}
                className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="URL de la imagen"
                value={img.image}
                onChange={(e) => onImageChange(i, 'image', e.target.value)}
              />
              <input
                type="text"
                data-id={`add-project-image-label-${i}`}
                className="w-36 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Etiqueta"
                value={img.label}
                onChange={(e) => onImageChange(i, 'label', e.target.value)}
              />
            </div>

            <span className="text-xs text-muted w-5 text-center">{i + 1}</span>
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveImage(i)}
                data-id={`add-project-remove-image-btn-${i}`}
                className="text-muted hover:text-red-500 transition-colors text-lg leading-none"
                aria-label="Eliminar imagen"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
