import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import PendientePage from '../../../src/pages/Kimo/Admin/PendientePage';

const navigateMock = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../../../src/pages/Kimo/Admin/data/normalization', () => ({
  getPendingEntries: () => [
    {
      id: '42',
      date: '2026-05-12 00:00',
      title: 'Proyecto pendiente',
      cliente: 'Cliente demo',
      type: 'Diseño Gráfico',
      category: 'Cartelería',
      visible: true,
      extrasCount: 2,
      extras: ['Extra 1', 'Extra 2'],
    },
  ],
}));

vi.mock('../../../src/pages/Kimo/Admin/data/routes', () => ({
  buildProjectDetailPath: () => '/graphic-design/carteleria/42',
}));

describe('PendientePage', () => {
  it('renderiza la tabla de pendientes y navega al detalle o a la edición', async () => {
    render(
      <MemoryRouter>
        <PendientePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /pendiente/i })).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.textContent === 'Total: 1 proyecto(s)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Proyecto pendiente')).toBeInTheDocument();
    expect(screen.getByText('Cliente demo')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ver detalle de proyecto pendiente/i }));
    expect(navigateMock).toHaveBeenCalledWith('/graphic-design/carteleria/42');

    navigateMock.mockClear();

    fireEvent.click(screen.getByText('Proyecto pendiente'));
    expect(navigateMock).toHaveBeenCalledWith('/kimo/edit-project/42');
  });
});
