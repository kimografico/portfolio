import type { Meta, StoryObj } from '@storybook/react-vite';
import SoftwareRow from '../../resume/SoftwareRow';

const meta = {
  title: 'resume/SoftwareRow',
  component: SoftwareRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onNameChange: { table: { disable: true } },
    onToggleVisible: { table: { disable: true } },
    onToggleDesign: { table: { disable: true } },
    onToggleDevelopment: { table: { disable: true } },
    onRemove: { table: { disable: true } },
    dataIdPrefix: { table: { disable: true } },
  },
} satisfies Meta<typeof SoftwareRow>;

export default meta;

type Story = StoryObj<typeof SoftwareRow>;

export const Default: Story = {
  args: {
    name: 'Figma',
    onNameChange: () => undefined,
    visible: true,
    onToggleVisible: () => undefined,
    design: true,
    onToggleDesign: () => undefined,
    development: false,
    onToggleDevelopment: () => undefined,
    onRemove: () => alert('Eliminar curso'),
    dataIdPrefix: 'software-demo',
  },
};
