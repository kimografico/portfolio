import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AddBookPage from '../src/pages/Kimo/Admin/AddBookPage';
import AddIllustrationPage from '../src/pages/Kimo/Admin/AddIllustrationPage';
import AddPlacePage from '../src/pages/Kimo/Admin/AddPlacePage';

describe('Kimo admin add pages', () => {
  it('muestra el formulario de añadir libro', () => {
    const { container } = render(<AddBookPage />);

    expect(screen.getByRole('heading', { name: /añadir libro/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /añadir libro/i })).toBeInTheDocument();
    expect(container.querySelector('[data-id="add-book-cover-input"]')).toBeTruthy();
  });

  it('muestra el formulario de añadir ilustración', () => {
    const { container } = render(<AddIllustrationPage />);

    expect(screen.getByRole('heading', { name: /añadir ilustración/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /añadir ilustración/i })).toBeInTheDocument();
    expect(container.querySelector('[data-id="add-illustration-main-input"]')).toBeTruthy();
  });

  it('muestra los formularios de añadir lugares y marcadores', () => {
    render(<AddPlacePage />);

    expect(screen.getByRole('heading', { name: /añadir lugares/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /añadir lugar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /añadir marcador/i })).toBeInTheDocument();
  });
});
