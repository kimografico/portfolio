import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi, afterEach } from 'vitest';
import BooksFilter from '../../../src/components/compositions/BooksFilter';
import BookModal from '../../../src/components/compositions/BookModal';
import { ProjectCard, type BaseProject } from '../../../src/components/ui/ProjectCard';
import type { Book } from '../../../src/types';

const books: Book[] = [
  {
    id: '1',
    title: 'El nombre del viento',
    author: 'Patrick Rothfuss',
    language: 'Español',
    cover: 'cover-1.jpg',
    dateRead: '2024-01',
    genre: 'Fantasía',
    isbn: '',
    series: 'Crónica del asesino de reyes',
    synopsis: 'Una historia de fantasía.',
  },
  {
    id: '2',
    title: 'El temor de un hombre sabio',
    author: 'Patrick Rothfuss',
    language: 'Español',
    cover: 'cover-2.jpg',
    dateRead: '2023-12',
    genre: 'Fantasía',
    isbn: '',
    series: 'Crónica del asesino de reyes',
    synopsis: 'Segunda parte.',
  },
  {
    id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    language: 'Español',
    cover: 'cover-3.jpg',
    dateRead: '2022-03',
    genre: 'Ciencia ficción',
    isbn: '',
    series: '',
    synopsis: 'Clásico de ciencia ficción.',
  },
];

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe('books domain components', () => {
  it('filtra libros y notifica el resultado filtrado', async () => {
    // BooksFilter mantiene la lógica de filtrado fuera de la página para reutilizarla mejor.
    const onFiltered = vi.fn();

    render(<BooksFilter books={books} onFiltered={onFiltered} />);

    await waitFor(() => expect(onFiltered).toHaveBeenCalledWith(books));

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'dune' } });
    await waitFor(() => expect(onFiltered).toHaveBeenLastCalledWith([books[2]]));

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Autor'), { target: { value: 'Patrick Rothfuss' } });
    await waitFor(() => expect(onFiltered).toHaveBeenLastCalledWith([books[0], books[1]]));
  });

  it('renderiza el ProjectCard y cae al original y al fallback cuando la miniatura falla', () => {
    // La tarjeta prueba varios orígenes de imagen para no dejar proyectos sin portada.
    const project: BaseProject = {
      id: '123',
      date: '2024-01-01',
      title: 'Proyecto demo',
      cliente: 'Cliente',
      thumb: 'thumb.jpg',
      imagenes: [{ image: 'original.jpg' }],
      stack: ['React'],
    };

    render(
      <BrowserRouter>
        <ProjectCard project={project} to="/project/123" />
      </BrowserRouter>,
    );

    const image = screen.getByRole('img', { name: 'Proyecto demo' });
    expect(image).toHaveAttribute('src', 'thumb.jpg');

    fireEvent.error(image);
    expect(image).toHaveAttribute('src', 'original.jpg');

    fireEvent.error(image);
    expect(image).toHaveAttribute('src', '/portfolio/images/portfolio/no-cover.jpg');
  });

  it('muestra el modal del libro con su información y cierra con animación', async () => {
    // BookModal concentra la experiencia de lectura y usa timers para animar entrada y salida.
    vi.stubEnv('VITE_BOOK_COVERS_PATH', '/covers');
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(<BookModal book={books[0]} onClose={onClose} />);

    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(screen.getByRole('dialog', { name: /el nombre del viento/i })).toBeInTheDocument();
    expect(screen.getByText('Patrick Rothfuss')).toBeInTheDocument();
    expect(screen.getByText(/fecha de lectura:/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /portada de el nombre del viento/i })).toHaveAttribute(
      'src',
      '/covers/cover-1.jpg',
    );

    fireEvent.click(screen.getByRole('button', { name: /cerrar modal/i }));
    act(() => {
      vi.runAllTimers();
    });

    expect(onClose).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});
