import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../../components/compositions/BaseTable';
import type { Place } from '../../../interfaces/place';
import places from '../../../data/kimo/places.json';

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
            return <span className="font-medium text-ink">{value}</span>;
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
        cell: (info) => {
          const country = (info.getValue() as string)?.toLowerCase();
          if (!country || country === 'es') return null;
          return <span className={`fi fi-${country} text-2xl`} />;
        },
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
    <div data-id="places-table-wrapper">
      <BaseTable<Place, string | undefined>
        data={data}
        columns={columns}
        initialSorting={[{ id: 'date', desc: true }]}
        emptyMessage="No hay lugares para mostrar."
        caption="Tabla de lugares visitados, ordenable por ciudad, lugar, país, fecha y personas."
      />
    </div>
  );
}
