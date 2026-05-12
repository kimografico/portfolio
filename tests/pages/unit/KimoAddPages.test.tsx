import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AddBookPage from '../../../src/pages/Kimo/Admin/AddBookPage';
import AddIllustrationPage from '../../../src/pages/Kimo/Admin/AddIllustrationPage';
import AddPlacePage from '../../../src/pages/Kimo/Admin/AddPlacePage';
import AddProjectPage from '../../../src/pages/Kimo/Admin/AddProjectPage';

describe('Kimo add pages', () => {
  it('renderiza el formulario para añadir proyectos', () => {
    render(<AddProjectPage />);

    expect(screen.getByText('Añadir')).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cliente/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /añadir url/i })).toBeInTheDocument();
  });

  it('renderiza el formulario para añadir libros', () => {
    render(<AddBookPage />);

    expect(screen.getByRole('heading', { name: /añadir libro/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/autor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/idioma/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /volver a biblioteca/i })).toBeInTheDocument();
  });

  it('renderiza el formulario para añadir ilustraciones', () => {
    render(<AddIllustrationPage />);

    expect(screen.getByRole('heading', { name: /añadir ilustración/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^fecha$/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /volver a ilustraciones/i })).toBeInTheDocument();
  });

  it('renderiza el formulario para añadir lugares', () => {
    render(<AddPlacePage />);

    expect(screen.getByRole('heading', { name: /añadir lugares/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /nuevo lugar/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /nuevo marcador/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/ciudad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^lugar \*$/i)).toBeInTheDocument();
  });
});
