import { describe, expect, it } from 'vitest';
import {
  applyFilters,
  buildProjectDetailPath,
  calculateDuplicateIds,
  getCategoryOptions,
  getClienteOptions,
  getEntriesWithExtras,
  getPendingEntries,
} from '../../../src/pages/Kimo/Admin/DataPageHelpers';
import type { DataEntry, FilterOptions } from '../../../src/interfaces/adminData';

describe('admin data helpers', () => {
  it('ordena entradas pendientes y detecta extras', () => {
    // El panel de administración depende de estas listas para mostrar trabajo pendiente y duplicados.
    const pendingEntries = getPendingEntries();
    const entriesWithExtras = getEntriesWithExtras();

    expect(pendingEntries.length).toBeGreaterThan(0);
    expect(entriesWithExtras.length).toBeGreaterThan(0);
    expect(pendingEntries[0].date >= pendingEntries[pendingEntries.length - 1].date).toBe(true);
  });

  it('devuelve categorías y clientes relevantes del catálogo', () => {
    // Estas opciones alimentan filtros de la UI y deben ser únicas y estables.
    const developmentCategories = getCategoryOptions('Desarrollo');
    const graphicCategories = getCategoryOptions('Diseño Gráfico');
    const clientes = getClienteOptions('Desarrollo', '');

    expect(developmentCategories).toContain('WordPress');
    expect(graphicCategories).toContain('Editorial');
    expect(clientes).toContain('OTROS');
    expect(clientes.filter((cliente) => cliente !== 'OTROS')).toEqual(
      [...clientes.filter((cliente) => cliente !== 'OTROS')].sort(),
    );
  });

  it('filtra entradas y calcula duplicados', () => {
    // El filtrado combina visibilidad, tipo, categoría y cliente, igual que en el panel real.
    const entries: DataEntry[] = [
      {
        id: 1,
        date: '2024-01-01',
        title: 'A',
        cliente: 'Cliente 1',
        type: 'Desarrollo',
        category: 'WordPress',
        visible: true,
      },
      {
        id: 2,
        date: '2024-01-02',
        title: 'B',
        cliente: 'Cliente 2',
        type: 'Desarrollo',
        category: 'WordPress',
        visible: false,
      },
      {
        id: 3,
        date: '2024-01-02',
        title: 'C',
        cliente: 'Cliente 2',
        type: 'Desarrollo',
        category: 'WordPress',
        visible: true,
      },
      {
        id: 3,
        date: '2024-01-03',
        title: 'D',
        cliente: 'Cliente 3',
        type: 'Diseño Gráfico',
        category: 'Editorial',
        visible: true,
      },
    ];

    const options: FilterOptions = {
      filterType: 'Desarrollo',
      filterCategory: 'WordPress',
      filterCliente: '',
      filterVisibility: 'all',
      localVisibility: { 2: true },
    };

    expect(applyFilters(entries, options)).toEqual([entries[0], entries[1], entries[2]]);
    expect(calculateDuplicateIds(entries)).toEqual(['3']);
  });

  it('construye rutas de detalle para cada tipo de proyecto', () => {
    // La navegación del admin se apoya en estas rutas derivadas del catálogo.
    expect(buildProjectDetailPath({ id: 12, type: 'Desarrollo', category: 'WordPress' })).toBe(
      '/dev/wordpress/12',
    );
    expect(buildProjectDetailPath({ id: 34, type: 'Diseño Gráfico', category: 'Editorial' })).toBe(
      '/graphic-design/editorial/34',
    );
    expect(buildProjectDetailPath({ id: 99, type: 'Otro' as never, category: 'X' })).toBeNull();
  });
});
