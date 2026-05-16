import useAddProjectForm from './useAddProjectForm';
import ImageDropZone from '../../../components/compositions/ImageDropZone';
import EditableFieldList from '../../../components/compositions/EditableFieldList';
import TechStackTags from '../../../components/compositions/TechStackTags';
import UIButton from '../../../components/ui/UIButton';

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
 * AddProjectPage: Formulario para añadir un proyecto nuevo.
 *
 * Llama a POST /api/projects con todos los datos del proyecto.
 * El backend valida, genera el ID y persiste en el JSON correspondiente.
 */
export default function AddProjectPage() {
  const {
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
  } = useAddProjectForm();

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
              data-id="add-project-type"
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
              data-id="add-project-category"
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
              data-id="add-project-title"
              className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
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
              data-id="add-project-cliente"
              className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
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
            data-id="add-project-desc"
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
            data-id="add-project-date"
            className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]"
            value={form.date}
            onChange={(e) => handleField('date', e.target.value)}
          />
        </div>

        {/* Stack (solo desarrollo) */}
        {form.type === 'dev' && (
          <TechStackTags
            stack={form.stack}
            options={STACK_QUICK_OPTIONS}
            onToggle={toggleStack}
            onAddCustom={addCustomStack}
            dataIdBase="add-project-stack"
          />
        )}

        <ImageDropZone
          images={form.imagenes}
          imgErrors={imgErrors}
          dragIndex={dragIndex}
          dragOverIndex={dragOverIndex}
          fileInputRef={fileInputRef}
          onSelectFilesClick={() => fileInputRef.current?.click()}
          onAddImage={addImagen}
          onFileSelect={handleFileSelect}
          onDropZoneDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
          }}
          onDropZoneDrop={handleFileDrop}
          onImageDragStart={handleImgDragStart}
          onImageDragOver={handleImgDragOver}
          onImageDrop={handleImgDrop}
          onImageDragEnd={handleImgDragEnd}
          onImageChange={handleImagenChange}
          onRemoveImage={removeImagen}
          onImageError={(index) => setImgErrors((prev) => ({ ...prev, [index]: true }))}
        />

        <EditableFieldList
          label="Videos"
          values={form.videos.map((v) => ({ value: v.image, label: v.label }))}
          inputType="url"
          placeholder="URL del video"
          dataIdBase="add-project-video-url"
          withLabel
          labelPlaceholder="Descripción"
          onChange={(i, value, label) => {
            handleVideoChange(i, 'image', value);
            handleVideoChange(i, 'label', label ?? '');
          }}
          onAdd={addVideo}
          onRemove={removeVideo}
          addBtnLabel="+ Añadir video"
        />

        <EditableFieldList
          label="Extras / Links"
          values={form.extras}
          inputType="text"
          placeholder="URL o texto extra"
          dataIdBase="add-project-extra"
          onChange={handleExtrasChange}
          onAdd={addExtras}
          onRemove={removeExtras}
          addBtnLabel="+ Añadir link"
        />

        {/* Visible */}
        <div className="flex items-center gap-3">
          <input
            id="ap-visible"
            type="checkbox"
            data-id="add-project-visible-toggle"
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
          <UIButton
            type="submit"
            dataId="add-project-submit"
            saveBtn
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Guardando…' : 'Crear proyecto'}
          </UIButton>
          <p className="text-xs text-muted">
            El backend debe estar activo: <code className="font-mono">pnpm backend</code>
          </p>
        </div>
      </form>
    </section>
  );
}
