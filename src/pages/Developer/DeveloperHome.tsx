import CategoryHomeTemplate from '../../components/compositions/CategoryHomeTemplate';
import { DEVELOPER_CATEGORIES } from '../../data/config/categoryCatalog';

/**
 * DeveloperHome
 *
 * Página de inicio de la sección de Desarrollo Web.
 * Usa CategoryHomeTemplate para unificar la lógica de páginas de categoría.
 *
 * Nota: gridCols es 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' porque Developer
 * tiene 4 categorías (legacy, apps, web, experiments) y así caben en una sola
 * fila en desktop.
 */
export default function DeveloperHome() {
  return (
    <CategoryHomeTemplate
      categoryType="Developer"
      basePath="/dev"
      dataId="developer-home"
      hero={{
        label: 'Desarrollo Web',
        title: (
          <>
            Desarrollador
            <br />
            frontend & backend
          </>
        ),
        description:
          'Creo webs, aplicaciones y experiencias digitales. De lo clásico en WordPress y JavaScript a lo moderno con frameworks, pasando por experimentos con nuevas tecnologías. Cada proyecto es diseñado pensando en experiencia de usuario, accesibilidad y calidad de código.',
        image: 'images/ui/K3.png',
        separatorColor: 'var(--color-dev)',
      }}
      categoryHero={{
        title: 'Desarrollo Web',
        description:
          'Proyectos de desarrollo web agrupados por época y tecnología: webs heredadas, aplicaciones modernas, desarrollos recientes y experimentos. Cada sección muestra ejemplos reales con capturas, tecnologías utilizadas y descripción del proyecto.',
        dataId: 'developer-hero',
      }}
      categories={DEVELOPER_CATEGORIES}
      categoriesSectionDataId="developer-categories"
      gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    />
  );
}
