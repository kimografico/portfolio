import type { Meta, StoryObj } from '@storybook/react-vite';
import PrevNextBtns from '../../ui/PrevNextBtns';

const meta = {
  title: 'ui/PrevNextBtns',
  component: PrevNextBtns,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disabledPrev: {
      control: 'boolean',
    },
    disabledNext: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof PrevNextBtns>;

export default meta;

type Story = StoryObj<typeof PrevNextBtns>;

export const Default: Story = {
  args: {
    onPrev: () => undefined,
    onNext: () => undefined,
    disabledPrev: false,
    disabledNext: false,
  },
};

export const WithDisabledPrev: Story = {
  args: {
    onPrev: () => undefined,
    onNext: () => undefined,
    disabledPrev: true,
    disabledNext: false,
  },
};

export const WithBothDisabled: Story = {
  args: {
    onPrev: () => undefined,
    onNext: () => undefined,
    disabledPrev: true,
    disabledNext: true,
  },
};
