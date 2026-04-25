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
