import React, { useState } from 'react';
import booksData from '../../../../data/books.json';
import BooksTable from './BooksTable';
import BooksGallery from './BooksGallery';

/**
 * Página de /kimo/books. Toggle entre tabla y galería de libros.
 */
export default function BooksPage() {
  const [view, setView] = useState<'table' | 'gallery'>('table');

  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-xl flex-1">Lista de Libros que he ido leyendo</h2>
        <button
          className={`px-4 py-2 rounded border border-border text-sm font-mono transition-colors duration-150 ${view === 'table' ? 'bg-accent text-bg' : 'bg-surface text-ink'}`}
          onClick={() => setView('table')}
          aria-pressed={view === 'table'}
        >
          Tabla
        </button>
        <button
          className={`px-4 py-2 rounded border border-border text-sm font-mono transition-colors duration-150 ${view === 'gallery' ? 'bg-accent text-bg' : 'bg-surface text-ink'}`}
          onClick={() => setView('gallery')}
          aria-pressed={view === 'gallery'}
        >
          Galería
        </button>
      </div>
      {view === 'table' ? <BooksTable books={booksData} /> : <BooksGallery books={booksData} />}
    </section>
  );
}
