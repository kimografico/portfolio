import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../../src/App';

describe('public routes integration', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.scrollTo = vi.fn();
  });

  it('muestra la home y navega a contacto desde el encabezado', async () => {
    // Este flujo comprueba la navegación principal del sitio público a través del layout común.
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(container.querySelector('[data-id="home-page"]')).toBeTruthy());
    fireEvent.click(screen.getByRole('link', { name: 'Contacto' }));

    await waitFor(() => expect(container.querySelector('[data-id="contact-page"]')).toBeTruthy());
    expect(screen.getByRole('heading', { name: /contacto/i })).toBeInTheDocument();
  });

  it('abre la ruta de diseño gráfico y navega a una galería de categoría', async () => {
    // La ruta pública de diseño debe cargar el home de categoría y permitir entrar en una galería lazy.
    const { container } = render(
      <MemoryRouter initialEntries={['/graphic-design']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(container.querySelector('[data-id="graphic-design-home"]')).toBeTruthy(),
    );
    fireEvent.click(screen.getByRole('link', { name: /branding & logotipos/i }));

    await waitFor(() => expect(container.querySelector('[data-id="logotipos-page"]')).toBeTruthy());
    expect(screen.getByRole('heading', { name: /branding & logotipos/i })).toBeInTheDocument();
  });

  it('abre la ruta de desarrollo y navega a una galería de categoría', async () => {
    // La misma lógica de navegación debe funcionar en la rama de desarrollo web.
    const { container } = render(
      <MemoryRouter initialEntries={['/dev']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(container.querySelector('[data-id="developer-home"]')).toBeTruthy());
    fireEvent.click(container.querySelector('[data-id="category-card-wordpress"]') as HTMLElement);

    await waitFor(() => expect(container.querySelector('[data-id="wordpress-page"]')).toBeTruthy());
    expect(screen.getByRole('heading', { name: /wordpress/i })).toBeInTheDocument();
  });

  it('muestra la página 404 y permite volver al inicio', async () => {
    // El 404 forma parte de la experiencia de navegación y no debe romper el layout.
    const { container } = render(
      <MemoryRouter initialEntries={['/ruta-inexistente']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(container.querySelector('[data-id="not-found-page"]')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: /volver al inicio/i }));

    await waitFor(() => expect(container.querySelector('[data-id="home-page"]')).toBeTruthy());
  });
});
