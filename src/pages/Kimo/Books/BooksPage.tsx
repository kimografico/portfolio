import { useState } from 'react';
import type { View } from '../../../types';
import UIButton from '../../../components/ui/UIButton';
import { isKimoAuthenticated } from '../../../lib/kimoAuth';
import '../../../styles/components/buttonStyles.css';
import booksData from '../../../data/kimo/books.json';
import BooksTable from './BooksTable';
import BooksGallery from './BooksGallery';

/**
 * Página de /kimo/books. Toggle entre tabla y galería de libros.
 */
export default function BooksPage() {
  const [view, setView] = useState<View>('gallery');

  return (
    <section data-id="books-page">
      <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center">
        <h2 className="text-xl flex-1">Lista de Libros que he ido leyendo</h2>
        {isKimoAuthenticated() && (
          <UIButton href={`${APP_BASENAME}/kimo/add-book`} dataId="books-add-book-btn" arrow>
            Añadir libro
          </UIButton>
        )}
        <UIButton
          onClick={() => setView('table')}
          color={view === 'table' ? 'accent' : 'muted'}
          solid={view === 'table'}
          dataId="books-view-table-btn"
          aria-pressed={view === 'table'}
        >
          Tabla
        </UIButton>
        <UIButton
          onClick={() => setView('gallery')}
          color={view === 'gallery' ? 'accent' : 'muted'}
          solid={view === 'gallery'}
          dataId="books-view-gallery-btn"
          aria-pressed={view === 'gallery'}
        >
          Galería
        </UIButton>
      </div>
      {view === 'table' ? <BooksTable books={booksData} /> : <BooksGallery books={booksData} />}
    </section>
  );
}
import { APP_BASENAME } from '../../../data/config/app';
