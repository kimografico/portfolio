import type { Meta, StoryObj } from '@storybook/react-vite';
import ProjectSelectorColumn from '../../compositions/ProjectSelectorColumn';

interface DemoProject {
  id: number | string;
  date: string;
  title: string;
  cliente: string;
  type: string;
  category: string;
  isSelected: boolean;
  [key: string]: unknown;
}

const meta = {
  title: 'compositions/ProjectSelectorColumn',
  component: ProjectSelectorColumn,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    dataId: { table: { disable: true } },
    IconFallback: { table: { disable: true } },
    buildImagePath: { table: { disable: true } },
    onToggle: { table: { disable: true } },
  },
} satisfies Meta<typeof ProjectSelectorColumn>;

export default meta;

type Story = StoryObj<typeof ProjectSelectorColumn>;

const projects: DemoProject[] = [
  {
    id: 1,
    date: '2025-04-10',
    title: 'Branding Demo',
    cliente: 'Cliente A',
    type: 'gd',
    category: 'logotipos',
    isSelected: true,
  },
  {
    id: 2,
    date: '2024-06-18',
    title: 'Web Demo',
    cliente: 'Cliente B',
    type: 'dev',
    category: 'react',
    isSelected: false,
  },
  {
    id: 3,
    date: '2023-11-03',
    title: 'Editorial Demo',
    cliente: 'Cliente C',
    type: 'gd',
    category: 'editorial',
    isSelected: true,
  },
];

export const Developer: Story = {
  args: {
    title: 'Developer',
    color: 'blue',
    projects,
    selectedCount: 2,
    onToggle: () => undefined,
    dataId: 'selector-column-dev',
  },
};

export const GraphicDesign: Story = {
  args: {
    title: 'Diseño Gráfico',
    color: 'orange',
    projects,
    selectedCount: 2,
    onToggle: () => undefined,
    dataId: 'selector-column-gd',
  },
};
