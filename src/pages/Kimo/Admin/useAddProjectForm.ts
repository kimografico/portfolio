import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, Dispatch, FormEvent, RefObject, SetStateAction } from 'react';
import { createProject, uploadImages } from '../../../api/apiClient';
import {
  addMediaItem,
  addUniqueStringValue,
  createEmptyImage,
  createEmptyVideo,
  createInitialForm,
  filterNonEmptyMediaItems,
  filterNonEmptyStrings,
  removeItemAtIndex,
  reorderItems,
  toggleStringValue,
  updateMediaItem,
  type AddProjectFormState,
} from './addProjectFormHelpers';

export interface UseAddProjectFormResult {
  form: AddProjectFormState;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMsg: string;
  createdId: number | null;
  dragIndex: number | null;
  dragOverIndex: number | null;
  imgErrors: Record<number, boolean>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  setImgErrors: Dispatch<SetStateAction<Record<number, boolean>>>;
  handleField: <K extends keyof AddProjectFormState>(key: K, value: AddProjectFormState[K]) => void;
  handleTypeChange: (type: '' | 'gd' | 'dev') => void;
  handleImagenChange: (index: number, field: 'image' | 'label', value: string) => void;
  addImagen: () => void;
  removeImagen: (index: number) => void;
  handleImgDragStart: (index: number) => void;
  handleImgDragOver: (e: DragEvent, index: number) => void;
  handleImgDrop: (index: number) => void;
  handleImgDragEnd: () => void;
  handleFileDrop: (e: DragEvent) => void;
  handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  handleVideoChange: (index: number, field: 'image' | 'label', value: string) => void;
  addVideo: () => void;
  removeVideo: (index: number) => void;
  handleExtrasChange: (index: number, value: string) => void;
  addExtras: () => void;
  removeExtras: (index: number) => void;
  toggleStack: (tech: string) => void;
  addCustomStack: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function useAddProjectForm(): UseAddProjectFormResult {
  const [form, setForm] = useState<AddProjectFormState>(() => createInitialForm());
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingFiles = useRef<Map<string, File>>(new Map());

  function handleField<K extends keyof AddProjectFormState>(key: K, value: AddProjectFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTypeChange(type: '' | 'gd' | 'dev') {
    setForm((prev) => ({ ...prev, type, category: '', stack: [] }));
  }

  function handleImagenChange(index: number, field: 'image' | 'label', value: string) {
    handleField('imagenes', updateMediaItem(form.imagenes, index, field, value));
  }

  function addImagen() {
    handleField('imagenes', addMediaItem(form.imagenes, createEmptyImage));
  }

  function removeImagen(index: number) {
    handleField('imagenes', removeItemAtIndex(form.imagenes, index));
    setImgErrors((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  }

  function handleImgDragStart(index: number) {
    setDragIndex(index);
  }

  function handleImgDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }

  function handleImgDrop(index: number) {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    handleField('imagenes', reorderItems(form.imagenes, dragIndex, index));
    setImgErrors({});
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function handleImgDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'));
    if (files.length === 0) return;
    const newImages = files.map((file) => {
      const blobUrl = URL.createObjectURL(file);
      pendingFiles.current.set(blobUrl, file);
      return { image: blobUrl, label: file.name.replace(/\.[^.]+$/, '') };
    });
    const currentImages = form.imagenes.filter((img) => img.image.trim() !== '');
    handleField('imagenes', [...currentImages, ...newImages]);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter((file) => file.type.startsWith('image/'));
    if (files.length === 0) return;
    const newImages = files.map((file) => {
      const blobUrl = URL.createObjectURL(file);
      pendingFiles.current.set(blobUrl, file);
      return { image: blobUrl, label: file.name.replace(/\.[^.]+$/, '') };
    });
    const currentImages = form.imagenes.filter((img) => img.image.trim() !== '');
    handleField('imagenes', [...currentImages, ...newImages]);
    e.target.value = '';
  }

  function handleVideoChange(index: number, field: 'image' | 'label', value: string) {
    handleField('videos', updateMediaItem(form.videos, index, field, value));
  }

  function addVideo() {
    handleField('videos', addMediaItem(form.videos, createEmptyVideo));
  }

  function removeVideo(index: number) {
    handleField('videos', removeItemAtIndex(form.videos, index));
  }

  function handleExtrasChange(index: number, value: string) {
    const updated = form.extras.map((v, i) => (i === index ? value : v));
    handleField('extras', updated);
  }

  function addExtras() {
    handleField('extras', [...form.extras, '']);
  }

  function removeExtras(index: number) {
    handleField('extras', removeItemAtIndex(form.extras, index));
  }

  function toggleStack(tech: string) {
    handleField('stack', toggleStringValue(form.stack, tech));
  }

  function addCustomStack(value: string) {
    handleField('stack', addUniqueStringValue(form.stack, value));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      if (!form.type) throw new Error('Selecciona un tipo de proyecto');
      if (!form.category) throw new Error('Selecciona una categoría');
      if (!form.title.trim()) throw new Error('El título es obligatorio');
      if (!form.cliente.trim()) throw new Error('El cliente es obligatorio');

      let imagenes = filterNonEmptyMediaItems(form.imagenes);
      const videos = filterNonEmptyMediaItems(form.videos);
      const extras = filterNonEmptyStrings(form.extras);

      const filesToUpload: File[] = [];
      const blobUrlsToReplace: string[] = [];
      for (const img of imagenes) {
        const file = pendingFiles.current.get(img.image);
        if (file) {
          filesToUpload.push(file);
          blobUrlsToReplace.push(img.image);
        }
      }

      if (filesToUpload.length > 0) {
        const uploaded = await uploadImages(
          filesToUpload,
          form.type as 'gd' | 'dev',
          form.category,
          form.title.trim(),
        );

        imagenes = imagenes.map((img) => {
          const blobIdx = blobUrlsToReplace.indexOf(img.image);
          if (blobIdx !== -1 && uploaded[blobIdx]) {
            URL.revokeObjectURL(img.image);
            const fileName = uploaded[blobIdx].ruta.split('/').pop() ?? '';
            return {
              image: fileName,
              label: img.label || uploaded[blobIdx].label,
            };
          }
          return {
            image: img.image ?? '',
            label: img.label,
          };
        });

        pendingFiles.current.clear();
      }

      const payload = {
        type: form.type,
        category: form.category,
        title: form.title.trim(),
        cliente: form.cliente.trim(),
        descripcion: form.descripcion.trim(),
        visible: form.visible,
        date: `${form.date} 00:00`,
        imagenes,
        videos,
        extras,
        ...(form.type === 'dev' && { stack: form.stack }),
      };

      const result = await createProject(payload);
      const created = result.data as { id: number } | undefined;
      setCreatedId(created?.id ?? null);
      setStatus('success');
      setForm(createInitialForm());
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error al crear el proyecto');
    }
  }

  return {
    form,
    status,
    errorMsg,
    createdId,
    dragIndex,
    dragOverIndex,
    imgErrors,
    fileInputRef,
    setImgErrors,
    handleField,
    handleTypeChange,
    handleImagenChange,
    addImagen,
    removeImagen,
    handleImgDragStart,
    handleImgDragOver,
    handleImgDrop,
    handleImgDragEnd,
    handleFileDrop,
    handleFileSelect,
    handleVideoChange,
    addVideo,
    removeVideo,
    handleExtrasChange,
    addExtras,
    removeExtras,
    toggleStack,
    addCustomStack,
    handleSubmit,
  };
}
