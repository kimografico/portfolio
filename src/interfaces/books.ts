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

export interface BooksFilterProps {
  books: Book[];
  onFiltered: (filtered: Book[]) => void;
  dataId?: string;
  IconFallback?: React.FC<{ size?: number; color?: string }>;
  buildImagePath?: (filename: string) => string;
}

export interface BookModalProps {
  book: Book;
  onClose: () => void;
  dataId?: string;
  IconFallback?: React.FC<{ size?: number; color?: string }>;
  buildImagePath?: (filename: string) => string;
  onPrev?: () => void;
  onNext?: () => void;
}
