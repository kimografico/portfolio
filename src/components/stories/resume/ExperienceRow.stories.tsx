import type { Meta, StoryObj } from '@storybook/react-vite';
import ExperienceRow from '../../resume/ExperienceRow';

const meta = {
  title: 'resume/ExperienceRow',
  component: ExperienceRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onRoleChange: { table: { disable: true } },
    onCompanyChange: { table: { disable: true } },
    onStartChange: { table: { disable: true } },
    onEndChange: { table: { disable: true } },
    onDescriptionChange: { table: { disable: true } },
    onToggleVisible: { table: { disable: true } },
    onToggleDesign: { table: { disable: true } },
    onToggleDevelopment: { table: { disable: true } },
    onRemove: { table: { disable: true } },
    dataIdPrefix: { table: { disable: true } },
  },
} satisfies Meta<typeof ExperienceRow>;

export default meta;

type Story = StoryObj<typeof ExperienceRow>;

const yearOptions = ['2026', '2025', '2024', '2023', '2022'];

export const Default: Story = {
  args: {
    role: 'Diseñador gráfico',
    onRoleChange: () => undefined,
    company: 'Estudio Demo',
    onCompanyChange: () => undefined,
    start: '2021',
    onStartChange: () => undefined,
    end: '2025',
    onEndChange: () => undefined,
    description: 'Responsable de identidad visual, campañas y piezas impresas.',
    onDescriptionChange: () => undefined,
    visible: true,
    onToggleVisible: () => undefined,
    design: true,
    onToggleDesign: () => undefined,
    development: false,
    onToggleDevelopment: () => undefined,
    onRemove: () => alert('Eliminar curso'),
    dataIdPrefix: 'experience-demo',
    yearOptions,
  },
};
