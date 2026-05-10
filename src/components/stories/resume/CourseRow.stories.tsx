import type { Meta, StoryObj } from '@storybook/react-vite';
import CourseRow from '../../resume/CourseRow';

const meta = {
  title: 'resume/CourseRow',
  component: CourseRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onNameChange: { table: { disable: true } },
    onInstitutionChange: { table: { disable: true } },
    onYearChange: { table: { disable: true } },
    onToggleVisible: { table: { disable: true } },
    onToggleDesign: { table: { disable: true } },
    onToggleDevelopment: { table: { disable: true } },
    onRemove: { table: { disable: true } },
    dataIdPrefix: { table: { disable: true } },
  },
} satisfies Meta<typeof CourseRow>;

export default meta;

type Story = StoryObj<typeof CourseRow>;

const yearOptions = ['2026', '2025', '2024', '2023', '2022'];

export const Default: Story = {
  args: {
    name: 'Curso de diseño editorial',
    onNameChange: () => undefined,
    institution: 'Escuela Demo',
    onInstitutionChange: () => undefined,
    year: '2024',
    onYearChange: () => undefined,
    visible: true,
    onToggleVisible: () => undefined,
    design: true,
    onToggleDesign: () => undefined,
    development: false,
    onToggleDevelopment: () => alert('Toggle development'),
    onRemove: () => alert('Eliminar curso'),
    dataIdPrefix: 'course-demo',
    yearOptions,
  },
};
