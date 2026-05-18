// --- Helpers y tipos para imágenes/videos ---
interface FormState {
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
}

const emptyImagen = (): { image: string; label: string } => ({ image: '', label: '' });
const emptyVideo = (): { image: string; label: string } => ({ image: '', label: '' });

function normalizeImages(
  arr: Array<{ image?: string; ruta?: string; label?: string } | string>,
): { image: string; label: string }[] {
  return arr.map((img) => {
    if (typeof img === 'string') return { image: img, label: '' };
    if ('image' in img) return { image: img.image ?? '', label: img.label ?? '' };
    return { image: img.ruta ?? '', label: img.label ?? '' };
  });
}
import { useEffect, useState, useRef } from 'react';
import UIButton from '../../../components/ui/UIButton';
import BackendOfflineAlert from '../../../components/ui/BackendOfflineAlert';
import { IconImage } from '../../../components/iconos/IconImage';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProject,
  updateProject,
  uploadImages,
  deleteProjectsBatch,
  type ProjectData,
} from '../../../api/apiClient';

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

/**
 * EditProjectPage: Formulario para editar un proyecto existente.
 *
 * Carga los datos del proyecto por ID (de la URL) vía GET /api/projects/:id,
 * prerellena el formulario y llama a PUT /api/projects/:id al guardar.
 */
