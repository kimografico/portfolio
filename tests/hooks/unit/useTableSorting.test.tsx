import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTableSorting } from '../../../src/hooks/useTableSorting';

describe('useTableSorting', () => {
  it('arranca con el sorting inicial y acepta actualizaciones directas o funcionales', () => {
    // Este hook encapsula el estado de ordenación para reutilizarlo entre tablas.
    const { result } = renderHook(() =>
      useTableSorting({ initialSorting: [{ id: 'date', desc: true }] }),
    );

    expect(result.current.sorting).toEqual([{ id: 'date', desc: true }]);

    act(() => {
      result.current.onSortingChange([{ id: 'title', desc: false }]);
    });

    expect(result.current.sorting).toEqual([{ id: 'title', desc: false }]);

    act(() => {
      result.current.onSortingChange((current) =>
        current.map((item) => ({ ...item, desc: !item.desc })),
      );
    });

    expect(result.current.sorting).toEqual([{ id: 'title', desc: true }]);
  });
});
