import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import KimoLoginPage from '../../../src/pages/Kimo/LoginPage';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

const navigateMock = vi.hoisted(() => vi.fn());
const searchParamsMock = vi.hoisted(() => new URLSearchParams('redirect=/kimo'));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigateMock,
    useSearchParams: () => [searchParamsMock, vi.fn()],
  };
});

const checkKimoPasswordMock = vi.hoisted(() => vi.fn());
const isKimoAuthenticatedMock = vi.hoisted(() => vi.fn(() => false));
const sanitizeKimoRedirectMock = vi.hoisted(() =>
  vi.fn((redirect: string | null) => redirect || '/kimo'),
);
const setKimoAuthenticatedMock = vi.hoisted(() => vi.fn());

vi.mock('../../../src/lib/kimoAuth', () => ({
  checkKimoPassword: checkKimoPasswordMock,
  isKimoAuthenticated: isKimoAuthenticatedMock,
  sanitizeKimoRedirect: sanitizeKimoRedirectMock,
  setKimoAuthenticated: setKimoAuthenticatedMock,
}));

describe('KimoLoginPage', () => {
  it('muestra el formulario y valida la contraseña vacía', async () => {
    render(
      <MemoryRouter future={routerFuture}>
        <KimoLoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /acceso a kimo/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Introduce una contraseña antes de continuar.',
    );
    expect(checkKimoPasswordMock).not.toHaveBeenCalled();
  });

  it('autentica y navega cuando la contraseña es válida', async () => {
    checkKimoPasswordMock.mockResolvedValue({ isValid: true });

    render(
      <MemoryRouter future={routerFuture}>
        <KimoLoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText(/comprobando/i)).toBeInTheDocument();
    expect(checkKimoPasswordMock).toHaveBeenCalledWith('secret');
    expect(setKimoAuthenticatedMock).toHaveBeenCalledWith(true);
    expect(navigateMock).toHaveBeenCalledWith('/kimo', { replace: true });
  });
});
