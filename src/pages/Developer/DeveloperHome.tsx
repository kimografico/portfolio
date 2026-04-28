import { IconCode, IconReact, IconWP } from '../../components/iconos';
import { CategoryCard } from '../../components/ui/CategoryCard';

const CATEGORIES = [
  {
    key: 'wordpress',
    title: 'WordPress',
    description: 'Webs con CMS WordPress: catálogos, tiendas online y portfolios.',
    icon: IconWP,
  },
  {
    key: 'vanilla',
    title: 'Vanilla JS',
    description: 'Webs con HTML, CSS y JavaScript puro, sin frameworks.',
    icon: IconCode,
  },
  {
    key: 'frameworks',
    title: 'Frameworks',
    description: 'Proyectos con React, Vue u otros frameworks modernos.',
    icon: IconReact,
  },
];

export default function DeveloperHome() {
  return (
    <div className="min-h-screen flex flex-col" data-id="developer-home">
      {/* Hero */}
      <section
        className="bg-gradient-to-b from-bg to-surface border-b border-border py-16 px-4 text-center"
        data-id="developer-hero"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ink">Desarrollo Web</h1>
        <p className="max-w-2xl mx-auto text-lg text-muted mb-6">
          Proyectos de desarrollo web: WordPress, JavaScript vanilla y frameworks modernos. Cada
          sección muestra ejemplos reales con capturas, tecnologías utilizadas y descripción del
          proyecto.
        </p>
      </section>

      {/* Categorías */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12" data-id="developer-categories">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8" data-id="categories-grid">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.key}
              icon={category.icon}
              title={category.title}
              description={category.description}
              to={`/dev/${category.key}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
