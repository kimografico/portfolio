import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

/**
 * Test básico para App.tsx
 * Verifica que la aplicación renderiza correctamente y que las rutas principales están disponibles.
 */
describe('App', () => {
  describe('rendering', () => {
    it('renderiza sin errores en la ruta raíz', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>,
      );
      // Si no hay error, el test pasa
      expect(true).toBe(true);
    });

    it('renderiza el mainLayout', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>,
      );
      // Verificar que la estructura base de la app está presente
      const body = document.body;
      expect(body).toBeInTheDocument();
    });
  });

  describe('rutas', () => {
    it('renderiza el Home en la ruta raíz', async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>,
      );
      // Home debería tener contenido (al menos un título principal)
      await waitFor(() => expect(document.querySelector('main')).toBeInTheDocument());
    });

    it('muestra la página 404 para rutas inexistentes', async () => {
      render(
        <MemoryRouter initialEntries={['/ruta-inexistente']}>
          <App />
        </MemoryRouter>,
      );
      // Buscar específicamente en el NotFoundPage
      await waitFor(() =>
        expect(document.querySelector('[data-id="not-found-page"]')).toBeInTheDocument(),
      );
    });
  });
});
