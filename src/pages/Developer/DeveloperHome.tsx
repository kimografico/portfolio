import CategoryHomeTemplate from '../../components/compositions/CategoryHomeTemplate';
import { DEVELOPER_CATEGORIES } from '../../data/config/categoryCatalog';

/**
 * DeveloperHome
 *
 * Página de inicio de la sección de Desarrollo Web.
 * Usa CategoryHomeTemplate para unificar la lógica de páginas de categoría.
 *
 * Nota: gridCols es 'grid-cols-1 sm:grid-cols-3' porque Developer tiene solo 3 categorías
 * (frameworks, vanilla, wordpress) y queda mejor en una sola fila en desktop.
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
          'Creo soluciones web modernas, escalables y performantes. Especializado en React, vanilla JavaScript y WordPress. Cada proyecto es diseñado pensando en experiencia de usuario, accesibilidad y calidad de código.',
        image: 'images/ui/K3.png',
        separatorColor: 'var(--color-dev)',
      }}
      categoryHero={{
        title: 'Desarrollo Web',
        description:
          'Proyectos de desarrollo web: WordPress, JavaScript vanilla y frameworks modernos. Cada sección muestra ejemplos reales con capturas, tecnologías utilizadas y descripción del proyecto.',
        dataId: 'developer-hero',
      }}
      categories={DEVELOPER_CATEGORIES}
      categoriesSectionDataId="developer-categories"
      gridCols="grid-cols-1 sm:grid-cols-3"
    />
  );
}
