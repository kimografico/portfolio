import { useState } from 'react';
import { createProject } from '../../api/apiClient';

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
    { value: 'vanilla', label: 'Vanilla JS' },
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
const emptyImagen = () => ({ ruta: '', label: '' });

/** Estado inicial del formulario */
const initialForm = {
  type: '' as '' | 'gd' | 'dev',
  category: '',
  title: '',
  cliente: '',
  descripcion: '',
  visible: true,
  imagenes: [emptyImagen()],
  videos: [''],
  extras: [''],
  stack: [] as string[],
};

type FormState = typeof initialForm;

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

  // --- Helpers de campo simple ---

  function handleField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /** Al cambiar el tipo, reseteamos la categoría y el stack */
  function handleTypeChange(type: '' | 'gd' | 'dev') {
    setForm((prev) => ({ ...prev, type, category: '', stack: [] }));
  }

  // --- Imagenes (array de {ruta, label}) ---

  function handleImagenChange(index: number, field: 'ruta' | 'label', value: string) {
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
  }

  // --- Videos y extras (arrays de strings) ---

  function handleArrayChange(key: 'videos' | 'extras', index: number, value: string) {
    const updated = form[key].map((v, i) => (i === index ? value : v));
    handleField(key, updated);
  }

  function addArrayItem(key: 'videos' | 'extras') {
    handleField(key, [...form[key], '']);
  }

  function removeArrayItem(key: 'videos' | 'extras', index: number) {
    handleField(
      key,
      form[key].filter((_, i) => i !== index),
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
      const imagenes = form.imagenes.filter((img) => img.ruta.trim() !== '');
      const videos = form.videos.filter((v) => v.trim() !== '');
      const extras = form.extras.filter((e) => e.trim() !== '');

      const payload = {
        type: form.type,
        category: form.category,
        title: form.title.trim(),
        cliente: form.cliente.trim(),
        descripcion: form.descripcion.trim(),
        visible: form.visible,
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
      <h2 className="text-xl mb-6">Añadir proyecto</h2>

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

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl" data-id="add-project-form">
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

        {/* Imágenes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted">Imágenes</p>
            <button
              type="button"
              onClick={addImagen}
              className="text-xs text-accent hover:underline"
            >
              + Añadir imagen
            </button>
          </div>
          <div className="space-y-2">
            {form.imagenes.map((img, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    type="url"
                    className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="URL de la imagen"
                    value={img.ruta}
                    onChange={(e) => handleImagenChange(i, 'ruta', e.target.value)}
                  />
                </div>
                <div className="w-40">
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Etiqueta (opcional)"
                    value={img.label}
                    onChange={(e) => handleImagenChange(i, 'label', e.target.value)}
                  />
                </div>
                {form.imagenes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImagen(i)}
                    className="text-muted hover:text-red-500 transition-colors text-lg leading-none pb-0.5"
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
              onClick={() => addArrayItem('videos')}
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
                  value={v}
                  onChange={(e) => handleArrayChange('videos', i, e.target.value)}
                />
                {form.videos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('videos', i)}
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
              onClick={() => addArrayItem('extras')}
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
                  onChange={(e) => handleArrayChange('extras', i, e.target.value)}
                />
                {form.extras.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('extras', i)}
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
            El backend debe estar activo:{' '}
            <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">pnpm backend:dev</code>
          </p>
        </div>
      </form>
    </section>
  );
}
