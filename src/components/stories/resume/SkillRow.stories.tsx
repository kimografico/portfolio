import type { Meta, StoryObj } from '@storybook/react-vite';
import SkillRow from '../../resume/SkillRow';

const meta = {
  title: 'resume/SkillRow',
  component: SkillRow,
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
} satisfies Meta<typeof SkillRow>;

export default meta;

type Story = StoryObj<typeof SkillRow>;

export const Default: Story = {
  args: {
    name: 'Dirección de arte',
    onNameChange: () => undefined,
    visible: true,
    onToggleVisible: () => undefined,
    design: true,
    onToggleDesign: () => undefined,
    development: false,
    onToggleDevelopment: () => undefined,
    onRemove: () => alert('Eliminar curso'),
    dataIdPrefix: 'skill-demo',
  },
};
