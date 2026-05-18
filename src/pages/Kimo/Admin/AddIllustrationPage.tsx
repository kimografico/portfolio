import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import UIButton from '../../../components/ui/UIButton';
import BackendOfflineAlert from '../../../components/ui/BackendOfflineAlert';
import { IconImage } from '../../../components/iconos/IconImage';
import illustrations from '../../../data/kimo/illustrations.json';
import {
  createKimoIllustration,
  uploadKimoImages,
  type KimoIllustrationPayload,
} from '../../../api/apiClient';
import type { Illustration } from '../../../interfaces/illustration';
import { slugify } from '../../../utils/slugify';
import { APP_BASENAME } from '../../../data/config/app';
import { useBackendStatus } from '../../../contexts/BackendStatusContext';

interface IllustrationFormState {
  id: string;
  nombre: string;
  fecha: string;
  cliente: string;
  descripcion: string;
}

interface ExtraImageState {
  label: string;
  file: File | null;
  preview: string;
}

const initialForm: IllustrationFormState = {
  id: '',
  nombre: '',
  fecha: '',
  cliente: '',
  descripcion: '',
};

const emptyExtra = (): ExtraImageState => ({ label: '', file: null, preview: '' });

function hasBlobPreview(value: string): boolean {
  return value.startsWith('blob:');
}

