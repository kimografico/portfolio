import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import UIButton from '../../../components/ui/UIButton';
import { IconImage } from '../../../components/iconos/IconImage';
import books from '../../../data/kimo/books.json';
import { createKimoBook, uploadKimoImages, type KimoBookPayload } from '../../../api/apiClient';
import type { Book } from '../../../interfaces/book';
import { slugify } from '../../../utils/slugify';
import { APP_BASENAME } from '../../../data/config/app';

interface BookFormState {
  id: string;
  title: string;
  author: string;
  language: string;
  dateRead: string;
  genre: string;
  isbn: string;
  series: string;
  synopsis: string;
}

const initialForm: BookFormState = {
  id: '',
  title: '',
  author: '',
  language: '',
  dateRead: '',
  genre: '',
  isbn: '',
  series: '',
  synopsis: '',
};

const languages = ['Español', 'Inglés'];

function isEmptyString(value: string): boolean {
  return value.trim() === '';
}

export default function AddBookPage() {
  const [form, setForm] = useState<BookFormState>(initialForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [createdId, setCreatedId] = useState('');

  const existingIds = useMemo(() => new Set((books as Book[]).map((book) => book.id)), []);

  useEffect(
    () => () => {
      if (coverPreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreview);
      }
    },
    [coverPreview],
  );

  function handleField<K extends keyof BookFormState>(key: K, value: BookFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      id: prev.id.trim() === '' ? slugify(value) : prev.id,
    }));
  }

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (coverPreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverFile(file);
    setCoverPreview(file ? URL.createObjectURL(file) : '');
    event.target.value = '';
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const bookId = slugify(form.id || form.title);
      if (isEmptyString(bookId)) {
        throw new Error('El id o el título son obligatorios para generar un identificador');
      }
      if (existingIds.has(bookId)) {
        throw new Error(`Ya existe un libro con id "${bookId}"`);
      }
      if (isEmptyString(form.title) || isEmptyString(form.author) || isEmptyString(form.language)) {
        throw new Error('Título, autor e idioma son obligatorios');
      }
      if (!coverFile) {
        throw new Error('Selecciona una portada antes de guardar');
      }

      const uploadedCover = await uploadKimoImages([coverFile], 'books', bookId);
      const payload: KimoBookPayload = {
        id: bookId,
        title: form.title.trim(),
        author: form.author.trim(),
        language: form.language.trim(),
        cover: uploadedCover[0]?.ruta ?? '',
        dateRead: form.dateRead.trim(),
        genre: form.genre.trim(),
        isbn: form.isbn.trim(),
        series: form.series.trim(),
        synopsis: form.synopsis.trim(),
      };

      await createKimoBook(payload);
      setCreatedId(bookId);
      setStatus('success');
      setForm(initialForm);
      setCoverFile(null);
      setCoverPreview('');
    } catch (error) {
      setStatus('error');
      setErrorMsg(error instanceof Error ? error.message : 'Error al crear el libro');
    }
  }

  return (
    <section className="flex flex-col gap-8" data-id="add-book-page">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Añadir libro</h2>
          <p className="text-sm text-muted">
            Se guarda en books.json y la portada se sube al backend.
          </p>
        </div>
        <UIButton href={`${APP_BASENAME}/kimo/books`} arrowBack link dataId="add-book-back-btn">
          Volver a Biblioteca
        </UIButton>
      </div>

      {status === 'success' && (
        <div
          className="rounded-lg border border-green-300 bg-green-50 p-4 text-green-800"
          data-id="add-book-success"
        >
          ✅ Libro creado correctamente {createdId ? `(${createdId})` : ''}
        </div>
      )}

      {status === 'error' && (
        <div
          className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800"
          data-id="add-book-error"
        >
          ❌ {errorMsg}
        </div>
      )}

      <form
        className="grid gap-6 rounded-2xl border border-border bg-surface p-6"
        onSubmit={handleSubmit}
        data-id="add-book-form"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-ink">
            ID
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={form.id}
              onChange={(e) => handleField('id', e.target.value)}
              placeholder="Se autogenera si se deja vacío"
              data-id="add-book-id"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Título *
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              data-id="add-book-title"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Autor *
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={form.author}
              onChange={(e) => handleField('author', e.target.value)}
              required
              data-id="add-book-author"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Idioma *
            <select
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={form.language}
              onChange={(e) => handleField('language', e.target.value)}
              required
              data-id="add-book-language"
            >
              <option value="">Selecciona…</option>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Fecha de lectura
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={form.dateRead}
              onChange={(e) => handleField('dateRead', e.target.value)}
              placeholder="YYYY-MM"
              data-id="add-book-date"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Género
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={form.genre}
              onChange={(e) => handleField('genre', e.target.value)}
              data-id="add-book-genre"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            ISBN
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={form.isbn}
              onChange={(e) => handleField('isbn', e.target.value)}
              data-id="add-book-isbn"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            Serie
            <input
              className="rounded-lg border border-border bg-bg px-3 py-2 text-sm"
              value={form.series}
              onChange={(e) => handleField('series', e.target.value)}
              data-id="add-book-series"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Sinopsis
          <textarea
            className="min-h-32 rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            value={form.synopsis}
            onChange={(e) => handleField('synopsis', e.target.value)}
            data-id="add-book-synopsis"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-[240px_1fr] md:items-start">
          <div className="rounded-xl border border-dashed border-border bg-bg p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
              <IconImage size={20} />
              Portada
            </div>
            <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface p-4 text-center text-sm text-muted hover:border-primary">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Vista previa de la portada"
                  className="max-h-56 rounded-md object-cover"
                  data-id="add-book-cover-preview"
                />
              ) : (
                <>
                  <IconImage size={44} />
                  <span>Selecciona una portada</span>
                </>
              )}
              <input
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                data-id="add-book-cover-input"
              />
            </label>
          </div>

          <div className="grid gap-3 rounded-xl border border-border bg-bg p-4 text-sm text-muted">
            <p>
              <strong className="text-ink">Tip:</strong> el id se autogenera a partir del título si
              lo dejas vacío. La portada se sube al backend y se guarda su ruta en el JSON.
            </p>
            <p>
              <strong className="text-ink">Persistencia:</strong> books.json.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <UIButton saveBtn disabled={status === 'loading'} dataId="add-book-save-btn">
            {status === 'loading' ? 'Guardando…' : 'Añadir libro'}
          </UIButton>
        </div>
      </form>
    </section>
  );
}
