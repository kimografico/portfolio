import { useState, useRef } from 'react';
import { IconImage } from '../../../components/iconos/IconImage';
import { createProject, uploadImages } from '../../../api/apiClient';

/**
 * Categorías disponibles por tipo.
 * Deben coincidir exactamente con VALID_CATEGORIES en api/utils/validation.cjs
 */
const CATEGORIES_BY_TYPE: Record<string, { label: string; value: string }[]> = {
  gd: [
    { value: 'carteleria', label: 'Cartelería' },
    { value: 'editorial', label: 'Editorial' },
    { value: 'etiquetas', label: 'Etiquetas' },
    { value: 'logotipos', label: 'Logotipos' },
    { value: 'multimedia', label: 'Multimedia' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'papeleria', label: 'Papelería' },
    { value: 'proyectos-especiales', label: 'Proyectos especiales' },
  ],
  dev: [
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'wordpress', label: 'WordPress' },
    { value: 'frameworks', label: 'Frameworks' },
  ],
};

/** Tecnologías rápidas para el campo stack (solo dev) */
const STACK_QUICK_OPTIONS = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Vue',
  'Angular',
  'WordPress',
  'PHP',
  'Node.js',
  'Vite',
  'Prestashop',
];

/** Devuelve un objeto imagen vacío */
const emptyImagen = () => ({ image: '', label: '' });

/** Devuelve un objeto video vacío */
const emptyVideo = () => ({ image: '', label: '' });

/** Obtener fecha actual en formato YYYY-MM-DD */
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/** Estado inicial del formulario */
const initialForm = {
  type: '' as '' | 'gd' | 'dev',
  category: '',
  title: '',
  cliente: '',
  descripcion: '',
  visible: true,
  date: getTodayDate(),
  imagenes: [emptyImagen()],
  videos: [emptyVideo()],
  extras: [''],
  stack: [] as string[],
};

type FormState = {
  type: '' | 'gd' | 'dev';
  category: string;
  title: string;
  cliente: string;
  descripcion: string;
  visible: boolean;
  date: string;
  imagenes: { image: string; label: string }[];
  videos: { image: string; label: string }[];
  extras: string[];
  stack: string[];
};

/**
 * AddProjectPage: Formulario para añadir un proyecto nuevo.
 *
 * Llama a POST /api/projects con todos los datos del proyecto.
 * El backend valida, genera el ID y persiste en el JSON correspondiente.
 */
