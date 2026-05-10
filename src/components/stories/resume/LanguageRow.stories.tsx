import type { Meta, StoryObj } from '@storybook/react-vite';
import LanguageRow from '../../resume/LanguageRow';
import { ResumeRowPlayground } from './ResumeRowPlayground';

const meta = {
  title: 'resume/LanguageRow',
  component: LanguageRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onNameChange: { table: { disable: true } },
    onLevelChange: { table: { disable: true } },
    onToggleVisible: { table: { disable: true } },
    onToggleDesign: { table: { disable: true } },
    onToggleDevelopment: { table: { disable: true } },
    onRemove: { table: { disable: true } },
    dataIdPrefix: { table: { disable: true } },
  },
} satisfies Meta<typeof LanguageRow>;

export default meta;

type Story = StoryObj<typeof LanguageRow>;

export const Playground: Story = {
  render: ResumeRowPlayground(LanguageRow, { visible: true, design: false, development: true }),
  args: {
    name: 'Inglés',
    onNameChange: () => undefined,
    level: 'C1',
    onLevelChange: () => undefined,
    visible: true,
    design: false,
    development: true,
    onRemove: () => alert('Eliminar curso'),
    dataIdPrefix: 'language-demo',
  },
};
