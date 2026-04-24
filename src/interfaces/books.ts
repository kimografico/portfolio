// Tipos e interfaces compartidos para BooksTable, BooksGallery y filtros de libros

import type { Book } from '../types';

export type ColumnMeta = {
  align?: 'left' | 'center';
  wide?: boolean;
};

export interface BooksTableProps {
  books: Book[];
}

export interface BooksGalleryProps {
  books: Book[];
}