export default function AddProjectPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [createdId, setCreatedId] = useState<number | null>(null);

  // --- Drag & Drop para reordenar imágenes ---
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  /** URLs de thumbnail que fallaron al cargar */
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  /** Ref del input file oculto para el drop zone */
  const fileInputRef = useRef<HTMLInputElement>(null);
  /**
   * Mapa de blob URL → File original.
   * Permite subir los archivos al backend en el momento del submit,
   * manteniendo la previsualización con blob URLs mientras se edita.
   */
  const pendingFiles = useRef<Map<string, File>>(new Map());

  // --- Helpers de campo simple ---

  function handleField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /** Al cambiar el tipo, reseteamos la categoría y el stack */
  function handleTypeChange(type: '' | 'gd' | 'dev') {
    setForm((prev) => ({ ...prev, type, category: '', stack: [] }));
  }

  // --- Imagenes (array de {ruta, label}) ---

  function handleImagenChange(index: number, field: 'image' | 'label', value: string) {
    const updated = form.imagenes.map((img, i) => (i === index ? { ...img, [field]: value } : img));
    handleField('imagenes', updated);
  }

  function addImagen() {
    handleField('imagenes', [...form.imagenes, emptyImagen()]);
  }

  function removeImagen(index: number) {
    handleField(
      'imagenes',
      form.imagenes.filter((_, i) => i !== index),
    );
    // Limpiar errores de imagen al eliminar
    setImgErrors((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  }

  // --- Drag & Drop: reordenar imágenes ---

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
    const updated = [...form.imagenes];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    handleField('imagenes', updated);
    // Recalcular errores de thumbnail tras reordenar
    setImgErrors({});
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function handleImgDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  /** Maneja archivos soltados en el drop zone: crea blob URLs para previsualizar y guarda el File original */
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

  // --- Videos (array de objetos) ---

  function handleVideoChange(index: number, field: 'image' | 'label', value: string) {
    const updated = form.videos.map((v, i) => (i === index ? { ...v, [field]: value } : v));
    handleField('videos', updated);
  }

  function addVideo() {
    handleField('videos', [...form.videos, emptyVideo()]);
  }

  function removeVideo(index: number) {
    handleField(
      'videos',
      form.videos.filter((_, i) => i !== index),
    );
  }

  // --- Extras (arrays de strings) ---

  function handleExtrasChange(index: number, value: string) {
    const updated = form.extras.map((v, i) => (i === index ? value : v));
    handleField('extras', updated);
  }

  function addExtras() {
    handleField('extras', [...form.extras, '']);
  }

  function removeExtras(index: number) {
    handleField(
      'extras',
      form.extras.filter((_, i) => i !== index),
    );
  }

  // --- Stack (array de strings, solo dev) ---

  function toggleStack(tech: string) {
    const current = form.stack;
    const next = current.includes(tech) ? current.filter((t) => t !== tech) : [...current, tech];
    handleField('stack', next);
  }

  function addCustomStack(value: string) {
    const trimmed = value.trim();
    if (trimmed && !form.stack.includes(trimmed)) {
      handleField('stack', [...form.stack, trimmed]);
    }
  }

  // --- Submit ---

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      if (!form.type) throw new Error('Selecciona un tipo de proyecto');
      if (!form.category) throw new Error('Selecciona una categoría');
      if (!form.title.trim()) throw new Error('El título es obligatorio');
      if (!form.cliente.trim()) throw new Error('El cliente es obligatorio');

      // Limpiar arrays: eliminar entradas vacías
      let imagenes = form.imagenes.filter((img) => img.image.trim() !== '');
      const videos = form.videos.filter((v) => v.image.trim() !== '');
      const extras = form.extras.filter((e) => e.trim() !== '');

      // Subir archivos pendientes (blob URLs) al backend
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

        // Reemplazar blob URLs por nombres de archivo (solo el nombre, no la ruta completa)
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
          // Forzar image a string (nunca undefined)
          return {
            image: img.image ?? '',
            label: img.label,
          };
        });

        // Limpiar el mapa de archivos pendientes
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

      // El backend devuelve el proyecto creado con su ID generado
      const created = result.data as { id: number } | undefined;
      setCreatedId(created?.id ?? null);
      setStatus('success');

      // Resetear formulario
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error al crear el proyecto');
    }
  }

  const categories = form.type ? CATEGORIES_BY_TYPE[form.type] : [];

  return (
    <section data-id="add-project-page">
      <h2 className="text-xl mb-6">Añadir</h2>

      {/* Feedback de éxito */}
      {status === 'success' && (
        <div
          className="mb-6 p-4 bg-green-50 border border-green-300 text-green-800 rounded"
          data-id="add-project-success"
        >
          ✅ Proyecto creado correctamente
          {createdId && <span className="ml-2 text-sm text-green-600">(ID: {createdId})</span>}
          <p className="text-xs mt-1 text-green-600">
            Recarga la página o reinicia el servidor para ver los cambios en la tabla.
          </p>
        </div>
      )}

      {/* Feedback de error */}
      {status === 'error' && (
        <div
          className="mb-6 p-4 bg-red-50 border border-red-300 text-red-800 rounded"
          data-id="add-project-error"
        >
          ❌ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" data-id="add-project-form">
        {/* Tipo y categoría */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1" htmlFor="ap-type">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              id="ap-type"
              className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              value={form.type}
              onChange={(e) => handleTypeChange(e.target.value as '' | 'gd' | 'dev')}
              required
            >
              <option value="">Selecciona…</option>
              <option value="gd">Diseño Gráfico</option>
              <option value="dev">Desarrollo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-1" htmlFor="ap-category">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="ap-category"
              className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
              value={form.category}
              onChange={(e) => handleField('category', e.target.value)}
              required
              disabled={!form.type}
            >
              <option value="">Selecciona…</option>
              {categories.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Título y cliente */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1" htmlFor="ap-title">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              id="ap-title"
              type="text"
              className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              value={form.title}
              onChange={(e) => handleField('title', e.target.value)}
              placeholder="Nombre del proyecto"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-1" htmlFor="ap-cliente">
              Cliente <span className="text-red-500">*</span>
            </label>
            <input
              id="ap-cliente"
              type="text"
              className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              value={form.cliente}
              onChange={(e) => handleField('cliente', e.target.value)}
              placeholder="Nombre del cliente"
              required
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-semibold text-muted mb-1" htmlFor="ap-desc">
            Descripción
          </label>
          <textarea
            id="ap-desc"
            className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
            rows={4}
            value={form.descripcion}
            onChange={(e) => handleField('descripcion', e.target.value)}
            placeholder="Descripción del proyecto…"
          />
        </div>

        {/* Fecha del proyecto */}
        <div>
          <label className="block text-xs font-semibold text-muted mb-1" htmlFor="ap-date">
            Fecha del proyecto
          </label>
          <input
            id="ap-date"
            type="date"
            className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            value={form.date}
            onChange={(e) => handleField('date', e.target.value)}
          />
        </div>

        {/* Stack (solo desarrollo) */}
        {form.type === 'dev' && (
          <div>
            <p className="text-xs font-semibold text-muted mb-2">Stack tecnológico</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {STACK_QUICK_OPTIONS.map((tech) => (
                <button
                  type="button"
                  key={tech}
                  onClick={() => toggleStack(tech)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    form.stack.includes(tech)
                      ? 'bg-accent text-white border-accent'
                      : 'border-gray-300 text-muted hover:border-gray-400'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
            {/* Campo para añadir tecnología personalizada */}
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Otra tecnología…"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomStack((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <span className="text-xs text-muted self-center">↵ Enter para añadir</span>
            </div>
            {form.stack.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.stack.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-accent text-white px-2 py-0.5 rounded flex items-center gap-1"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => toggleStack(t)}
                      className="leading-none"
                      aria-label={`Eliminar ${t}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Imágenes: drag & drop con miniaturas */}
        <div data-id="add-project-images">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted">Imágenes</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-accent hover:underline"
              >
                📁 Seleccionar archivos
              </button>
              <button
                type="button"
                onClick={addImagen}
                className="text-xs text-accent hover:underline"
              >
                + Añadir URL
              </button>
            </div>
          </div>

          {/* Input file oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Drop zone: se muestra cuando no hay imágenes o siempre como zona de arrastre */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3 text-center text-sm text-muted hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer min-h-48"
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
            }}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            data-id="add-project-dropzone"
          >
            Arrastra imágenes aquí o haz clic para seleccionar
          </div>

          {/* Lista de imágenes con miniaturas y reordenables por drag */}
          <div className="space-y-2">
            {form.imagenes.map((img, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => handleImgDragStart(i)}
                onDragOver={(e) => handleImgDragOver(e, i)}
                onDrop={(e) => {
                  e.preventDefault();
                  handleImgDrop(i);
                }}
                onDragEnd={handleImgDragEnd}
                className={`flex gap-3 items-center p-2 rounded border transition-all ${
                  dragOverIndex === i ? 'border-accent bg-accent/5' : 'border-gray-200'
                } ${dragIndex === i ? 'opacity-40' : ''}`}
              >
                {/* Drag handle */}
                <span
                  className="cursor-grab active:cursor-grabbing text-muted select-none text-lg"
                  title="Arrastra para reordenar"
                >
                  ⠿
                </span>

                {/* Miniatura */}
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
                      onError={() => setImgErrors((prev) => ({ ...prev, [i]: true }))}
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

                {/* Campos URL + label */}
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="URL de la imagen"
                    value={img.image}
                    onChange={(e) => {
                      handleImagenChange(i, 'image', e.target.value);
                      setImgErrors((prev) => ({ ...prev, [i]: false }));
                    }}
                  />
                  <input
                    type="text"
                    className="w-36 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Etiqueta"
                    value={img.label}
                    onChange={(e) => handleImagenChange(i, 'label', e.target.value)}
                  />
                </div>

                {/* Índice + botón eliminar */}
                <span className="text-xs text-muted w-5 text-center">{i + 1}</span>
                {form.imagenes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImagen(i)}
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

        {/* Videos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted">Videos</p>
            <button
              type="button"
              onClick={() => addVideo()}
              className="text-xs text-accent hover:underline"
            >
              + Añadir video
            </button>
          </div>
          <div className="space-y-2">
            {form.videos.map((v, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="URL del video"
                  value={v.image}
                  onChange={(e) => handleVideoChange(i, 'image', e.target.value)}
                />
                <input
                  type="text"
                  className="w-36 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Descripción"
                  value={v.label}
                  onChange={(e) => handleVideoChange(i, 'label', e.target.value)}
                />
                {form.videos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVideo(i)}
                    className="text-muted hover:text-red-500 transition-colors text-lg leading-none pb-0.5"
                    aria-label="Eliminar video"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Extras */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted">Extras / Links</p>
            <button
              type="button"
              onClick={() => addExtras()}
              className="text-xs text-accent hover:underline"
            >
              + Añadir link
            </button>
          </div>
          <div className="space-y-2">
            {form.extras.map((ex, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="URL o texto extra"
                  value={ex}
                  onChange={(e) => handleExtrasChange(i, e.target.value)}
                />
                {form.extras.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExtras(i)}
                    className="text-muted hover:text-red-500 transition-colors text-lg leading-none pb-0.5"
                    aria-label="Eliminar extra"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Visible */}
        <div className="flex items-center gap-3">
          <input
            id="ap-visible"
            type="checkbox"
            className="w-4 h-4 accent-accent"
            checked={form.visible}
            onChange={(e) => handleField('visible', e.target.checked)}
          />
          <label htmlFor="ap-visible" className="text-sm">
            Visible en la galería
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-2 bg-accent text-white rounded text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            data-id="add-project-submit"
          >
            {status === 'loading' ? 'Guardando…' : 'Crear proyecto'}
          </button>
          <p className="text-xs text-muted">
            El backend debe estar activo: <code className="font-mono">pnpm backend:dev</code>
          </p>
        </div>
      </form>
    </section>
  );
}
