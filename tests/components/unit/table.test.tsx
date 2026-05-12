import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../../src/components/compositions/BaseTable';
import ProjectSelectorColumn from '../../../src/components/compositions/ProjectSelectorColumn';

type DemoRow = {
  id: number;
  title: string;
  date: string;
};

describe('table components', () => {
  it('ordena y activa filas en BaseTable', () => {
    // BaseTable encapsula TanStack Table para reutilizar sorting, filas y accesibilidad.
    const onRowClick = vi.fn();
    const onSortingChange = vi.fn();

    const columns: ColumnDef<DemoRow, string>[] = [
      { accessorKey: 'title', header: 'Título', cell: (info) => info.getValue() },
      { accessorKey: 'date', header: 'Fecha', cell: (info) => info.getValue() },
    ];

    render(
      <BaseTable
        data={[
          { id: 1, title: 'B', date: '2024-02-01' },
          { id: 2, title: 'A', date: '2024-01-01' },
        ]}
        columns={columns}
        initialSorting={[{ id: 'title', desc: false }]}
        onRowClick={onRowClick}
        onSortingChange={onSortingChange}
        caption="Tabla de demo"
      />,
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /título/i }));
    expect(onSortingChange).toHaveBeenCalled();

    fireEvent.click(screen.getAllByRole('row')[1]);
    expect(onRowClick).toHaveBeenCalledWith({ id: 1, title: 'B', date: '2024-02-01' });
  });

  it('muestra proyectos seleccionables y ordenados por fecha', () => {
    // ProjectSelectorColumn agrupa proyectos pendientes para seleccionar lotes completos.
    const onToggle = vi.fn();

    render(
      <ProjectSelectorColumn
        title="Diseño"
        color="orange"
        projects={[
          {
            id: 1,
            title: 'Viejo',
            date: '2022-01-01',
            cliente: 'A',
            type: 'x',
            category: 'c',
            isSelected: false,
          },
          {
            id: 2,
            title: 'Nuevo',
            date: '2024-01-01',
            cliente: 'B',
            type: 'x',
            category: 'c',
            isSelected: true,
          },
        ]}
        selectedCount={1}
        onToggle={onToggle}
        dataId="selector-demo"
      />,
    );

    expect(screen.getByText('Nuevo')).toBeInTheDocument();
    expect(screen.getByText('1 seleccionado(s)')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(onToggle).toHaveBeenCalledWith(2);
  });
});
