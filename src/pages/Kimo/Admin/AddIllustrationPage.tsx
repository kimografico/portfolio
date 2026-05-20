import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from 'react';
import ImageDropZone from '../../../components/compositions/ImageDropZone';
import UIButton from '../../../components/ui/UIButton';
import BackendOfflineAlert from '../../../components/ui/BackendOfflineAlert';
import FormStatusAlert from '../../../components/ui/FormStatusAlert';
import {
  createKimoIllustration,
  uploadKimoImages,
  type KimoIllustrationPayload,
} from '../../../api/apiClient';
import { APP_BASENAME } from '../../../data/config/app';
import { useBackendStatus } from '../../../contexts/BackendStatusContext';

interface IllustrationFormState {
  nombre: string;
  fecha: string;
  cliente: string;
  descripcion: string;
}

interface IllustrationImageState {
  label: string;
  file: File | null;
  image: string;
}

const initialForm: IllustrationFormState = {
  nombre: '',
  fecha: '',
  cliente: '',
  descripcion: '',
};

const emptyImage = (): IllustrationImageState => ({ label: '', file: null, image: '' });

function hasBlobPreview(value: string): boolean {
  return value.startsWith('blob:');
}

function getStoredImageName(value: string): string {
  const trimmed = value.trim();
  if (trimmed === '') {
    return '';
  }

  const normalized = trimmed.split('?')[0].split('#')[0];
  const parts = normalized.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? '';
}

