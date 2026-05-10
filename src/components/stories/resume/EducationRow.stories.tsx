import type { Meta, StoryObj } from '@storybook/react-vite';
import EducationRow from '../../resume/EducationRow';

const meta = {
  title: 'resume/EducationRow',
  component: EducationRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onDegreeChange: { table: { disable: true } },
    onInstitutionChange: { table: { disable: true } },
    onStartChange: { table: { disable: true } },
    onEndChange: { table: { disable: true } },
    onToggleVisible: { table: { disable: true } },
    onToggleDesign: { table: { disable: true } },
    onToggleDevelopment: { table: { disable: true } },
    onRemove: { table: { disable: true } },
    dataIdPrefix: { table: { disable: true } },
  },
} satisfies Meta<typeof EducationRow>;

export default meta;

type Story = StoryObj<typeof EducationRow>;

const yearOptions = ['2026', '2025', '2024', '2023', '2022'];

export const Default: Story = {
  args: {
    degree: 'Grado en Comunicación',
    onDegreeChange: () => undefined,
    institution: 'Universidad Demo',
    onInstitutionChange: () => undefined,
    start: '2020',
    onStartChange: () => undefined,
    end: '2024',
    onEndChange: () => undefined,
    visible: true,
    onToggleVisible: () => undefined,
    design: true,
    onToggleDesign: () => undefined,
    development: false,
    onToggleDevelopment: () => undefined,
    onRemove: () => alert('Eliminar curso'),
    dataIdPrefix: 'education-demo',
    yearOptions,
  },
};
