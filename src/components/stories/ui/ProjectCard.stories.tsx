import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProjectCard } from '../../ui/ProjectCard';
import { IconReact } from '../../iconos/IconReact';
import { LogoJS } from '../../iconos/LogoJS';
import { LogoHTML } from '../../iconos/IconHTML';
import { LogoWordpress } from '../../iconos/LogoWordpress';
import { MemoryRouter } from 'react-router-dom';

const stackIconMap = {
  REACT: IconReact,
  JS: LogoJS,
  HTML: LogoHTML,
  WP: LogoWordpress,
};

const meta: Meta<typeof ProjectCard> = {
  title: 'ui/ProjectCard',
  component: ProjectCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ProjectCard>;

const exampleProject = {
  id: '1',
  date: '2024-05-08',
  title: 'Portfolio Kimografico',
  cliente: 'Kimografico',
  imagenes: [{ image: 'portfolio-demo.jpg', label: 'Demo' }],
  stack: ['REACT', 'JS', 'HTML', 'WP'],
};

export const Default: Story = {
  args: {
    project: exampleProject,
    to: '/proyectos/demo',
    stackIconMap,
    webProject: true,
    dataId: 'project-card-demo',
    IconFallback: LogoJS,
    widescreen: false,
  },
};

export const Widescreen: Story = {
  args: {
    ...Default.args,
    widescreen: true,
  },
};

export const SinStack: Story = {
  args: {
    ...Default.args,
    project: { ...exampleProject, stack: undefined },
    webProject: false,
  },
};
