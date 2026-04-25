import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../components/compositions/BaseTable';
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

  const columns = useMemo<ColumnDef<Place, string | undefined>[]>(
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
      },
      {
        header: 'Lugar',
        accessorKey: 'place',
        cell: (info) => <span className="font-bold text-lg">{info.getValue()}</span>,
      },
      {
        header: 'País',
        accessorKey: 'country',
        cell: (info) => (
          <span className="font-bold text-4xl">{getFlag(info.getValue() as string)}</span>
        ),
      },
      {
        header: 'Fecha',
        accessorKey: 'date',
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

  return (
    <BaseTable<Place, string | undefined>
      data={data}
      columns={columns}
      initialSorting={[{ id: 'date', desc: true }]}
      onRowClick={() => {}}
      emptyMessage="No hay lugares para mostrar."
    />
  );
}