export default function AddIllustrationPage() {
  const { alive } = useBackendStatus();
  const [form, setForm] = useState<IllustrationFormState>(initialForm);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState('');
  const [extras, setExtras] = useState<ExtraImageState[]>([emptyExtra()]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [createdId, setCreatedId] = useState('');

  const existingIds = useMemo(
    () => new Set((illustrations as Illustration[]).map((item) => item.id)),
    [],
  );

  useEffect(
    () => () => {
      if (hasBlobPreview(mainPreview)) {
        URL.revokeObjectURL(mainPreview);
      }
      extras.forEach((extra) => {
        if (hasBlobPreview(extra.preview)) {
          URL.revokeObjectURL(extra.preview);
        }
      });
    },
    [extras, mainPreview],
  );

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
    setForm((prev) => ({
      ...prev,
      nombre: value,
      id: prev.id.trim() === '' ? slugify(value) : prev.id,
    }));
  }

  function handleMainFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (hasBlobPreview(mainPreview)) {
      URL.revokeObjectURL(mainPreview);
    }
    setMainFile(file);
    setMainPreview(file ? URL.createObjectURL(file) : '');
    event.target.value = '';
  }

  function handleExtraFileChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setExtras((prev) =>
      prev.map((extra, i) => {
        if (i !== index) return extra;
        if (hasBlobPreview(extra.preview)) {
          URL.revokeObjectURL(extra.preview);
        }
        return {
          ...extra,
          file,
          preview: file ? URL.createObjectURL(file) : '',
        };
      }),
    );
    event.target.value = '';
  }

  function handleExtraLabelChange(index: number, value: string) {
    setExtras((prev) => prev.map((extra, i) => (i === index ? { ...extra, label: value } : extra)));
  }

  function addExtraImage() {
    setExtras((prev) => [...prev, emptyExtra()]);
  }

  function removeExtraImage(index: number) {
    setExtras((prev) => {
      const extra = prev[index];
      if (extra?.preview && hasBlobPreview(extra.preview)) {
        URL.revokeObjectURL(extra.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const illustrationId = slugify(form.id || form.nombre);
      if (!illustrationId) {
        throw new Error('El id o el nombre son obligatorios para generar un identificador');
      }
      if (existingIds.has(illustrationId)) {
        throw new Error(`Ya existe una ilustración con id "${illustrationId}"`);
      }
      if (!form.nombre.trim()) {
        throw new Error('El nombre es obligatorio');
      }
      if (!mainFile) {
        throw new Error('Selecciona una imagen principal antes de guardar');
      }

      const activeExtras = extras.filter((extra) => extra.file);
      const uploaded = await uploadKimoImages(
        [mainFile, ...activeExtras.map((extra) => extra.file as File)],
        'illustrations',
        illustrationId,
      );

      const mainImage = uploaded[0]?.ruta ?? '';
      const extraImages = uploaded.slice(1).map((item, index) => ({
        image: item.ruta,
        label: activeExtras[index]?.label.trim() ?? '',
      }));

      const payload: KimoIllustrationPayload = {
        id: illustrationId,
        nombre: form.nombre.trim(),
        image: mainImage,
        fecha: form.fecha.trim(),
        cliente: form.cliente.trim(),
        descripcion: form.descripcion.trim(),
        imagenesExtra: extraImages,
      };

      await createKimoIllustration(payload);
      setCreatedId(illustrationId);
      setStatus('success');
      setForm(initialForm);
      setMainFile(null);
      setMainPreview('');
      setExtras([emptyExtra()]);
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
            Se guarda en illustrations.json y la imagen principal se sube al backend.
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
        <div
          className="rounded-lg border border-green-300 bg-green-50 p-4 text-green-800"
          data-id="add-illustration-success"
        >
          ✅ Ilustración creada correctamente {createdId ? `(${createdId})` : ''}
        </div>
      )}

      {status === 'error' && (
        <div
          className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800"
          data-id="add-illustration-error"
        >
          ❌ {errorMsg}
        </div>
      )}

      <form
        className="grid gap-6 rounded-2xl border border-border bg-surface p-6"
        onSubmit={handleSubmit}
        data-id="add-illustration-form"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-ink">
            ID
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={form.id}
              onChange={(e) => handleField('id', e.target.value)}
              placeholder="Se autogenera si se deja vacío"
              data-id="add-illustration-id"
            />
          </label>
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

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="rounded-xl border border-dashed border-border bg-bg p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
              <IconImage size={20} />
              Imagen principal
            </div>
            <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface p-4 text-center text-sm text-muted hover:border-primary">
              {mainPreview ? (
                <img
                  src={mainPreview}
                  alt="Vista previa de la ilustración principal"
                  className="max-h-64 rounded-md object-cover"
                  data-id="add-illustration-main-preview"
                />
              ) : (
                <>
                  <IconImage size={44} />
                  <span>Selecciona la ilustración principal</span>
                </>
              )}
              <input
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleMainFileChange}
                data-id="add-illustration-main-input"
              />
            </label>
          </div>

          <div className="grid gap-4 rounded-xl border border-border bg-bg p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-ink">Imágenes extra</h3>
                <p className="text-xs text-muted">
                  Se guardan en el mismo JSON dentro de imagenesExtra.
                </p>
              </div>
              <button
                type="button"
                onClick={addExtraImage}
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink hover:border-primary"
                data-id="add-illustration-extra-btn"
              >
                Añadir imagen extra
              </button>
            </div>

            <div className="grid gap-4">
              {extras.map((extra, index) => (
                <div
                  key={`extra-${index}`}
                  className="grid gap-3 rounded-lg border border-border bg-surface p-4 md:grid-cols-[1fr_160px] md:items-start"
                >
                  <label className="grid gap-2 text-sm font-medium text-ink">
                    Texto / label
                    <input
                      className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
                      value={extra.label}
                      onChange={(e) => handleExtraLabelChange(index, e.target.value)}
                      placeholder="Descripción corta"
                      data-id={`add-illustration-extra-label-${index}`}
                    />
                  </label>
                  <div className="grid gap-2">
                    <label className="flex min-h-28 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border bg-bg px-3 py-2 text-center text-xs text-muted hover:border-primary">
                      {extra.preview ? (
                        <img
                          src={extra.preview}
                          alt={`Vista previa extra ${index + 1}`}
                          className="max-h-24 rounded-md object-cover"
                          data-id={`add-illustration-extra-preview-${index}`}
                        />
                      ) : (
                        <span>Selecciona imagen</span>
                      )}
                      <input
                        className="hidden"
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleExtraFileChange(index, event)}
                        data-id={`add-illustration-extra-input-${index}`}
                      />
                    </label>
                    {extras.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExtraImage(index)}
                        className="text-left text-xs font-medium text-red-600 hover:text-red-700"
                        data-id={`add-illustration-extra-remove-${index}`}
                      >
                        Eliminar imagen
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 rounded-xl border border-border bg-bg p-4 text-sm text-muted">
          <p>
            <strong className="text-ink">Tip:</strong> el id se autogenera a partir del nombre si lo
            dejas vacío.
          </p>
          <p>
            <strong className="text-ink">Persistencia:</strong> illustrations.json.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <UIButton saveBtn disabled={status === 'loading'} dataId="add-illustration-save-btn">
            {status === 'loading' ? 'Guardando…' : 'Añadir ilustración'}
          </UIButton>
        </div>
      </form>
    </section>
  );
}
