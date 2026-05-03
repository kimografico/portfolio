import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import IllustrationsGallery from './IllustrationsGallery';
import illustrations from '../../../data/kimo/illustrations.json';

export default function IllustrationsPage() {
  const navigate = useNavigate();
  const data = useMemo(() => illustrations, []);

  const handleSelectIllustration = (id: string) => {
    navigate(`/kimo/ilustraciones/${id}`);
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Sección principal */}
      <section className="border-b border-border" data-id="illustrations-page">
        <div className="max-w-7xl mx-auto py-16 md:py-24">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter leading-none text-ink mb-6">
              Ilustraciones
            </h1>
            <p className="text-base leading-relaxed text-muted max-w-[52ch]">
              Trabajos de ilustración y diseño visual. Identidades, carteles, portadas y exploración
              de conceptos visuales.
            </p>
          </div>

          {/* Galería */}
          <IllustrationsGallery
            illustrations={data}
            onSelectIllustration={handleSelectIllustration}
          />
        </div>
      </section>
    </div>
  );
}
