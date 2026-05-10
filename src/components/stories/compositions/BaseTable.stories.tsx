import type { Meta, StoryObj } from '@storybook/react-vite';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import BaseTable from '../../compositions/BaseTable';

interface DemoRow {
  id: number;
  title: string;
  category: string;
  year: string;
}

const columnHelper = createColumnHelper<DemoRow>();

const columns: ColumnDef<DemoRow, unknown>[] = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }) as ColumnDef<DemoRow, unknown>,
  columnHelper.accessor('title', {
    header: 'Título',
    cell: (info) => info.getValue(),
  }) as ColumnDef<DemoRow, unknown>,
  columnHelper.accessor('category', {
    header: 'Categoría',
    cell: (info) => info.getValue(),
  }) as ColumnDef<DemoRow, unknown>,
  columnHelper.accessor('year', {
    header: 'Año',
    cell: (info) => info.getValue(),
  }) as ColumnDef<DemoRow, unknown>,
];

const demoData: DemoRow[] = [
  { id: 1, title: 'Proyecto Alpha', category: 'Web', year: '2024' },
  { id: 2, title: 'Proyecto Beta', category: 'Branding', year: '2025' },
  { id: 3, title: 'Proyecto Gamma', category: 'Editorial', year: '2023' },
];

function BaseTableDemo() {
  return (
    <div className="w-full max-w-4xl">
      <BaseTable<DemoRow, unknown>
        data={demoData}
        columns={columns}
        initialSorting={[{ id: 'year', desc: true }]}
      />
    </div>
  );
}

const meta = {
  title: 'compositions/BaseTable',
  component: BaseTableDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof BaseTableDemo>;

export default meta;

type Story = StoryObj<typeof BaseTableDemo>;

export const Default: Story = {};