export default function AddIllustrationPage() {
  const { alive } = useBackendStatus();
  const [form, setForm] = useState<IllustrationFormState>(initialForm);
  const [images, setImages] = useState<IllustrationImageState[]>([emptyImage()]);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [createdId, setCreatedId] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const activePreviews = previewUrlsRef.current;

    return () => {
      activePreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      activePreviews.clear();
    };
  }, []);

  function registerPreview(url: string): string {
    if (hasBlobPreview(url)) {
      previewUrlsRef.current.add(url);
    }

    return url;
  }

  function releasePreview(url: string) {
    if (!hasBlobPreview(url)) {
      return;
    }

    URL.revokeObjectURL(url);
    previewUrlsRef.current.delete(url);
  }

  function clearImageErrors() {
    setImgErrors({});
  }

  function clearPreviews(items: IllustrationImageState[]) {
    items.forEach((item) => {
      if (item.image) {
        releasePreview(item.image);
      }
    });
  }

  if (!alive) {
    return (
      <section className="flex flex-col gap-8" data-id="add-illustration-page">
        <BackendOfflineAlert />
      </section>
    );
  }

  function handleField<K extends keyof IllustrationFormState>(
    key: K,
    value: IllustrationFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(value: string) {
    setForm((prev) => ({ ...prev, nombre: value }));
  }

  function appendImageFiles(files: File[]) {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      return;
    }

    setImages((prev) => {
      const next = [...prev];
      const firstItemIsEmpty =
        next.length === 1 && next[0]?.file === null && next[0]?.image.trim() === '';

      if (firstItemIsEmpty) {
        const [firstFile, ...restFiles] = imageFiles;
        if (firstFile) {
          next[0] = {
            label: '',
            file: firstFile,
            image: registerPreview(URL.createObjectURL(firstFile)),
          };
        }

        restFiles.forEach((file) => {
          next.push({ label: '', file, image: registerPreview(URL.createObjectURL(file)) });
        });

        return next;
      }

      imageFiles.forEach((file) => {
        next.push({ label: '', file, image: registerPreview(URL.createObjectURL(file)) });
      });

      return next;
    });

    clearImageErrors();
  }

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    appendImageFiles(Array.from(event.target.files ?? []));
    event.target.value = '';
  }

  function handleDropZoneDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  function handleDropZoneDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    appendImageFiles(Array.from(event.dataTransfer.files));
  }

  function handleImageChange(index: number, field: 'image' | 'label', value: string) {
    setImages((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        if (field === 'label') {
          return { ...item, label: value };
        }

        if (item.image && hasBlobPreview(item.image) && item.image !== value) {
          releasePreview(item.image);
        }

        return {
          ...item,
          file: null,
          image: value,
        };
      }),
    );

    setImgErrors((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  }

  function addImage() {
    setImages((prev) => [...prev, emptyImage()]);
    clearImageErrors();
  }

  function moveImage(fromIndex: number, toIndex: number) {
    setImages((prev) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex >= prev.length
      ) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });

    clearImageErrors();
  }

  function handleImageDragStart(index: number) {
    setDragIndex(index);
  }

  function handleImageDragOver(event: DragEvent<HTMLDivElement>, index: number) {
    event.preventDefault();
    setDragOverIndex(index);
  }

  function handleImageDrop(index: number) {
    if (dragIndex !== null) {
      moveImage(dragIndex, index);
    }

    setDragIndex(null);
    setDragOverIndex(null);
  }

  function handleImageDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const item = prev[index];
      if (item?.image) {
        releasePreview(item.image);
      }

      return prev.filter((_, i) => i !== index);
    });
    setDragIndex(null);
    setDragOverIndex(null);
    clearImageErrors();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      if (!form.nombre.trim()) {
        throw new Error('El nombre es obligatorio');
      }

      const mainImage = images[0];
      if (!mainImage || (!mainImage.file && mainImage.image.trim() === '')) {
        throw new Error('La primera imagen es obligatoria y será la imagen principal');
      }

      const fileImages = images
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.file !== null)
        .map(({ item }) => item.file as File);

      const uploaded = fileImages.length
        ? await uploadKimoImages(fileImages, 'illustrations', form.nombre.trim())
        : [];

      let uploadIndex = 0;
      const resolvedImages = images
        .map((item, index) => {
          if (item.file) {
            const uploadedItem = uploaded[uploadIndex];
            uploadIndex += 1;

            return {
              image: getStoredImageName(uploadedItem?.ruta ?? ''),
              label: item.label.trim(),
            };
          }

          if (index === 0) {
            return {
              image: getStoredImageName(item.image),
              label: item.label.trim(),
            };
          }

          return item.image.trim() === ''
            ? null
            : {
                image: getStoredImageName(item.image),
                label: item.label.trim(),
              };
        })
        .filter((entry): entry is { image: string; label: string } => entry !== null)
        .filter((entry) => entry.image.trim() !== '');

      const payload: KimoIllustrationPayload = {
        nombre: form.nombre.trim(),
        image: resolvedImages[0]?.image ?? '',
        fecha: form.fecha.trim(),
        cliente: form.cliente.trim(),
        descripcion: form.descripcion.trim(),
        imagenesExtra: resolvedImages.slice(1),
      };

      const result = await createKimoIllustration(payload);
      const created = result.data as { id?: string } | undefined;

      setCreatedId(created?.id ?? '');
      setStatus('success');
      setForm(initialForm);
      clearPreviews(images);
      setImages([emptyImage()]);
      setImgErrors({});
      setDragIndex(null);
      setDragOverIndex(null);
    } catch (error) {
      setStatus('error');
      setErrorMsg(error instanceof Error ? error.message : 'Error al crear la ilustración');
    }
  }

  return (
    <section className="flex flex-col gap-8" data-id="add-illustration-page">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Añadir ilustración</h2>
          <p className="text-sm text-muted">
            Se guarda en illustrations.json y la primera imagen de la lista será la principal.
          </p>
        </div>
        <UIButton
          href={`${APP_BASENAME}/kimo/ilustraciones`}
          arrowBack
          link
          dataId="add-illustration-back-btn"
        >
          Volver a Ilustraciones
        </UIButton>
      </div>

      {status === 'success' && (
        <FormStatusAlert variant="success" dataId="add-illustration-success">
          Ilustración creada correctamente {createdId ? `(${createdId})` : ''}
        </FormStatusAlert>
      )}

      {status === 'error' && (
        <FormStatusAlert variant="error" dataId="add-illustration-error">
          {errorMsg}
        </FormStatusAlert>
      )}

      <form
        className="grid gap-6 rounded-2xl border border-border bg-surface p-6"
        onSubmit={handleSubmit}
        data-id="add-illustration-form"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-ink">
            Nombre *
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={form.nombre}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              data-id="add-illustration-name"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Fecha
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={form.fecha}
              onChange={(e) => handleField('fecha', e.target.value)}
              placeholder="YYYY-MM o fecha libre"
              data-id="add-illustration-date"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Cliente
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={form.cliente}
              onChange={(e) => handleField('cliente', e.target.value)}
              data-id="add-illustration-client"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Descripción
          <textarea
            className="min-h-32 rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            value={form.descripcion}
            onChange={(e) => handleField('descripcion', e.target.value)}
            data-id="add-illustration-description"
          />
        </label>

        <div className="grid gap-4 rounded-xl border border-border bg-bg p-4">
          <ImageDropZone
            images={images.map((item) => ({ image: item.image, label: item.label }))}
            imgErrors={imgErrors}
            dragIndex={dragIndex}
            dragOverIndex={dragOverIndex}
            fileInputRef={fileInputRef}
            onSelectFilesClick={() => fileInputRef.current?.click()}
            onAddImage={addImage}
            onFileSelect={handleFileSelect}
            onDropZoneDragOver={handleDropZoneDragOver}
            onDropZoneDrop={handleDropZoneDrop}
            onImageDragStart={handleImageDragStart}
            onImageDragOver={handleImageDragOver}
            onImageDrop={handleImageDrop}
            onImageDragEnd={handleImageDragEnd}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
            onImageError={(index) => setImgErrors((prev) => ({ ...prev, [index]: true }))}
          />
        </div>

        <div className="flex items-center gap-4">
          <UIButton
            type="submit"
            saveBtn
            disabled={status === 'loading'}
            dataId="add-illustration-save-btn"
          >
            {status === 'loading' ? 'Guardando…' : 'Añadir ilustración'}
          </UIButton>
        </div>
      </form>
    </section>
  );
}
