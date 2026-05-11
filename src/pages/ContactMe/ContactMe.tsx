import '../../styles/components/iconos-contactme.css';
import UIButton from '../../components/ui/UIButton';
import { APP_BASENAME } from '../../data/config/app';

export default function ContactMe() {
  return (
    <section className="min-h-screen" data-id="contact-page">
      <section aria-labelledby="contacto-heading" className="border-b border-border py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 id="contacto-heading" className="text-3xl md:text-4xl font-bold mb-8 text-ink">
            Contacto
          </h1>
          <div className="mb-8 text-muted text-base max-w-2xl">
            <p className="mb-2">
              Puedes escribirme por correo, proponer colaboraciones o simplemente saludar.
            </p>
            <UIButton
              href="https://forms.gle/jvyMugYjDNhX1f1fA"
              solid
              arrow
              data-id="contact-form-link"
            >
              Ir al formulario de contacto
            </UIButton>
            <div className="mt-8">
              <div className="font-semibold mb-2">Versiones de mi Curriculum Vitae</div>
              <div className="flex flex-col gap-3">
                <UIButton href={`${APP_BASENAME}/resume/design`} arrow data-id="cv-design-link">
                  Curriculum Diseñador Gráfico
                </UIButton>
                <UIButton href={`${APP_BASENAME}/resume/development`} arrow data-id="cv-dev-link">
                  Curriculum Desarrollador Frontend
                </UIButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
