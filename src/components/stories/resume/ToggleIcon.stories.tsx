import type { Meta, StoryObj } from '@storybook/react-vite';
import ToggleIcon from '../../resume/ToggleIcon';
import IconVisible from '../../iconos/IconVisible';
import IconHidden from '../../iconos/IconHidden';
import { ToggleIconPlayground } from './ResumeRowPlayground';

type Story = StoryObj<typeof ToggleIcon>;

const meta = {
  title: 'resume/ToggleIcon',
  component: ToggleIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'boolean' },
    onChange: { table: { disable: true } },
    dataId: { table: { disable: true } },
    ariaLabelOn: { table: { disable: true } },
    ariaLabelOff: { table: { disable: true } },
  },
} satisfies Meta<typeof ToggleIcon>;

export default meta;

export const Playground: Story = {
  render: (args) => ToggleIconPlayground({ ...args, Component: ToggleIcon }),
  args: {
    value: true,
    icon: IconVisible,
    iconOff: IconHidden,
    colorOn: 'var(--color-cta)',
    size: 32,
    dataId: 'toggle-icon-playground',
    ariaLabelOn: 'Visible',
    ariaLabelOff: 'Oculto',
  },
};
