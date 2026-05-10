import type { Meta, StoryObj } from '@storybook/react-vite';
import ToggleGroup from '../../resume/ToggleGroup';

const meta = {
  title: 'resume/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onToggleVisible: { table: { disable: true } },
    onToggleDesign: { table: { disable: true } },
    onToggleDevelopment: { table: { disable: true } },
    dataIdPrefix: { table: { disable: true } },
    ariaLabelVisibleOn: { table: { disable: true } },
    ariaLabelVisibleOff: { table: { disable: true } },
    ariaLabelDesignOn: { table: { disable: true } },
    ariaLabelDesignOff: { table: { disable: true } },
    ariaLabelDevOn: { table: { disable: true } },
    ariaLabelDevOff: { table: { disable: true } },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof ToggleGroup>;

export const Default: Story = {
  args: {
    visible: true,
    onToggleVisible: () => undefined,
    design: true,
    onToggleDesign: () => undefined,
    development: false,
    onToggleDevelopment: () => undefined,
    dataIdPrefix: 'toggle-group-demo',
  },
};
