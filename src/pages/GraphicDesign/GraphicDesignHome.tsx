import {
  IconPen,
  IconFlyer,
  IconPoster,
  IconLaptop,
  IconBox,
  IconBottle,
} from '../../components/iconos';
import { CategoryCard } from '../../components/ui/CategoryCard';

const CATEGORIES = [
  {
    key: 'branding',
    title: 'Branding & Logotipos',
    description: 'Identidad visual, logotipos y sistemas de marca.',
    icon: IconPen,
  },
  {
    key: 'stationery',
    title: 'Papelería Corporativa',
    description: 'Tarjetas, sobres, carpetas y material corporativo.',
    icon: IconFlyer,
  },
  {
    key: 'posters',
    title: 'Cartelería',
    description: 'Posters, flyers y material promocional.',
    icon: IconPoster,
  },
  {
    key: 'multimedia',
    title: 'Digital & Multimedia',
    description: 'Diseño para vídeo, web y presentaciones.',
    icon: IconLaptop,
  },
  {
    key: 'packaging',
    title: 'Packaging',
    description: 'Envases, etiquetas y diseño de producto.',
    icon: IconBox,
  },
  {
    key: 'other',
    title: 'Proyectos especiales',
    description: 'Proyectos diversos de diseño gráfico.',
    icon: IconBottle,
  },
];

export default function GraphicDesignHome() {
  return (
    <div className="min-h-screen flex flex-col" data-id="graphic-design-home">
      {/* Hero */}
      <section
        className="bg-gradient-to-b from-bg to-surface border-b border-border py-16 px-4 text-center"
        data-id="graphic-design-hero"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ink">Diseño Gráfico</h1>
        <p className="max-w-2xl mx-auto text-lg text-muted mb-6">
          Selecciona una categoría para explorar proyectos de diseño gráfico: branding, papelería,
          cartelería, multimedia, ilustración, packaging y más. Cada sección muestra ejemplos
          reales, procesos y resultados.
        </p>
      </section>

      {/* Categorías en rejilla */}
      <main
        className="flex-1 max-w-5xl mx-auto w-full px-4 py-12"
        data-id="graphic-design-categories"
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          data-id="categories-grid"
        >
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.key}
              icon={category.icon}
              title={category.title}
              description={category.description}
              to={`/graphic-design/${category.key}`}
              hoverColor="#dc2626"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