export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = Number(id);
  const isValidId = !isNaN(projectId) && projectId > 0;

  const [form, setForm] = useState<FormState | null>(null);
  const [loadStatus, setLoadStatus] = useState<'loading' | 'loaded' | 'error'>(
    isValidId ? 'loading' : 'error',
  );
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error' | 'deleting' | 'deleted'
  >('idle');
  const [errorMsg, setErrorMsg] = useState('');
  // --- Eliminar proyecto ---
  async function handleDeleteProject() {
    if (
      !window.confirm(
        '¿Seguro que quieres eliminar este proyecto? Esta acción no se puede deshacer.',
      )
    )
      return;
    setStatus('deleting');
    setErrorMsg('');
    try {
      await deleteProjectsBatch([projectId]);
      setStatus('deleted');
      setTimeout(() => {
        navigate('/kimo/data');
      }, 1200);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error al eliminar el proyecto');
    }
  }

  // --- Drag & Drop para reordenar imágenes ---
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  /** Mapa de blob URL → File original para subir al guardar */
  const pendingFiles = useRef<Map<string, File>>(new Map());

  // Cargar proyecto al montar
  useEffect(() => {
    if (!isValidId) return;

    let cancelled = false;
    async function load() {
      try {
        const result = await getProject(projectId);
        if (cancelled) return;
        const p = result.data as ProjectData;
        // Los videos pueden venir como string[] o como { ruta, label }[]
        // según si el JSON es antiguo o nuevo. Normalizamos a { ruta, label }[].
        const normalizeVideos = (arr: unknown[]): { image: string; label: string }[] =>
          arr.map((v) =>
            typeof v === 'string'
              ? { image: v, label: '' }
              : {
                  image: (v as { image?: string })?.image ?? '',
                  label: (v as { label?: string })?.label ?? '',
                },
          );

        // Los extras siempre son strings.
        const normalizeStringArray = (arr: unknown[]): string[] =>
          arr.map((v) => (typeof v === 'string' ? v : ((v as { ruta?: string })?.ruta ?? '')));

        setForm({
          type: p.type,
          category: p.category,
          title: p.title ?? '',
          cliente: p.cliente ?? '',
          descripcion: p.descripcion ?? '',
          visible: p.visible !== false,
          date: p.date ? p.date.split(' ')[0] : '',
          imagenes: p.imagenes?.length ? normalizeImages(p.imagenes) : [emptyImagen()],
          videos: p.videos?.length ? normalizeVideos(p.videos) : [emptyVideo()],
          extras: p.extras?.length ? normalizeStringArray(p.extras) : [''],
          stack: p.stack ?? [],
        });
        setLoadStatus('loaded');
      } catch {
        if (cancelled) return;
        setLoadStatus('error');
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [projectId, isValidId]);

  // Si aún no se han cargado los datos, mostrar estado de carga / error
  if (loadStatus === 'loading') {
    return (
      <section data-id="edit-project-page">
        <p className="text-muted py-16 text-center">Cargando proyecto #{id}…</p>
      </section>
    );
  }

  if (loadStatus === 'error' || !form) {
    return (
      <section data-id="edit-project-page">
        <div className="mb-6">
          <BackendOfflineAlert />
        </div>
        <UIButton
          onClick={() => navigate('/kimo/data')}
          dataId="edit-project-back-btn"
          arrowBack
          link
        >
          Volver a la Tabla
        </UIButton>
      </section>
    );
  }

  const f: FormState = form;

  // --- Helpers de campo simple ---

  function handleField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function handleTypeChange(type: '' | 'gd' | 'dev') {
    setForm((prev) => (prev ? { ...prev, type, category: '', stack: [] } : prev));
  }

  // --- Imagenes ---

  function handleImagenChange(index: number, field: 'image' | 'label', value: string) {
    const updated = f.imagenes.map((img, i) => (i === index ? { ...img, [field]: value } : img));
    handleField('imagenes', updated);
  }

  function addImagen() {
    handleField('imagenes', [...f.imagenes, emptyImagen()]);
  }

  function removeImagen(index: number) {
    handleField(
      'imagenes',
      f.imagenes.filter((_, i) => i !== index),
    );
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
    const updated = [...f.imagenes];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    handleField('imagenes', updated);
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
    const currentImages = f.imagenes.filter((img) => img.image.trim() !== '');
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
    const currentImages = f.imagenes.filter((img) => img.image.trim() !== '');
    handleField('imagenes', [...currentImages, ...newImages]);
    e.target.value = '';
  }

  // --- Videos (array de objetos) ---

  function handleVideoChange(index: number, field: 'image' | 'label', value: string) {
    const updated = f.videos.map((v, i) => (i === index ? { ...v, [field]: value } : v));
    handleField('videos', updated);
  }

  function addVideo() {
    handleField('videos', [...f.videos, emptyVideo()]);
  }

  function removeVideo(index: number) {
    handleField(
      'videos',
      f.videos.filter((_, i) => i !== index),
    );
  }

  // --- Extras (arrays de strings) ---

  function handleExtrasChange(index: number, value: string) {
    const updated = f.extras.map((v, i) => (i === index ? value : v));
    handleField('extras', updated);
  }

  function addExtras() {
    handleField('extras', [...f.extras, '']);
  }

  function removeExtras(index: number) {
    handleField(
      'extras',
      f.extras.filter((_, i) => i !== index),
    );
  }

  // --- Stack ---

  function toggleStack(tech: string) {
    const current = f.stack;
    const next = current.includes(tech) ? current.filter((t) => t !== tech) : [...current, tech];
    handleField('stack', next);
  }

  function addCustomStack(value: string) {
    const trimmed = value.trim();
    if (trimmed && !f.stack.includes(trimmed)) {
      handleField('stack', [...f.stack, trimmed]);
    }
  }

  // --- Submit ---

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      if (!f.type) throw new Error('Selecciona un tipo de proyecto');
      if (!f.category) throw new Error('Selecciona una categoría');
      if (!f.title.trim()) throw new Error('El título es obligatorio');
      if (!f.cliente.trim()) throw new Error('El cliente es obligatorio');

      let imagenes = f.imagenes.filter((img) => img.image.trim() !== '');
      const videos = f.videos.filter((v) => v.image.trim() !== '');
      const extras = f.extras.filter((ex) => ex.trim() !== '');

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
          f.type as 'gd' | 'dev',
          f.category,
          f.title.trim(),
        );

        imagenes = imagenes.map((img) => {
          const blobIdx = blobUrlsToReplace.indexOf(img.image);
          if (blobIdx !== -1 && uploaded[blobIdx]) {
            URL.revokeObjectURL(img.image);
            const ruta = uploaded[blobIdx].ruta;
            const filename = ruta.split('/').pop() || '';
            return {
              image: filename,
              label: img.label || uploaded[blobIdx].label,
            };
          }
          return img;
        });

        pendingFiles.current.clear();
      }

      const payload = {
        type: f.type,
        category: f.category,
        title: f.title.trim(),
        cliente: f.cliente.trim(),
        descripcion: f.descripcion.trim(),
        visible: f.visible,
        date: `${f.date} 00:00`,
        imagenes,
        videos,
        extras,
        ...(f.type === 'dev' && { stack: f.stack }),
      };

      await updateProject(projectId, payload);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error al guardar el proyecto');
    }
  }

  const categories = f.type ? CATEGORIES_BY_TYPE[f.type] : [];

  return (
    <section data-id="edit-project-page">
      <div className="flex items-center gap-4 mb-6">
        <UIButton
          onClick={() => navigate('/kimo/data')}
          dataId="edit-project-back-btn"
          arrowBack
          link
        >
          Volver a la Tabla
        </UIButton>
      </div>
      <h2 className="text-xl mb-5">
        Editar proyecto <span className="text-muted">#{projectId}</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6" data-id="edit-project-form">
        {/* Tipo y categoría */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted mb-1" htmlFor="ep-type">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              id="ep-type"
              data-id="edit-project-type"
              className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              value={f.type}
              onChange={(e) => handleTypeChange(e.target.value as '' | 'gd' | 'dev')}
              required
            >
              <option value="">Selecciona…</option>
              <option value="gd">Diseño Gráfico</option>
              <option value="dev">Desarrollo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-1" htmlFor="ep-category">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="ep-category"
              data-id="edit-project-category"
              className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
              value={f.category}
              onChange={(e) => handleField('category', e.target.value)}
              required
              disabled={!f.type}
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
            <label className="block text-xs font-semibold text-muted mb-1" htmlFor="ep-title">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              id="ep-title"
              type="text"
              data-id="edit-project-title"
              className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
              value={f.title}
              onChange={(e) => handleField('title', e.target.value)}
              placeholder="Nombre del proyecto"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted mb-1" htmlFor="ep-cliente">
              Cliente <span className="text-red-500">*</span>
            </label>
            <input
              id="ep-cliente"
              type="text"
              data-id="edit-project-cliente"
              className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
              value={f.cliente}
              onChange={(e) => handleField('cliente', e.target.value)}
              placeholder="Nombre del cliente"
              required
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-semibold text-muted mb-1" htmlFor="ep-desc">
            Descripción
          </label>
          <textarea
            id="ep-desc"
            data-id="edit-project-desc"
            className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y"
            rows={4}
            value={f.descripcion}
            onChange={(e) => handleField('descripcion', e.target.value)}
            placeholder="Descripción del proyecto…"
          />
        </div>

        {/* Fecha del proyecto */}
        <div>
          <label className="block text-xs font-semibold text-muted mb-1" htmlFor="ep-date">
            Fecha del proyecto
          </label>
          <input
            id="ep-date"
            type="date"
            data-id="edit-project-date"
            className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
            value={f.date}
            onChange={(e) => handleField('date', e.target.value)}
          />
        </div>

        {/* Stack (solo desarrollo) */}
        {f.type === 'dev' && (
          <div>
            <p className="text-xs font-semibold text-muted mb-2">Stack tecnológico</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {STACK_QUICK_OPTIONS.map((tech) => (
                <button
                  type="button"
                  key={tech}
                  onClick={() => toggleStack(tech)}
                  data-id={`edit-project-stack-${tech.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    f.stack.includes(tech)
                      ? 'bg-accent text-white border-accent'
                      : 'border-gray-300 text-muted hover:border-gray-400'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                data-id="edit-project-stack-custom-input"
                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
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
            {f.stack.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {f.stack.map((t) => (
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
        <div data-id="edit-project-images">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted">Imágenes</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-accent hover:underline"
                data-id="edit-project-select-files-btn"
              >
                📁 Seleccionar archivos
              </button>
              <UIButton
                type="button"
                onClick={addImagen}
                addBtn
                dataId="edit-project-add-image-btn"
              >
                Añadir URL
              </UIButton>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            data-id="edit-project-file-input"
            onChange={handleFileSelect}
          />

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3 text-center text-sm text-muted hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer min-h-48"
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
            }}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            data-id="edit-project-dropzone"
          >
            Arrastra imágenes aquí o haz clic para seleccionar
          </div>

          <div className="space-y-2">
            {f.imagenes.map((img, i) => (
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
                <span
                  className="cursor-grab active:cursor-grabbing text-muted select-none text-lg"
                  title="Arrastra para reordenar"
                >
                  ⠿
                </span>

                <div
                  className="w-16 h-12 rounded overflow-hidden flex-shrink-0 border"
                  style={{ background: 'var(--color-bg-btn)', borderColor: 'var(--color-border)' }}
                >
                  {img.image && !imgErrors[i] ? (
                    (() => {
                      // Si la ruta no contiene '/' se asume que es solo el nombre y se reconstruye la ruta
                      let src = img.image;
                      if (!img.image.includes('/')) {
                        let tipoFolder = '';
                        if (f.type === 'gd') tipoFolder = 'design';
                        else if (f.type === 'dev') tipoFolder = 'web';
                        // Si falta categoría, no se puede construir la ruta
                        if (tipoFolder && f.category) {
                          src = `/portfolio/images/portfolio/${tipoFolder}/${f.category}/${img.image}`;
                        } else {
                          src = `/portfolio/images/portfolio/${img.image}`;
                        }
                      }
                      return (
                        <a
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={img.label || `Abrir imagen ${i + 1} en nueva pestaña`}
                          data-id={`edit-project-img-link-${i}`}
                        >
                          <img
                            src={src}
                            alt={img.label || `Imagen ${i + 1}`}
                            data-id={`edit-project-img-${i}`}
                            className="w-full h-full object-cover"
                            onError={() => setImgErrors((prev) => ({ ...prev, [i]: true }))}
                          />
                        </a>
                      );
                    })()
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-lg"
                      style={{ background: 'var(--color-bg-btn)', color: 'var(--color-text-btn)' }}
                      data-id="new-image-thumb"
                    >
                      <IconImage aria-label="Sin imagen" className="w-7 h-7" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    data-id={`edit-project-image-url-${i}`}
                    className="w-1/2 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
                    placeholder="Nombre de archivo de la imagen"
                    value={img.image}
                    onChange={(e) => {
                      handleImagenChange(i, 'image', e.target.value);
                      setImgErrors((prev) => ({ ...prev, [i]: false }));
                    }}
                  />
                  <input
                    type="text"
                    data-id={`edit-project-image-label-${i}`}
                    className="w-1/2 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
                    placeholder="Etiqueta"
                    value={img.label}
                    onChange={(e) => handleImagenChange(i, 'label', e.target.value)}
                  />
                </div>

                <span className="text-xs text-muted w-5 text-center">{i + 1}</span>
                {f.imagenes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImagen(i)}
                    data-id={`edit-project-remove-image-btn-${i}`}
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
            <UIButton
              type="button"
              onClick={() => addVideo()}
              addBtn
              dataId="edit-project-add-video-btn"
            >
              Añadir video
            </UIButton>
          </div>
          <div className="space-y-2">
            {f.videos.map((v, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  data-id={`edit-project-video-url-${i}`}
                  className="w-1/2 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
                  placeholder="URL del video"
                  value={v.image}
                  onChange={(e) => handleVideoChange(i, 'image', e.target.value)}
                />
                <input
                  type="text"
                  data-id={`edit-project-video-label-${i}`}
                  className="w-1/2 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
                  placeholder="Descripción"
                  value={v.label}
                  onChange={(e) => handleVideoChange(i, 'label', e.target.value)}
                />
                {f.videos.length > 1 && (
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
            <p className="text-xs font-semibold text-muted">Extras / Tareas por hacer</p>
            <UIButton
              type="button"
              onClick={() => addExtras()}
              addBtn
              dataId="edit-project-add-extra-btn"
            >
              Añadir tarea
            </UIButton>
          </div>
          <div className="space-y-2">
            {f.extras.map((ex, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  data-id={`edit-project-extra-${i}`}
                  className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
                  placeholder="URL o texto extra"
                  value={ex}
                  onChange={(e) => handleExtrasChange(i, e.target.value)}
                />
                {f.extras.length > 1 && (
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
            id="ep-visible"
            type="checkbox"
            data-id="edit-project-visible-toggle"
            className="w-4 h-4 accent-accent"
            checked={f.visible}
            onChange={(e) => handleField('visible', e.target.checked)}
          />
          <label htmlFor="ep-visible" className="text-sm">
            Visible en la galería
          </label>
        </div>

        {/* Submit */}
        <div className="flex flex-col md:flex-row items-center gap-3 pt-2 md:flex-nowrap">
          <UIButton
            type="submit"
            mobileFullWidth
            saveBtn
            disabled={status === 'loading' || status === 'deleting' || status === 'deleted'}
            dataId="edit-project-submit"
          >
            {status === 'loading' ? 'Guardando…' : 'Guardar cambios'}
          </UIButton>
          <UIButton
            type="button"
            onClick={handleDeleteProject}
            color="accent"
            solid
            mobileFullWidth
            disabled={status === 'deleting' || status === 'deleted'}
            dataId="edit-project-delete-btn"
          >
            {status === 'deleting' ? 'Eliminando…' : 'Eliminar proyecto'}
          </UIButton>
          <UIButton
            type="button"
            onClick={() => navigate('/kimo/data')}
            color="text"
            mobileFullWidth
            dataId="edit-project-cancel"
            disabled={status === 'deleting' || status === 'deleted'}
          >
            Cancelar
          </UIButton>
          <div className="w-full md:w-auto md:ml-auto">
            <BackendOfflineAlert />
          </div>
        </div>

        {/* Feedback de éxito */}
        {status === 'success' && (
          <div
            className="mb-6 p-4 bg-green-50 border border-green-300 text-green-800 rounded"
            data-id="edit-project-success"
          >
            ✅ Proyecto actualizado correctamente
            <p className="text-xs mt-1 text-green-600">
              Recarga la página o reinicia el servidor para ver los cambios en la tabla.
            </p>
          </div>
        )}
        {status === 'deleted' && (
          <div
            className="mb-6 p-4 bg-green-50 border border-green-300 text-green-800 rounded"
            data-id="edit-project-deleted"
          >
            🗑️ Proyecto eliminado correctamente. Redirigiendo…
          </div>
        )}

        {/* Feedback de error */}
        {status === 'error' && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-300 text-red-800 rounded"
            data-id="edit-project-error"
          >
            ❌ {errorMsg}
          </div>
        )}
      </form>
    </section>
  );
}
