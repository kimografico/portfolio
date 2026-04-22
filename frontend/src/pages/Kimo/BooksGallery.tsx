import React from 'react';
import type { Book } from '../../types';

interface BooksGalleryProps {
  books: Book[];
}

export default function BooksGallery({ books }: BooksGalleryProps) {
  // Por ahora solo placeholder
  return (
    <div className="text-muted text-center py-16">
      <p>Galería de portadas (próximamente)</p>
      <div className="text-xs mt-4">Libros recibidos: {books.length}</div>
    </div>
  );
}
