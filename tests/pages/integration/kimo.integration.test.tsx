import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, it, vi } from 'vitest';
import App from '../../../src/App';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

vi.mock('react-simple-maps', () => ({
  ComposableMap: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="composable-map">{children}</div>
  ),
  Geographies: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="geographies">{children}</div>
  ),
  Geography: () => <div data-testid="geography" />,
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
  ZoomableGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('topojson-client', () => ({
  feature: () => ({ features: [] }),
}));

// Mock the topology fetch
const fetchMock = vi.fn().mockResolvedValue({
  json: () =>
    Promise.resolve({
      type: 'Topology',
      objects: { countries: { type: 'GeometryCollection', geometries: [] } },
    }),
});
vi.stubGlobal('fetch', fetchMock);

describe('kimo integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.stubEnv('VITE_BOOK_COVERS_PATH', '/covers');
    window.scrollTo = vi.fn();
  });

  it('redirige a login cuando una ruta privada no tiene sesión', async () => {
    render(
      <MemoryRouter initialEntries={['/kimo/books']} future={routerFuture}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /acceso a kimo/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('muestra la biblioteca, cambia de vista y abre el modal de un libro', async () => {
    window.localStorage.setItem('kimo-authenticated', 'true');

    const { container } = render(
      <MemoryRouter initialEntries={['/kimo/books']} future={routerFuture}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(container.querySelector('[data-id="books-page"]')).toBeTruthy());
    expect(screen.getByRole('link', { name: /añadir libro/i })).toBeInTheDocument();
    expect(container.querySelector('[data-id="books-gallery-grid"]')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /tabla/i }));
    await waitFor(() => expect(container.querySelector('[data-id="books-table"]')).toBeTruthy());

    fireEvent.click(screen.getByRole('button', { name: /galería/i }));
    fireEvent.change(screen.getByLabelText('Título'), {
      target: { value: 'Juego de tronos' },
    });

    expect(
      await screen.findByRole('button', { name: /ver detalles de juego de tronos/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ver detalles de juego de tronos/i }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Juego de tronos')).toBeInTheDocument();
  });

  it('navega entre secciones privadas y muestra el mapa de lugares', async () => {
    window.localStorage.setItem('kimo-authenticated', 'true');

    const { container } = render(
      <MemoryRouter initialEntries={['/kimo/books']} future={routerFuture}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(container.querySelector('[data-id="books-page"]')).toBeTruthy());
    fireEvent.click(screen.getByRole('link', { name: /lugares visitados/i }));

    await waitFor(() => expect(container.querySelector('[data-id="places-page"]')).toBeTruthy());
    expect(container.querySelector('[data-id="places-map"]')).toBeTruthy();
    expect(container.querySelector('[data-id="places-table"]')).toBeTruthy();
  });
});
