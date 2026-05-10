import type { Meta, StoryObj } from '@storybook/react-vite';
import WorkshopRow from '../../resume/WorkshopRow';

const meta = {
  title: 'resume/WorkshopRow',
  component: WorkshopRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onNameChange: { table: { disable: true } },
    onYearChange: { table: { disable: true } },
    onToggleVisible: { table: { disable: true } },
    onToggleDesign: { table: { disable: true } },
    onToggleDevelopment: { table: { disable: true } },
    onRemove: { table: { disable: true } },
    dataIdPrefix: { table: { disable: true } },
  },
} satisfies Meta<typeof WorkshopRow>;

export default meta;

type Story = StoryObj<typeof WorkshopRow>;

const yearOptions = ['2026', '2025', '2024', '2023', '2022'];

export const Default: Story = {
  args: {
    name: 'Workshop de branding',
    onNameChange: () => undefined,
    year: '2024',
    onYearChange: () => undefined,
    visible: true,
    onToggleVisible: () => undefined,
    design: true,
    onToggleDesign: () => undefined,
    development: false,
    onToggleDevelopment: () => undefined,
    onRemove: () => alert('Eliminar curso'),
    dataIdPrefix: 'workshop-demo',
    yearOptions,
  },
};
