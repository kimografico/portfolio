// Tipo genérico para valores de celda en tablas (puede ser string, number, boolean, null, undefined, ReactNode...)
export type TableCellValue = string | number | boolean | null | undefined | object;
export interface SortingState {
  id: string;
  desc: boolean;
}

export interface UseTableSortingOptions {
  initialSorting?: SortingState[];
}
