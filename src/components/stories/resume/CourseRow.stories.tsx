import type { Meta, StoryObj } from '@storybook/react-vite';
import CourseRow from '../../resume/CourseRow';
import { ResumeRowPlayground } from './ResumeRowPlayground';

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

export const Playground: Story = {
  render: ResumeRowPlayground(CourseRow, { visible: true, design: true, development: false }),
  args: {
    name: 'Curso de diseño editorial',
    onNameChange: () => undefined,
    institution: 'Escuela Demo',
    onInstitutionChange: () => undefined,
    year: '2024',
    onYearChange: () => undefined,
    visible: true,
    design: true,
    development: false,
    onRemove: () => alert('Eliminar curso'),
    dataIdPrefix: 'course-demo',
    yearOptions,
  },
};
