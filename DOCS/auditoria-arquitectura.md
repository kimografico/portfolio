## 📐 Informe de Auditoría — Arquitectura

### Resumen ejecutivo

La arquitectura está bien encaminada: hay una separación clara entre capas de presentación, composición y layout, el enrutado principal está centralizado y la gestión de datos se apoya en JSON estáticos con utilidades compartidas. También hay buenas señales de mantenibilidad, como `data-id` semánticos, Storybook y componentes reutilizables.

Los puntos más delicados están en la zona privada `/kimo` y en la capa de datos: el panel administrativo no está realmente protegido, y varias piezas de normalización y renderizado mezclan demasiadas responsabilidades en un mismo módulo. En conjunto, es una base sólida para un portfolio, pero todavía necesita endurecer la seguridad del espacio privado y reducir el acoplamiento en la capa de datos.

### ✅ Puntos fuertes

- Separación coherente de capas de UI en `layout`, `ui` y `compositions`, visible en componentes como MainLayout.tsx, MainHeader.tsx y BaseTable.tsx.
- Enrutado principal centralizado y legible en App.tsx, con generación dinámica de galerías a partir de configuración.
- Capa de datos estática simple y predecible: JSONs en data más helpers de rutas e imágenes en imagePathHelper.ts y app.ts.
- Tema claro/oscuro bien encapsulado en `useTheme()`, con sincronización global entre consumidores en useTheme.ts.
- Uso consistente de componentes reutilizables como `HeroSection`, `CategoryHero`, `ProjectCard`, `ProjectLine`, `EmptyState`, `UIButton` e `ImageLightbox`, con convención de `data-id` útil para E2E.
- Storybook está integrado y hay stories representativas para `ui`, `layout`, `compositions` y `resume`, lo que ayuda a validar comportamiento visual y variantes.
- El sistema de tablas con TanStack Table está centralizado en `BaseTable`, reduciendo duplicación y facilitando ordenación uniforme.
- La parte pública de diseño y desarrollo está bastante estandarizada gracias a las configuraciones en graphicDesignGalleries.tsx y developerGalleries.tsx.

### Hallazgos

#### 🔴 Blockers (corregir antes de publicar el portfolio)

- **Archivo/módulo**: App.tsx, KimoLayout.tsx, DataPage.tsx
  - **Problema**: la sección `/kimo` y, especialmente, las rutas administrativas no están protegidas. El acceso se oculta en la navegación y se marca como “privado”, pero cualquiera con la URL puede entrar.
  - **Por qué importa**: el panel expone funciones de gestión y escritura; en un portfolio público eso supone riesgo de manipulación de contenido y da una sensación falsa de privacidad.
  - **Cómo corregirlo**: introducir un guard de ruta real para `/kimo` y separar claramente el espacio de administración del espacio personal de consulta. Como mínimo, bloquear `DataPage`, `AddProjectPage`, `EditProjectPage`, `RecentWorksManagerPage` y `ResumeManagerPage` con una comprobación de sesión o token; idealmente, añadir autenticación real en frontend y backend.

- **Archivo/módulo**: DataPageHelpers.ts
  - **Problema**: este módulo concentra demasiadas responsabilidades: importa todos los JSON, normaliza datos, calcula duplicados, genera rutas de detalle, filtra entradas y produce la lista de “pendientes”. Además usa `any` de forma explícita.
  - **Por qué importa**: el acoplamiento aumenta el coste de mantenimiento y dificulta testear o extender la capa de datos sin romper otras piezas. El uso de `any` debilita la garantía del sistema de tipos justo en el núcleo del contenido.
  - **Cómo corregirlo**: dividir en módulos más pequeños: normalización, resolución de rutas, filtros y cálculos auxiliares. Definir tipos intermedios explícitos para cada fuente de datos y eliminar `any` sustituyéndolo por interfaces o genéricos acotados. Si el crecimiento continúa, extraer un pequeño repositorio o capa de acceso a datos.

- **Archivo/módulo**: ProjectCard.tsx, generate-thumbs.cjs
  - **Problema**: la lógica del thumbnail en `ProjectCard` prioriza siempre la miniatura generada en thumbs, porque `thumbUrl` siempre es una cadena no vacía. Eso hace que el fallback `processedThumb` quede prácticamente muerto.
  - **Por qué importa**: si faltan miniaturas generadas o están desactualizadas, la tarjeta puede mostrar imágenes rotas en lugar de caer a la imagen original del proyecto. En una sección pública eso afecta directamente la percepción visual y la robustez.
  - **Cómo corregirlo**: cambiar la lógica para que el orden real sea “miniatura generada si existe, si no fallback original”. Lo ideal es comprobar existencia o confiar en un flujo de generación garantizado y, en cualquier caso, mantener un fallback funcional real. Añadir tests para cubrir el caso de miniatura ausente.

