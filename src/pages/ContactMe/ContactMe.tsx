import {
  IconMail,
  IconUser,
  IconCursor,
  IconBook,
  IconCode,
  IconPalette,
  IconPoster,
  IconFlyer,
  IconPlant,
  IconLaptop,
  IconBox,
  IconBrush,
  IconColors,
  IconBottle,
  IconCoin,
  IconGym,
  IconSkull,
  IconScreen,
  IconPen,
  IconFile,
  IconFingerprint,
  IconSkate,
  IconImage,
} from '../../components/iconos/index';
import './iconos.css';

export default function ContactMe() {
  return (
    <main className="min-h-screen bg-surface">
      <section aria-labelledby="contacto-heading" className="border-b border-border py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 id="contacto-heading" className="text-3xl md:text-4xl font-bold mb-8 text-ink">
            Contacto
          </h1>
          <div className="mb-8 text-muted text-base max-w-2xl">
            Puedes escribirme por correo, proponer colaboraciones o simplemente saludar.
            <br />
            Aquí tienes una galería de todos los iconos disponibles en el proyecto, listos para usar
            como componentes React:
          </div>
          <div className="iconos-demo-grid">
            <div className="iconos-demo-item">
              <IconMail size={48} className="text-primary" />
              <div className="iconos-demo-label">IconMail</div>
            </div>
            <div className="iconos-demo-item">
              <IconUser size={48} className="text-primary" />
              <div className="iconos-demo-label">IconUser</div>
            </div>
            <div className="iconos-demo-item">
              <IconCursor size={48} className="text-primary" />
              <div className="iconos-demo-label">IconCursor</div>
            </div>
            <div className="iconos-demo-item">
              <IconBook size={48} className="text-primary" />
              <div className="iconos-demo-label">IconBook</div>
            </div>
            <div className="iconos-demo-item">
              <IconCode size={48} className="text-primary" />
              <div className="iconos-demo-label">IconCode</div>
            </div>
            <div className="iconos-demo-item">
              <IconPalette size={48} className="text-primary" />
              <div className="iconos-demo-label">IconPalette</div>
            </div>

            <div className="iconos-demo-item">
              <IconPoster size={48} className="text-primary" />
              <div className="iconos-demo-label">IconPoster</div>
            </div>

            <div className="iconos-demo-item">
              <IconFlyer size={48} className="text-primary" />
              <div className="iconos-demo-label">IconFlyer</div>
            </div>
            <div className="iconos-demo-item">
              <IconPlant size={48} className="text-primary" />
              <div className="iconos-demo-label">IconPlant</div>
            </div>
            <div className="iconos-demo-item">
              <IconLaptop size={48} className="text-primary" />
              <div className="iconos-demo-label">IconLaptop</div>
            </div>
            <div className="iconos-demo-item">
              <IconBox size={48} className="text-primary" />
              <div className="iconos-demo-label">IconBox</div>
            </div>
            <div className="iconos-demo-item">
              <IconBrush size={48} className="text-primary" />
              <div className="iconos-demo-label">IconBrush</div>
            </div>
            <div className="iconos-demo-item">
              <IconColors size={48} className="text-primary" />
              <div className="iconos-demo-label">IconColors</div>
            </div>
            <div className="iconos-demo-item">
              <IconBottle size={48} className="text-primary" />
              <div className="iconos-demo-label">IconBottle</div>
            </div>
            <div className="iconos-demo-item">
              <IconCoin size={48} className="text-primary" />
              <div className="iconos-demo-label">IconCoin</div>
            </div>
            <div className="iconos-demo-item">
              <IconGym size={48} className="text-primary" />
              <div className="iconos-demo-label">IconGym</div>
            </div>
            <div className="iconos-demo-item">
              <IconSkull size={48} className="text-primary" />
              <div className="iconos-demo-label">IconSkull</div>
            </div>
            <div className="iconos-demo-item">
              <IconScreen size={48} className="text-primary" />
              <div className="iconos-demo-label">IconScreen</div>
            </div>
            <div className="iconos-demo-item">
              <IconPen size={48} className="text-primary" />
              <div className="iconos-demo-label">IconPen</div>
            </div>
            <div className="iconos-demo-item">
              <IconFile size={48} className="text-primary" />
              <div className="iconos-demo-label">IconFile</div>
            </div>
            <div className="iconos-demo-item">
              <IconFingerprint size={48} className="text-primary" />
              <div className="iconos-demo-label">IconFingerprint</div>
            </div>
            <div className="iconos-demo-item">
              <IconSkate size={48} className="text-primary" />
              <div className="iconos-demo-label">IconSkate</div>
            </div>
            <div className="iconos-demo-item">
              <IconImage size={48} className="text-primary" />
              <div className="iconos-demo-label">IconImage</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
