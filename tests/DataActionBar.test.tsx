import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DataActionBar from '../src/components/compositions/DataActionBar';

describe('DataActionBar', () => {
  it('renderiza las acciones y el contador de selección', () => {
    const onMarkHidden = vi.fn();
    const onMarkVisible = vi.fn();
    const onDelete = vi.fn();
    const onCancel = vi.fn();

    render(
      <DataActionBar
        selectedCount={3}
        loading={false}
        error=""
        onMarkHidden={onMarkHidden}
        onMarkVisible={onMarkVisible}
        onDelete={onDelete}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByText('3 proyectos seleccionados')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '○ Ocultos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '● Visibles' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  it('muestra estado de carga y error', () => {
    render(
      <DataActionBar
        selectedCount={1}
        loading
        error="Error al eliminar"
        onMarkHidden={vi.fn()}
        onMarkVisible={vi.fn()}
        onDelete={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText('Guardando…')).toBeInTheDocument();
    expect(screen.getByText('❌ Error al eliminar. ¿El backend está activo?')).toBeInTheDocument();
  });
});
