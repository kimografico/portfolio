import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../../components/compositions/BaseTable';
import { IconVisible } from '../../../components/iconos';
import { buildProjectDetailPath, getPendingEntries, type PendingEntry } from './DataPageHelpers';

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
        cell: (info) => <span className="text-sm">{info.getValue()}</span>,
      }) as ColumnDef<PendingEntry, unknown>,
      columnHelper.accessor('date', {
        header: 'Fecha',
        cell: (info) => {
          const raw = info.getValue();
          return raw ? raw.slice(0, 10) : <span className="text-muted">—</span>;
        },
      }) as ColumnDef<PendingEntry, unknown>,
      columnHelper.accessor('type', {
        header: 'Tipo',
        cell: (info) => <span className="text-sm">{info.getValue()}</span>,
      }) as ColumnDef<PendingEntry, unknown>,
      columnHelper.accessor('category', {
        header: 'Categoría',
        cell: (info) => <span className="text-sm">{info.getValue()}</span>,
      }) as ColumnDef<PendingEntry, unknown>,
      columnHelper.accessor('extrasCount', {
        header: 'Extras',
        cell: (info) => (
          <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-accent/10 px-2 py-1 text-xs font-semibold text-accent">
            {info.getValue()}
          </span>
        ),
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
        />
      </div>
    </section>
  );
}
