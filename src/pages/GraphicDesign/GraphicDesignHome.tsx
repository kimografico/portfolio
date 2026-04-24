import { Link } from 'react-router-dom';
import {
  IconPlant,
  IconFlyer,
  IconPoster,
  IconScreen,
  IconBox,
  IconImage,
} from '../../components/iconos';
import './GraphicDesign.css';

const CATEGORIES = [
  {
    key: 'branding',
    title: 'Branding & Logotipos',
    description: 'Identidad visual, logotipos y sistemas de marca.',
    icon: IconPlant,
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
    icon: IconScreen,
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
    icon: IconImage,
  },
];

export default function GraphicDesignHome() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-bg to-surface border-b border-border py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-ink">Diseño Gráfico</h1>
        <p className="max-w-2xl mx-auto text-lg text-muted mb-6">
          Selecciona una categoría para explorar proyectos de diseño gráfico: branding, papelería,
          cartelería, multimedia, ilustración, packaging y más. Cada sección muestra ejemplos
          reales, procesos y resultados.
        </p>
      </section>

      {/* Categorías en rejilla */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {CATEGORIES.map((category) => (
            <Link
              to={`/graphic-design/${category.key}`}
              key={category.key}
              className="group flex flex-col items-center p-8 bg-bg rounded-xl transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span
                className="text-6xl mb-4 transition-transform transition-colors duration-300 ease-out group-hover:scale-150 group-hover:-rotate-6 group-hover:text-red-600"
                aria-hidden="true"
              >
                <category.icon size={96} strokeWidth={0.75} className="icono-categoria" />
              </span>
              <h2 className="text-xl font-semibold text-ink mb-2 group-hover:text-primary transition-colors">
                {category.title}
              </h2>
              <p className="text-sm text-muted text-center">{category.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