#### 🟡 Warnings (mejoras recomendadas)

- **Archivo/módulo**: README.md, README2.md, DOCUMENTATION.md
  - **Problema**: hay deriva documental respecto a la estructura real del proyecto. La documentación menciona historias “colocadas junto a los componentes” y rutas como `src/config`, pero el árbol real usa stories y config.
  - **Por qué importa**: la documentación desactualizada confunde el onboarding y hace más probable que futuras refactorizaciones sigan convenciones equivocadas.
  - **Cómo corregirlo**: sincronizar README y documentación técnica con la estructura real. Si la organización actual de stories es la definitiva, documentarla así; si no, unificar la convención.

- **Archivo/módulo**: useTheme.ts, CategoryHero.tsx
  - **Problema**: `useTheme()` depende de `localStorage` y `document` directamente, y `CategoryHero` calcula un offset aleatorio con `Math.random()` al montarse.
  - **Por qué importa**: funciona bien en SPA pura, pero es menos robusto para SSR, tests o futuros escenarios de renderizado más estrictos. El componente también es menos determinista de lo necesario.
  - **Cómo corregirlo**: proteger el acceso a APIs del navegador, añadir sincronización por evento `storage` si se quiere coherencia entre pestañas, y reemplazar la aleatoriedad por una semilla estable o un valor parametrizable.

- **Archivo/módulo**: CategoryGalleryPage.tsx, graphicDesignGalleries.tsx, developerGalleries.tsx, DataPageHelpers.ts
  - **Problema**: la información de rutas, slugs y categorías está repartida entre configuración, helpers y lógica de administración.
  - **Por qué importa**: cualquier nueva categoría obliga a tocar varias zonas del proyecto, lo que aumenta el riesgo de desincronización.
  - **Cómo corregirlo**: crear una única fuente de verdad para categorías, slugs, rutas públicas y rutas de detalle. A partir de esa fuente, derivar galerías, filtros y enlaces administrativos.

- **Archivo/módulo**: Home.tsx, DeveloperHome.tsx, GraphicDesignHome.tsx
  - **Problema**: el uso de `sessionStorage` como señal de “acceso interno” condiciona la experiencia visual, pero no constituye una barrera real.
  - **Por qué importa**: puede generar una falsa sensación de control y complica la comprensión del flujo entre páginas.
  - **Cómo corregirlo**: si se quiere mantener, documentarlo como simple mejora de navegación interna; si se necesita privacidad real, moverlo a un guard auténtico.

#### 🔵 Suggestions (mejoras opcionales que añaden valor)

- **Archivo/módulo**: DataPageHelpers.ts, apiClient.ts
  - **Sugerencia**: introducir una capa de repositorio/servicio para datos del portfolio. La UI seguiría consumiendo hooks o helpers simples, pero la normalización y el acceso a JSON/API quedarían separados.
  - **Valor añadido**: mejor testabilidad, menos acoplamiento y más claridad en la evolución futura.

- **Archivo/módulo**: app.ts, imagePathHelper.ts, graphicDesignGalleries.tsx, developerGalleries.tsx
  - **Sugerencia**: consolidar las rutas base, slugs y construcciones de imagen en un único registro tipado.
  - **Valor añadido**: menos duplicación, menos errores por nombre de carpeta y mejor escalabilidad al añadir categorías.

- **Archivo/módulo**: BaseTable.tsx, DataActionBar.tsx, ProjectCard.tsx, useShowHidden.ts
  - **Sugerencia**: ampliar tests unitarios e integración en torno a piezas arquitectónicas críticas.
  - **Valor añadido**: protegería la lógica de selección, ordenación, visibilidad y renderizado de tarjetas, que son los puntos más sensibles del sitio.

- **Archivo/módulo**: stories
  - **Sugerencia**: usar Storybook no solo como catálogo visual, sino como documento vivo de variantes reales y estados límite.
  - **Valor añadido**: facilitaría detectar regresiones de accesibilidad y diseño antes de que lleguen a la página pública.

### Puntuación global

**7/10**

La arquitectura es buena para un portfolio estático con una zona privada ligera: hay componentes reutilizables, datos centralizados y una capa visual consistente. Baja puntos por la falta de protección real en `/kimo`, por el exceso de responsabilidad concentrada en algunos helpers de datos y por una documentación que ya no refleja del todo la estructura real.
