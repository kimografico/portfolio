import type { Meta, StoryObj } from '@storybook/react-vite';
import BasicsAreaFields from '../../resume/BasicsAreaFields';
import type { ResumeBasicsArea } from '../../../interfaces/resume';

const meta = {
  title: 'resume/BasicsAreaFields',
  component: BasicsAreaFields,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onFieldChange: { table: { disable: true } },
  },
} satisfies Meta<typeof BasicsAreaFields>;

export default meta;

type Story = StoryObj<typeof BasicsAreaFields>;

const exampleData: ResumeBasicsArea = {
  title: 'Diseño gráfico',
  summary: 'Perfil centrado en branding, editorial y piezas visuales.',
  additionalInfo: 'Experiencia en identidad visual, cartelería y packaging.',
};

export const Design: Story = {
  args: {
    area: 'design',
    data: exampleData,
    onFieldChange: () => undefined,
  },
};

export const Development: Story = {
  args: {
    area: 'development',
    data: {
      title: 'Desarrollo web',
      summary: 'Perfil orientado a frontend y experiencias interactivas.',
      additionalInfo: 'Trabajo con React, Vite y TypeScript.',
    },
    onFieldChange: () => undefined,
  },
};
