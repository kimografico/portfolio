import CategoryHomeTemplate from '../../components/compositions/CategoryHomeTemplate';
import { GRAPHIC_DESIGN_CATEGORIES } from '../../data/config/categoryCatalog';

/**
 * GraphicDesignHome
 *
 * Página de inicio de la sección de Diseño Gráfico.
 * Usa CategoryHomeTemplate para unificar la lógica de páginas de categoría.
 *
 * Nota: categoryHoverColor usa el rojo corporativo para diferenciarse de Developer.
 */
export default function GraphicDesignHome() {
  return (
    <CategoryHomeTemplate
      categoryType="GraphicDesign"
      basePath="/graphic-design"
      dataId="graphic-design-home"
      hero={{
        label: 'Diseño Gráfico',
        title: (
          <>
            Diseñador gráfico
            <br />
            afincado en Valencia
          </>
        ),
        description:
          'Diseño soluciones visuales a medida, fusionando estrategia y detalle. Ayudo a marcas a proyectar su esencia con coherencia, desde la identidad hasta la web. Mi objetivo es acompañar la evolución de tu empresa, transformando sus fortalezas en una comunicación impecable.',
        image: 'images/ui/K2.png',
        separatorColor: 'var(--color-design)',
      }}
      categoryHero={{
        title: 'Diseño Gráfico',
        description:
          'Selecciona una categoría para explorar proyectos de diseño gráfico: branding, papelería, cartelería, multimedia, ilustración, packaging y más. Cada sección muestra ejemplos reales, procesos y resultados.',
        dataId: 'graphic-design-hero',
      }}
      categories={GRAPHIC_DESIGN_CATEGORIES}
      categoriesSectionDataId="graphic-design-categories"
      categoryHoverColor="#dc2626"
    />
  );
}
