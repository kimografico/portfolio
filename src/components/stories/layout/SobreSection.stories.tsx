import type { Meta, StoryObj } from '@storybook/react-vite';
import AboutSection from '../../layout/SobreSection';

const meta = {
  title: 'layout/SobreSection',
  component: AboutSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AboutSection>;

export default meta;

type Story = StoryObj<typeof AboutSection>;

export const Default: Story = {
  args: {
    label: 'Sobre mí',
    heading: 'Diseño y desarrollo con foco en detalle y claridad.',
    description:
      'Un espacio para explicar experiencia, enfoque de trabajo y tipo de proyectos que se realizan.',
  },
};
