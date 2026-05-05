import '../../styles/components/iconos-contactme.css';
import UIButton from '../../components/ui/UIButton';
import { APP_BASENAME } from '../../data/config/app';

export default function ContactMe() {
  return (
    <main className="min-h-screen" data-id="contact-page">
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
              className="mt-5"
              data-id="contact-form-link"
            >
              Ir al formulario de contacto
            </UIButton>
            <div className="mt-8">
              <div className="font-semibold mb-2">Curriculum Vitae</div>
              <div className="flex flex-col gap-3">
                <UIButton
                  href={`${APP_BASENAME}/resume/design`}
                  className="text-link hover:underline self-start"
                  data-id="cv-design-link"
                  arrow
                >
                  Diseñador Gráfico
                </UIButton>
                <UIButton
                  href={`${APP_BASENAME}/resume/development`}
                  className="text-link hover:underline self-start"
                  data-id="cv-dev-link"
                  arrow
                >
                  Desarrollador Frontend
                </UIButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
