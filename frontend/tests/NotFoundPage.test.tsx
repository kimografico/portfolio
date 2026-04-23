import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from '../src/pages/NotFoundPage';

describe('NotFoundPage', () => {
  it('muestra el mensaje de 404 y el botón de volver', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Esta ruta no existe.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toBeInTheDocument();
  });
});
