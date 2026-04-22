import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { Place } from '../../types/places';
import places from '../../data/places.json';

const COUNTRY_FLAGS: Record<string, string> = {
  es: '',
  nl: '🇳🇱',
  fr: '🇫🇷',
  th: '🇹🇭',
  gr: '🇬🇷',
  ie: '🇮🇪',
};

function getFlag(country: string) {
  return COUNTRY_FLAGS[country] || '';
}

export default function PlacesTable() {
  const data = useMemo<Place[]>(() => places, []);

  // Orden inicial: por fecha descendente (más reciente primero)
  const [sorting, setSorting] = useState([{ id: 'date', desc: true }]);

  const columns = useMemo<ColumnDef<Place, any>[]>(
    () => [
      {
        header: 'Ciudad',
        accessorKey: 'city',
        cell: (info) => {
          const value = info.getValue();
          if (typeof value === 'string' && value.toLowerCase().includes('valencia')) {
            return <span className="text-gray-300">{value}</span>;
          }
          return value;
        },
        enableSorting: true,
      },
      {
        header: 'Lugar',
        accessorKey: 'place',
        cell: (info) => <span className="font-bold text-lg">{info.getValue()}</span>,
        enableSorting: true,
      },
      {
        header: 'País',
        accessorKey: 'country',
        cell: (info) => (
          <span className="font-bold text-xl">{getFlag(info.getValue() as string)}</span>
        ),
        enableSorting: true,
      },
      {
        header: 'Fecha',
        accessorKey: 'date',
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        header: 'Personas',
        accessorKey: 'people',
        cell: (info) => (
          <span className="text-xs text-muted-foreground">Kimo, {info.getValue()}</span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-1 text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const isSorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left font-semibold text-muted-foreground select-none cursor-pointer group"
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {canSort && (
                      <span
                        className={
                          'ml-1 transition-colors ' +
                          (isSorted ? 'text-accent' : 'text-gray-300 group-hover:text-gray-400')
                        }
                        aria-label={
                          isSorted === 'asc'
                            ? 'Orden ascendente'
                            : isSorted === 'desc'
                              ? 'Orden descendente'
                              : 'Ordenar'
                        }
                      >
                        {isSorted === 'asc' && '▲'}
                        {isSorted === 'desc' && '▼'}
                        {isSorted === false && '▲'}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="bg-white hover:bg-accent/30">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2 align-top">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
