/**
 * Hook personalizado para manejar la ordenación de tablas
 * Elimina lógica duplicada entre BooksTable y PlacesTable
 *
 * Uso:
 * const { sorting, setSorting, onSortingChange } = useTableSorting([{ id: 'dateRead', desc: true }]);
 */

import { useState } from 'react';

import type { SortingState, UseTableSortingOptions } from '../interfaces/table';

export function useTableSorting(options?: UseTableSortingOptions) {
  const defaultSorting = options?.initialSorting ?? [];

  const [sorting, setSorting] = useState<SortingState[]>(defaultSorting);

  const onSortingChange = (
    updater: SortingState[] | ((prev: SortingState[]) => SortingState[]),
  ) => {
    // TanStack Table puede pasar una función updater o un valor directo
    setSorting((currentSorting) =>
      typeof updater === 'function' ? updater(currentSorting) : updater,
    );
  };

  return {
    sorting,
    setSorting,
    onSortingChange,
  };
}
