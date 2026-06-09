import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AddBookPage from '../../../src/pages/Kimo/Admin/AddBookPage';
import AddIllustrationPage from '../../../src/pages/Kimo/Admin/AddIllustrationPage';
import AddPlacePage from '../../../src/pages/Kimo/Admin/AddPlacePage';
import AddProjectPage from '../../../src/pages/Kimo/Admin/AddProjectPage';

import { createKimoIllustration, uploadKimoImages } from '../../../src/api/apiClient';

vi.mock('../../../src/api/apiClient', async () => {
  const actual = await vi.importActual<typeof import('../../../src/api/apiClient')>(
    '../../../src/api/apiClient',
  );

  return {
    ...actual,
    createKimoIllustration: vi.fn().mockResolvedValue({
      success: true,
      data: { id: 'illustration-demo' },
    }),
    uploadKimoImages: vi
      .fn()
      .mockResolvedValue([{ ruta: '/images/kimo/illustrations/demo-main.webp', label: '' }]),
  };
});

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
    expect(screen.getByRole('button', { name: /añadir ilustración/i })).toHaveAttribute(
      'type',
      'submit',
    );
    expect(screen.queryByLabelText(/^id$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/persistencia/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/tip:/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /seleccionar archivos/i })).toBeInTheDocument();
  });

  it('envía la ilustración al pulsar guardar', async () => {
    render(<AddIllustrationPage />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ilustración demo' } });

    const fileInput = document.querySelector<HTMLInputElement>(
      '[data-id="add-project-file-input"]',
    );
    expect(fileInput).not.toBeNull();

    const file = new File(['demo'], 'demo.png', { type: 'image/png' });
    fireEvent.change(fileInput as HTMLInputElement, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /añadir ilustración/i }));

    await waitFor(() => {
      expect(uploadKimoImages).toHaveBeenCalledWith([file], 'illustrations', 'Ilustración demo');
      expect(createKimoIllustration).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: 'Ilustración demo',
          image: 'demo-main.webp',
          imagenesExtra: [],
        }),
      );
    });
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
