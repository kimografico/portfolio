// Tipos e interfaces principales del proyecto

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

/**
 * Tipo para la vista de libros (tabla o galería)
 * Usado en BooksPage y similares para alternar entre vistas
 */
export type View = 'table' | 'gallery';
