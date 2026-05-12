import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from '../../../src/App';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

vi.mock('../../../src/components/layout/ScrollToTop', () => ({
  default: () => null,
}));

vi.mock('../../../src/components/layout/MainLayout', () => ({
  default: function MockMainLayout() {
    return (
      <div data-id="mock-main-layout">
        <Outlet />
      </div>
    );
  },
}));

vi.mock('../../../src/pages/Home', () => ({
  default: () => <div data-id="home-page">Inicio</div>,
}));

vi.mock('../../../src/pages/Kimo/LoginPage', () => ({
  default: () => <div data-id="kimo-login-page">Login Kimo</div>,
}));

describe('App', () => {
  it('renderiza la portada pública en la ruta raíz', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']} future={routerFuture}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Inicio')).toBeInTheDocument();
    expect(container.querySelector('[data-id="mock-main-layout"]')).toBeInTheDocument();
  });

  it('renderiza la pantalla de login de Kimo en su ruta', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/kimo/login']} future={routerFuture}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Login Kimo')).toBeInTheDocument();
    expect(container.querySelector('[data-id="kimo-login-page"]')).toBeInTheDocument();
  });
});
