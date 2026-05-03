import '../../styles/components/iconos-contactme.css';
import UIButton from '../../components/ui/UIButton';

export default function ContactMe() {
  return (
    <main className="min-h-screen bg-surface" data-id="contact-page">
      <section aria-labelledby="contacto-heading" className="border-b border-border py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 id="contacto-heading" className="text-3xl md:text-4xl font-bold mb-8 text-ink">
            Contacto
          </h1>
          <div className="mb-8 text-muted text-base max-w-2xl">
            Puedes escribirme por correo, proponer colaboraciones o simplemente saludar.
            <UIButton
              href="https://forms.gle/jvyMugYjDNhX1f1fA"
              arrow
              className="inline-block mt-5"
            >
              Ir al formulario de contacto
            </UIButton>
          </div>
        </div>
      </section>
    </main>
  );
}
