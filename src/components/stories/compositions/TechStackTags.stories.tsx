import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TechStackTags from '../../compositions/TechStackTags';

const meta: Meta<typeof TechStackTags> = {
  title: 'Compositions/TechStackTags',
  component: TechStackTags,
};
export default meta;

type Story = StoryObj<typeof TechStackTags>;

const OPTIONS = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Vue',
  'Angular',
  'WordPress',
  'PHP',
  'Node.js',
  'Vite',
  'Prestashop',
];

export const Default: Story = {
  render: () => {
    const [stack, setStack] = useState<string[]>(['React', 'TypeScript']);
    const handleToggle = (tech: string) => {
      setStack((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]));
    };
    const handleAddCustom = (tech: string) => {
      if (tech && !stack.includes(tech)) setStack((prev) => [...prev, tech]);
    };
    return (
      <TechStackTags
        stack={stack}
        options={OPTIONS}
        onToggle={handleToggle}
        onAddCustom={handleAddCustom}
        dataIdBase="storybook-stack"
      />
    );
  },
};
