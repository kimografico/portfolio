/**
 * Hook personalizado para manejar la ordenación de tablas
 * Elimina lógica duplicada entre BooksTable y PlacesTable
 *
 * Uso:
 * const { sorting, setSorting, onSortingChange } = useTableSorting([{ id: 'dateRead', desc: true }]);
 */

import { useState } from 'react';

export interface SortingState {
  id: string;
  desc: boolean;
}

interface UseTableSortingOptions {
  initialSorting?: SortingState[];
}

export function useTableSorting(options?: UseTableSortingOptions) {
  const defaultSorting = options?.initialSorting ?? [];

  const [sorting, setSorting] = useState<SortingState[]>(defaultSorting);

  const onSortingChange = (
    updater: SortingState[] | ((prev: SortingState[]) => SortingState[]),
  ) => {
    // TanStack Table puede pasar una función updater o un valor directo
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(newSorting);
  };

  return {
    sorting,
    setSorting,
    onSortingChange,
  };
}
