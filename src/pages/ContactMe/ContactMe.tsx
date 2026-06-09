import HeroSection from '../../components/layout/HeroSection';
import { IconCode, IconPen, IconSpeech } from '../../components/iconos';
import { ContactCard, type ContactCardProps } from '../../components/ui/ContactCard';

const contactCards: ContactCardProps[] = [
  {
    id: 'contact-card-form',
    title: 'Formulario de contacto',
    description:
      'Si ya tienes una idea clara, este es el camino más directo para contarme qué necesitas y qué plazos manejas.',
    href: 'https://forms.gle/jvyMugYjDNhX1f1fA',
    external: true,
    actionLabel: 'Abrir formulario',
    icon: IconSpeech,
  },
  {
    id: 'contact-card-design-cv',
    title: 'Currículum de diseño',
    description:
      'Pensado para revisar mi perfil visual, mis herramientas de trabajo y la parte más creativa de mi trayectoria.',
    href: '/resume/design',
    actionLabel: 'Ver currículum de diseño',
    icon: IconPen,
  },
  {
    id: 'contact-card-dev-cv',
    title: 'Currículum de desarrollo',
    description:
      'Aquí encontrarás una versión más técnica, centrada en frontend, arquitectura de interfaces y proyectos web.',
    href: '/resume/development',
    actionLabel: 'Ver currículum de desarrollo',
    icon: IconCode,
  },
];

export default function ContactMe() {
  return (
    <section className="min-h-screen flex flex-col" data-id="contact-page">
      <HeroSection
        label="Contacto"
        title={
          <>
            Hablemos de <br />
            tu próximo proyecto
          </>
        }
        description="He preparado tres caminos para que elijas el que mejor encaje contigo: un formulario directo para escribirme, una versión de diseño para revisar mi perfil creativo y otra de desarrollo para ver mi lado más técnico."
        image="images/ui/K2.png"
        separator="var(--color-accent)"
      />

      <section
        className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-12 md:py-16"
        data-id="contact-cards-section"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" data-id="contact-cards-grid">
          {contactCards.map((card) => (
            <ContactCard key={card.id} {...card} />
          ))}
        </div>
      </section>
    </section>
  );
}
