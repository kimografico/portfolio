import type { Meta, StoryObj } from '@storybook/react-vite';
import SoftwareRow from '../../resume/SoftwareRow';
import { ResumeRowPlayground } from './ResumeRowPlayground';

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

export const Playground: Story = {
  render: ResumeRowPlayground(SoftwareRow, { visible: true, design: true, development: false }),
  args: {
    name: 'Figma',
    onNameChange: () => undefined,
    visible: true,
    design: true,
    development: false,
    onRemove: () => alert('Eliminar curso'),
    dataIdPrefix: 'software-demo',
  },
};
