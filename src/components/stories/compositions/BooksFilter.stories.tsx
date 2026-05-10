import type { Meta, StoryObj } from '@storybook/react-vite';
import BooksFilter from '../../compositions/BooksFilter';
import type { Book } from '../../../interfaces/book';

const meta = {
  title: 'compositions/BooksFilter',
  component: BooksFilter,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof BooksFilter>;

export default meta;

type Story = StoryObj<typeof BooksFilter>;

const books: Book[] = [
  {
    id: '1',
    title: 'American Gods',
    author: 'Neil Gaiman',
    language: 'en',
    cover: 'american-gods.jpg',
    dateRead: '2024-08',
    genre: 'Fantasía',
    isbn: '978-0-06-257223-3',
    series: '',
    synopsis: '',
  },
  {
    id: '2',
    title: 'El nombre del viento',
    author: 'Patrick Rothfuss',
    language: 'es',
    cover: 'el-nombre-del-viento.jpg',
    dateRead: '2023-01',
    genre: 'Fantasía',
    isbn: '978-84-450-7536-9',
    series: 'Crónica del asesino de reyes',
    synopsis: '',
  },
  {
    id: '3',
    title: 'Siete veces gato',
    author: 'OTROS',
    language: 'es',
    cover: 'siete-veces-gato.jpg',
    dateRead: '2022-10',
    genre: 'Narrativa',
    isbn: '',
    series: '',
    synopsis: '',
  },
];

export const Default: Story = {
  args: {
    books,
    onFiltered: () => undefined,
  },
};
