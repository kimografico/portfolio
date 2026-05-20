import type { FC } from 'react';

export interface Book {
  id: string;
  title: string;
  author: string;
  language: string;
  cover: string;
  dateRead: string;
  genre: string;
  isbn: string;
  series: string;
  synopsis: string;
}

export type View = 'table' | 'gallery';

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
  IconFallback?: FC<{ size?: number; color?: string }>;
  buildImagePath?: (filename: string) => string;
}

export interface BookModalProps {
  book: Book;
  onClose: () => void;
  dataId?: string;
  IconFallback?: FC<{ size?: number; color?: string }>;
  buildImagePath?: (filename: string) => string;
  onPrev?: () => void;
  onNext?: () => void;
}
