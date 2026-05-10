import type { Meta, StoryObj } from '@storybook/react-vite';
import BookModal from '../../compositions/BookModal';
import type { Book } from '../../../interfaces/book';

const meta = {
  title: 'compositions/BookModal',
  component: BookModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof BookModal>;

export default meta;

type Story = StoryObj<typeof BookModal>;

const exampleBook: Book = {
  id: 'american-gods',
  title: 'American Gods',
  author: 'Neil Gaiman',
  language: 'en',
  cover: 'american-gods.jpg',
  dateRead: '2024-08',
  genre: 'Fantasía',
  isbn: '978-0-06-257223-3',
  series: '',
  synopsis: 'Un viaje por el choque entre viejos dioses y nuevas creencias.',
};

export const Open: Story = {
  args: {
    book: exampleBook,
    onClose: () => undefined,
  },
};
