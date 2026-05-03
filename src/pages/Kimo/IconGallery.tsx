import * as iconos from '../../components/iconos/index';
import '../../styles/components/iconos.css';

export default function IconGallery() {
  return (
    <section aria-labelledby="icon-gallery-heading" className="py-8" data-id="icon-gallery">
      <h2 id="icon-gallery-heading" className="text-2xl font-bold mb-6 text-ink">
        Galería de iconos
      </h2>
      <div className="mb-6 text-muted text-base max-w-2xl">
        Todos los iconos disponibles en el proyecto, listos para usar como componentes React:
      </div>
      <div className="iconos-demo-grid" data-id="icon-gallery-grid">
        {Object.entries(iconos).map(([name, Icon]) => (
          <div className="iconos-demo-item" key={name}>
            <Icon size={48} strokeWidth={1.25} className="text-primary" />
            <div className="iconos-demo-label">{name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
