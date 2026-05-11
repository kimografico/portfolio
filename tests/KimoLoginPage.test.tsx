import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';

describe('KimoLoginPage', () => {
  beforeEach(() => {
    window.localStorage.removeItem('kimo-authenticated');
  });

  it('muestra el login al entrar en una ruta protegida sin sesión', async () => {
    render(
      <MemoryRouter initialEntries={['/kimo/data']}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: /acceso a kimo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });
});
