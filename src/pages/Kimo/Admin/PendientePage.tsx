import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../../components/compositions/BaseTable';
import { IconVisible } from '../../../components/iconos';
import { type PendingEntry } from '../../../interfaces/adminData';
import { getPendingEntries } from './data/normalization';
import { buildProjectDetailPath } from './data/routes';

const columnHelper = createColumnHelper<PendingEntry>();

export default function PendientePage() {
  const navigate = useNavigate();
  const pendingEntries = useMemo(() => getPendingEntries(), []);

  const columns = useMemo(
    (): ColumnDef<PendingEntry, unknown>[] => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: (info) => <span className="text-sm text-muted">{String(info.getValue())}</span>,
      }) as ColumnDef<PendingEntry, unknown>,
      columnHelper.accessor('title', {
        header: 'Título',
        cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
      }) as ColumnDef<PendingEntry, unknown>,
      columnHelper.accessor('cliente', {
        header: 'Cliente',
        cell: (info) => <span className="text-xs">{info.getValue()}</span>,
      }) as ColumnDef<PendingEntry, unknown>,
      columnHelper.accessor('category', {
        header: 'Categoría',
        cell: (info) => <span className="text-xs">{info.getValue()}</span>,
      }) as ColumnDef<PendingEntry, unknown>,
      columnHelper.display({
        id: 'extras',
        header: 'Extras',
        cell: ({ row }) => {
          const extras = row.original.extras;
          if (Array.isArray(extras) && extras.length > 0) {
            if (extras.length === 1) return <span className="text-xs">{extras[0]}</span>;
            return (
              <ul className="list-disc pl-4 text-xs text-accent">
                {extras.map((ex: string, i: number) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            );
          }
          return <span className="text-muted text-xs">—</span>;
        },
      }) as ColumnDef<PendingEntry, unknown>,
      columnHelper.accessor('date', {
        header: 'Fecha',
        cell: (info) => {
          const raw = info.getValue();
          if (!raw) return <span className="text-muted text-xs">—</span>;
          // Formato: YYYY-MM-DD o YYYY-MM-DD HH:mm
          // Queremos DD/MM/YYYY
          const dateStr = String(raw).slice(0, 10).replace(/-/g, '/');
          const [y, m, d] = dateStr.split('/');
          const formatted = d && m && y ? `${d}/${m}/${y}` : dateStr;
          return <span className="text-xs whitespace-nowrap">{formatted}</span>;
        },
      }) as ColumnDef<PendingEntry, unknown>,
      columnHelper.display({
        id: 'detail',
        header: 'Detalle',
        cell: ({ row }) => {
          const detailPath = buildProjectDetailPath(row.original);
          return (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-border p-2 text-muted transition-colors hover:bg-bg hover:text-ink"
              aria-label={`Ver detalle de ${row.original.title}`}
              title="Ver detalle del proyecto"
              data-id={`pending-detail-btn-${row.original.id}`}
              onClick={(event) => {
                event.stopPropagation();
                if (detailPath) {
                  navigate(detailPath);
                }
              }}
            >
              <IconVisible size={18} strokeWidth={1.8} />
            </button>
          );
        },
        enableSorting: false,
      }),
    ],
    [navigate],
  );

  return (
    <section className="space-y-6 pb-16" data-id="pending-page">
      <header className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-ink">Pendiente</h2>
        <p className="mt-2 text-sm text-muted">
          Proyectos con contenido en extras. Haz clic en una fila para editar el proyecto o usa el
          botón de detalle para abrir su vista pública.
        </p>
        <p className="mt-3 text-xs text-muted">
          Total: <span className="font-semibold">{pendingEntries.length}</span> proyecto(s)
        </p>
      </header>

      <div data-id="pending-table">
        <BaseTable<PendingEntry, unknown>
          data={pendingEntries}
          columns={columns}
          initialSorting={[{ id: 'date', desc: true }]}
          onRowClick={(row) => {
            navigate(`/kimo/edit-project/${row.id}`);
          }}
          emptyMessage="No hay proyectos pendientes con extras."
          caption="Tabla de proyectos pendientes, ordenable por ID, título, cliente, categoría, extras, fecha y acceso al detalle."
        />
      </div>
    </section>
  );
}
