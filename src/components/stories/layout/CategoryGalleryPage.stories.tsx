import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import CategoryGalleryPage from '../../layout/CategoryGalleryPage';
import { IconPlant } from '../../iconos/IconPlant';
import { IconCode } from '../../iconos/IconCode';
import type { BaseProject } from '../../../interfaces/project';

const meta = {
  title: 'layout/CategoryGalleryPage',
  component: CategoryGalleryPage,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CategoryGalleryPage>;

export default meta;

type Story = StoryObj<typeof CategoryGalleryPage>;

const projects: BaseProject[] = [
  {
    id: 49,
    date: '2025-04-10',
    title: 'Proyecto editorial demo',
    cliente: 'Cliente A',
  },
  {
    id: 48,
    date: '2024-11-22',
    title: 'Proyecto de branding demo',
    cliente: 'Cliente B',
  },
];

export const GraphicDesign: Story = {
  args: {
    projects,
    basePath: '/graphic-design/demo',
    title: 'Diseño Gráfico',
    description: 'Selección de proyectos visuales y editoriales.',
    icon: IconPlant,
    color: 'var(--color-design)',
    opacity: 0.25,
    backLink: '/kimo',
    backLinkText: 'Volver a Kimo',
    IconFallback: IconCode,
    webProject: false,
    widescreen: false,
    emptyStateDescription: 'Aquí aparecerán proyectos de ejemplo.',
    dataIdPrefix: 'gallery-demo',
  },
};
