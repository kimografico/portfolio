import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

import { IconCode, IconPen, IconSpeech } from '../../iconos';
import { ContactCard } from '../../ui/ContactCard';

const meta = {
  title: 'ui/ContactCard',
  component: ContactCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ContactCard>;

export default meta;

type Story = StoryObj<typeof ContactCard>;

export const FormularioContacto: Story = {
  args: {
    id: 'contact-card-form-story',
    title: 'Formulario de contacto',
    description:
      'Un acceso rápido para contarme qué necesitas y empezar a ordenar la idea sin rodeos.',
    href: 'https://forms.gle/jvyMugYjDNhX1f1fA',
    actionLabel: 'Abrir formulario',
    icon: IconSpeech,
    external: true,
  },
};

export const CurriculumDiseno: Story = {
  args: {
    id: 'contact-card-design-cv-story',
    title: 'Currículum de diseño',
    description:
      'Una versión más visual de mi trayectoria, pensada para revisar experiencia creativa, software y proyectos.',
    href: '/resume/design',
    actionLabel: 'Ver currículum de diseño',
    icon: IconPen,
  },
};

export const CurriculumDesarrollo: Story = {
  args: {
    id: 'contact-card-dev-cv-story',
    title: 'Currículum de desarrollo',
    description:
      'Una versión enfocada en el lado técnico, con proyectos, frontend y trabajo orientado a producto.',
    href: '/resume/development',
    actionLabel: 'Ver currículum de desarrollo',
    icon: IconCode,
  },
};
