import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MobileMenu from '../../../src/components/ui/MobileMenu';
import KimoAuthGate from '../../../src/components/layout/KimoAuthGate';
import ScrollToTop from '../../../src/components/layout/ScrollToTop';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

vi.mock('../../../src/lib/kimoAuth', () => ({
  isKimoAuthenticated: vi.fn(() => false),
  sanitizeKimoRedirect: vi.fn((redirect: string | null) => redirect || '/kimo'),
}));

afterEach(() => {
  vi.useRealTimers();
});

describe('navigation and auth helpers', () => {
  it('abre y cierra el menú móvil con sus enlaces', () => {
    // MobileMenu evita navegar fuera de contexto y cierra el panel al seleccionar una ruta.
    vi.useFakeTimers();
    render(
      <MemoryRouter future={routerFuture}>
        <MobileMenu
          navLinks={[
            { label: 'Inicio', href: '/' },
            { label: 'Contacto', href: '/contacto' },
          ]}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /abrir menú/i }));
    expect(screen.getByRole('navigation', { name: /menú móvil/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('link', { name: 'Contacto' }));
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.queryByRole('navigation', { name: /menú móvil/i })).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('redirige al login cuando Kimo no está autenticado', async () => {
    // El guard protege las rutas privadas y deja una redirección limpia al login.
    render(
      <MemoryRouter initialEntries={['/kimo/data?x=1']} future={routerFuture}>
        <Routes>
          <Route path="/kimo/login" element={<div>Pantalla de login</div>} />
          <Route path="/kimo/*" element={<KimoAuthGate />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Pantalla de login')).toBeInTheDocument();
  });

  it('ejecuta el scroll al inicio cuando cambia la ruta', () => {
    // ScrollToTop encapsula un comportamiento global que debe activarse en cada navegación.
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

    render(
      <MemoryRouter initialEntries={['/inicio']} future={routerFuture}>
        <ScrollToTop />
      </MemoryRouter>,
    );

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
  });
});
