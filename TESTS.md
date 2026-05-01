# Plan de tests — kimografico

Plan completo de tests para el proyecto. Organizado por área: hooks, componentes, páginas, cliente API, utilidades y controladores del backend.

> **Stack**: Vitest + Testing Library (frontend) · supertest (backend, pendiente de configurar)  
> **Convención**: los tests van en `/tests/`, un archivo por módulo, con el mismo nombre que el archivo testado.

---

## Índice

1. [Hooks](#1-hooks)
2. [Componentes — Composiciones](#2-componentes--composiciones)
3. [Componentes — Combinations](#3-componentes--combinations)
4. [Componentes — Layout](#4-componentes--layout)
5. [Componentes — UI](#5-componentes--ui)
6. [Páginas — Sección pública](#6-páginas--sección-pública)
7. [Páginas — Espacio personal (Kimo)](#7-páginas--espacio-personal-kimo)
8. [Cliente API](#8-cliente-api)
9. [Backend — Utilidades](#9-backend--utilidades)
10. [Backend — Controladores](#10-backend--controladores)
11. [Backend — Endpoints (integración)](#11-backend--endpoints-integración)
12. [Tests E2E (flujos completos)](#12-tests-e2e-flujos-completos)
13. [Estado actual de cobertura](#13-estado-actual-de-cobertura)

---

## 1. Hooks

### `useTheme` — `tests/hooks/useTheme.test.ts`

El hook gestiona el tema claro/oscuro con persistencia en `localStorage` y sincronización entre múltiples instancias. Es crítico que el store compartido (módulo-level `Set` de listeners) funcione correctamente.

| #   | Descripción                                                       | Tipo        |
| --- | ----------------------------------------------------------------- | ----------- |
| 1   | Devuelve `'light'` si `localStorage` está vacío                   | unitario    |
| 2   | Devuelve `'dark'` si `localStorage` tiene `'dark'`                | unitario    |
| 3   | `toggle()` cambia de `light` a `dark`                             | unitario    |
| 4   | `toggle()` cambia de `dark` a `light`                             | unitario    |
| 5   | `toggle()` guarda el nuevo tema en `localStorage`                 | unitario    |
| 6   | `toggle()` actualiza el atributo `data-theme` en `<html>`         | unitario    |
| 7   | Dos instancias del hook se sincronizan cuando una hace `toggle()` | integración |
| 8   | El listener se elimina al desmontar el componente                 | unitario    |

```ts
// Ejemplo base del test de sincronización (caso 7)
// Se montan dos componentes distintos que usan useTheme.
// El toggle de uno debe actualizar el estado del otro.
it('multiple instances sync when one calls toggle', () => {
  const { result: r1 } = renderHook(() => useTheme());
  const { result: r2 } = renderHook(() => useTheme());
  act(() => r1.current[1]()); // toggle desde instancia 1
  expect(r2.current[0]).toBe('dark'); // instancia 2 se entera
});
```

---

### `useShowHidden` — `tests/hooks/useShowHidden.test.ts`

| #   | Descripción                                                   | Tipo     |
| --- | ------------------------------------------------------------- | -------- |
| 1   | Devuelve `false` por defecto si no hay nada en `localStorage` | unitario |
| 2   | Recupera el valor guardado en `localStorage` al montar        | unitario |
| 3   | Actualizar el valor lo persiste en `localStorage`             | unitario |
| 4   | Cambiar el valor fuerza re-render con el nuevo estado         | unitario |

---

### `useTableSorting` — `tests/hooks/useTableSorting.test.ts`

| #   | Descripción                                         | Tipo     |
| --- | --------------------------------------------------- | -------- |
| 1   | Devuelve el `initialSorting` proporcionado          | unitario |
| 2   | Devuelve array vacío si no se pasa `initialSorting` | unitario |
| 3   | Acepta un updater como función `(prev) => next`     | unitario |
| 4   | Acepta un valor directo `SortingState`              | unitario |

---

## 2. Componentes — Composiciones

### `BaseTable` — `tests/components/BaseTable.test.tsx`

Componente de tabla reutilizable con TanStack Table v8. Es el componente más crítico de la UI de gestión: todos los datos de proyectos, libros y lugares pasan por aquí.

| #   | Descripción                                                              | Tipo     |
| --- | ------------------------------------------------------------------------ | -------- |
| 1   | Renderiza las cabeceras de columna                                       | unitario |
| 2   | Renderiza todas las filas con los datos pasados                          | unitario |
| 3   | Muestra el `emptyMessage` cuando `data` está vacío                       | unitario |
| 4   | Al hacer clic en una cabecera ordenable, ordena ascendente               | unitario |
| 5   | Un segundo clic en la misma cabecera ordena descendente                  | unitario |
| 6   | No existe un tercer estado "sin ordenar" (`enableSortingRemoval: false`) | unitario |
| 7   | Las flechas ▲/▼ cambian visualmente según el estado de ordenación        | unitario |
| 8   | `onRowClick` se llama con la fila correcta al hacer clic                 | unitario |
| 9   | `onRowClick` no se llama si no se proporciona la prop                    | unitario |
| 10  | La prop `initialSorting` establece el orden inicial                      | unitario |
| 11  | `data-id` del contenedor está presente                                   | unitario |

---

## 3. Componentes — Combinations

### `BooksFilter` — `tests/components/BooksFilter.test.tsx`

Componente de filtro para libros. La lógica de filtrado es compleja: el campo autor agrupa autores recurrentes y mete los demás bajo "OTROS".

| #   | Descripción                                                                  | Tipo     |
| --- | ---------------------------------------------------------------------------- | -------- |
| 1   | Renderiza los 4 campos de filtro (título, autor, serie, género)              | unitario |
| 2   | Filtrar por título (parcial, case-insensitive) devuelve resultados correctos | unitario |
| 3   | Filtrar por título sin coincidencias devuelve array vacío                    | unitario |
| 4   | Autores con más de una aparición aparecen como opción individual             | unitario |
| 5   | Autores con una sola aparición quedan bajo la opción "OTROS"                 | unitario |
| 6   | Filtrar por autor "OTROS" devuelve todos los autores no frecuentes           | unitario |
| 7   | El dropdown de serie sólo muestra series únicas, ordenadas                   | unitario |
| 8   | El dropdown de género sólo muestra géneros únicos, ordenados                 | unitario |
| 9   | Combinar varios filtros aplica todos a la vez                                | unitario |
| 10  | Limpiar todos los filtros devuelve todos los libros                          | unitario |
| 11  | `onFiltered` se llama cada vez que cambia cualquier filtro                   | unitario |

---

### `BookModal` — `tests/components/BookModal.test.tsx`

Modal de detalle de libro. Contiene lógica de formateo de fecha y de banderas de idioma, además de animaciones de apertura/cierre.

| #   | Descripción                                                      | Tipo     |
| --- | ---------------------------------------------------------------- | -------- |
| 1   | Renderiza el título, autor y portada del libro                   | unitario |
| 2   | Fecha `'2024-08'` se muestra como `'Agosto de 2024'`             | unitario |
| 3   | Fecha `'2011-10'` se muestra como `'Octubre de 2011'`            | unitario |
| 4   | Fecha vacía `''` muestra `'Desconocida'`                         | unitario |
| 5   | Fecha en formato no reconocido se muestra tal cual               | unitario |
| 6   | Idioma `'English'` muestra la bandera 🇬🇧                         | unitario |
| 7   | Idioma `'Español'` muestra la bandera 🇪🇸                         | unitario |
| 8   | Idioma desconocido no muestra bandera                            | unitario |
| 9   | La serie no se muestra si el campo es cadena vacía               | unitario |
| 10  | La serie sí se muestra si tiene valor                            | unitario |
| 11  | La sinopsis se muestra en el cuerpo del modal                    | unitario |
| 12  | `onClose` se llama al pulsar el botón de cierre                  | unitario |
| 13  | `onClose` se llama al pulsar la tecla `Escape`                   | unitario |
| 14  | `onClose` se llama al hacer clic en el overlay (fuera del modal) | unitario |
| 15  | El foco se mueve al modal al abrirse                             | unitario |

---

### `VisitedWorldMap` — `tests/components/VisitedWorldMap.test.tsx`

Al usar `jsvectormap` (una librería de mapas del DOM), hay que mockear la inicialización. El test valida que el componente llama a la librería correctamente y que hace limpieza al desmontar.

| #   | Descripción                                                | Tipo     |
| --- | ---------------------------------------------------------- | -------- |
| 1   | El contenedor `<div>` se renderiza con la altura correcta  | unitario |
| 2   | La librería `jsvectormap` se inicializa al montar          | unitario |
| 3   | Se pasan los países resaltados a la configuración del mapa | unitario |
| 4   | Se pasan los marcadores a la configuración del mapa        | unitario |
| 5   | `map.destroy()` se llama al desmontar el componente        | unitario |
| 6   | El `data-id="places-map"` está presente                    | unitario |

---

## 4. Componentes — Layout

### `MainHeader` — `tests/components/MainHeader.test.tsx`

| #   | Descripción                                                           | Tipo     |
| --- | --------------------------------------------------------------------- | -------- |
| 1   | Renderiza el logotipo                                                 | unitario |
| 2   | Renderiza los 3 enlaces de navegación (Diseño, Dev, Contacto)         | unitario |
| 3   | Renderiza el botón de toggle de tema con `data-id="theme-toggle-btn"` | unitario |
| 4   | Hacer clic en el toggle llama a la función de cambio de tema          | unitario |
| 5   | El botón muestra el icono de luna cuando el tema es `light`           | unitario |
| 6   | El botón muestra el icono de sol cuando el tema es `dark`             | unitario |
| 7   | El botón de menú móvil está presente                                  | unitario |
| 8   | El menú móvil se abre y cierra al pulsar el botón hamburguesa         | unitario |

---

### `MainLayout` — `tests/components/MainLayout.test.tsx`

| #   | Descripción                                                    | Tipo        |
| --- | -------------------------------------------------------------- | ----------- |
| 1   | Renderiza `MainHeader`, el contenido (`Outlet`) y `MainFooter` | unitario    |
| 2   | El `Outlet` renderiza el componente hijo de la ruta activa     | integración |

---

## 5. Componentes — UI

### `CategoryHero` — `tests/components/CategoryHero.test.tsx`

| #   | Descripción                                                       | Tipo     |
| --- | ----------------------------------------------------------------- | -------- |
| 1   | Renderiza el título y la descripción correctamente                | unitario |
| 2   | Muestra el enlace de "volver" cuando se pasa `backLink`           | unitario |
| 3   | No muestra el enlace de "volver" si `backLink` no se pasa         | unitario |
| 4   | Con tema `light`, usa `category-bg.jpeg` como imagen de fondo     | unitario |
| 5   | Con tema `dark`, usa `category-bg-dark.jpeg` como imagen de fondo | unitario |
| 6   | El `data-id` personalizado está presente en el contenedor         | unitario |

---

### `ImageLightbox` — `tests/components/ImageLightbox.test.tsx`

| #   | Descripción                                                 | Tipo     |
| --- | ----------------------------------------------------------- | -------- |
| 1   | Muestra la imagen activa correctamente                      | unitario |
| 2   | Botón "siguiente" avanza a la siguiente imagen              | unitario |
| 3   | Botón "anterior" retrocede a la imagen anterior             | unitario |
| 4   | El botón "siguiente" no aparece si sólo hay una imagen      | unitario |
| 5   | El botón "anterior" no aparece si sólo hay una imagen       | unitario |
| 6   | `onClose` se llama al pulsar el botón de cierre             | unitario |
| 7   | `onClose` se llama al pulsar `Escape`                       | unitario |
| 8   | Se muestra el label de la imagen si existe                  | unitario |
| 9   | Navegación circular: desde la última imagen va a la primera | unitario |

---

## 6. Páginas — Sección pública

### `Home` — `tests/pages/Home.test.tsx`

| #   | Descripción                                           | Tipo     |
| --- | ----------------------------------------------------- | -------- |
| 1   | Renderiza el `data-id="home-page"`                    | unitario |
| 2   | Muestra títulos y texto de la sección hero            | unitario |
| 3   | Muestra proyectos recientes desde `recent-works.json` | unitario |
| 4   | Los CTAs del hero apuntan a las rutas correctas       | unitario |
| 5   | El skip link está presente y apunta a `#main-content` | unitario |

---

### `GraphicDesignHome` — `tests/pages/GraphicDesignHome.test.tsx`

| #   | Descripción                                                        | Tipo     |
| --- | ------------------------------------------------------------------ | -------- |
| 1   | Renderiza las 8 tarjetas de categoría                              | unitario |
| 2   | Cada tarjeta tiene un enlace a su ruta correcta                    | unitario |
| 3   | El hero se muestra en acceso directo (history length = 2)          | unitario |
| 4   | El hero no se muestra al navegar internamente (history length > 2) | unitario |

---

### `GraphicDesignProjectDetail` — `tests/pages/GraphicDesignProjectDetail.test.tsx`

| #   | Descripción                                              | Tipo        |
| --- | -------------------------------------------------------- | ----------- |
| 1   | Muestra el título y cliente del proyecto                 | integración |
| 2   | Muestra error si la categoría de la URL no es válida     | integración |
| 3   | Muestra error 404 si el ID no existe en la categoría     | integración |
| 4   | El lightbox se abre al hacer clic en una imagen          | integración |
| 5   | El botón "anterior" no aparece si es el primer proyecto  | integración |
| 6   | El botón "siguiente" no aparece si es el último proyecto | integración |
| 7   | Una URL de YouTube `youtu.be/xxxx` se convierte en embed | unitario    |
| 8   | Una URL de YouTube `watch?v=xxxx` se convierte en embed  | unitario    |

---

### `DeveloperHome` — `tests/pages/DeveloperHome.test.tsx`

| #   | Descripción                                                            | Tipo     |
| --- | ---------------------------------------------------------------------- | -------- |
| 1   | Renderiza las 3 tarjetas de categoría (WordPress, Vanilla, Frameworks) | unitario |
| 2   | La misma lógica de visibilidad del hero que en GraphicDesignHome       | unitario |

---

### `NotFoundPage` — `tests/pages/NotFoundPage.test.tsx`

| #   | Descripción                                          | Tipo     |
| --- | ---------------------------------------------------- | -------- |
| 1   | Muestra un mensaje indicando que la página no existe | unitario |
| 2   | Tiene un enlace para volver al inicio                | unitario |
| 3   | El enlace de inicio apunta a `'/'`                   | unitario |

---

## 7. Páginas — Espacio personal (Kimo)

### `KimoLayout` — `tests/pages/KimoLayout.test.tsx`

| #   | Descripción                                          | Tipo        |
| --- | ---------------------------------------------------- | ----------- |
| 1   | Renderiza los 6 enlaces de navegación interna        | unitario    |
| 2   | El enlace activo tiene la clase/estilo de activo     | integración |
| 3   | El outlet renderiza el componente hijo correctamente | integración |
| 4   | `data-id="kimo-layout"` está presente                | unitario    |

---

### `BooksPage` — `tests/pages/BooksPage.test.tsx`

| #   | Descripción                                                | Tipo     |
| --- | ---------------------------------------------------------- | -------- |
| 1   | Muestra la vista de galería por defecto                    | unitario |
| 2   | Al pulsar el botón "Tabla", cambia a la vista de tabla     | unitario |
| 3   | Al pulsar el botón "Galería", vuelve a la vista de galería | unitario |
| 4   | Sólo se muestra uno de los dos componentes a la vez        | unitario |
| 5   | `data-id="books-page"` está presente                       | unitario |

---

### `BooksGallery` — `tests/pages/BooksGallery.test.tsx`

La galería de portadas es uno de los componentes más ricos: ordenación, modal, fallback de imágenes.

| #   | Descripción                                                      | Tipo        |
| --- | ---------------------------------------------------------------- | ----------- |
| 1   | Renderiza todas las portadas de `books.json`                     | unitario    |
| 2   | Las portadas están ordenadas por fecha descendente               | unitario    |
| 3   | Los libros sin fecha aparecen al final                           | unitario    |
| 4   | Al hacer clic en una portada se abre el modal de ese libro       | unitario    |
| 5   | El modal muestra el libro correcto (título y autor)              | unitario    |
| 6   | Cerrar el modal oculta el componente `BookModal`                 | unitario    |
| 7   | Una portada con ruta inválida muestra `_blank.jpg` (fallback)    | unitario    |
| 8   | Una portada con `cover: ''` muestra `_blank.jpg`                 | unitario    |
| 9   | El `title` de cada imagen accesible contiene el nombre del libro | unitario    |
| 10  | El componente acepta y aplica los filtros del `BooksFilter`      | integración |
| 11  | `data-id="books-gallery-grid"` está presente                     | unitario    |

---

### `BooksTable` — `tests/pages/BooksTable.test.tsx`

| #   | Descripción                                                           | Tipo        |
| --- | --------------------------------------------------------------------- | ----------- |
| 1   | Renderiza las 6 columnas: título, autor, fecha, serie, género, idioma | unitario    |
| 2   | Los datos de `books.json` se muestran en las filas                    | unitario    |
| 3   | El estado de ordenación inicial es por fecha descendente              | unitario    |
| 4   | Hacer clic en "Fecha" invierte el orden                               | unitario    |
| 5   | Al pulsar una fila se abre el modal con los datos de ese libro        | unitario    |
| 6   | El idioma `'English'` muestra la bandera 🇬🇧                           | unitario    |
| 7   | Los filtros del `BooksFilter` actualizan las filas mostradas          | integración |

---

### `PlacesPage` — `tests/pages/PlacesPage.test.tsx`

| #   | Descripción                                            | Tipo     |
| --- | ------------------------------------------------------ | -------- |
| 1   | Renderiza el mapa (`data-id="places-map"`)             | unitario |
| 2   | Renderiza la tabla (`data-id="places-table"`)          | unitario |
| 3   | Los países extraídos de `places.json` se pasan al mapa | unitario |

---

### `PlacesTable` — `tests/pages/PlacesTable.test.tsx`

| #   | Descripción                                                        | Tipo     |
| --- | ------------------------------------------------------------------ | -------- |
| 1   | Renderiza las 5 columnas: ciudad, lugar, país, fecha, acompañantes | unitario |
| 2   | La columna "país" muestra la bandera emoji correspondiente         | unitario |
| 3   | España (`'es'`) no muestra bandera (o muestra guion)               | unitario |
| 4   | El orden inicial es por fecha descendente                          | unitario |
| 5   | Ciudad `'Valencia'` o `'Comunidad Valenciana'` se muestra en gris  | unitario |
| 6   | La columna "lugar" tiene mayor peso tipográfico                    | unitario |
| 7   | La columna "acompañantes" precede el texto con `'Kimo, '`          | unitario |

---

### `DataPage` — `tests/pages/DataPage.test.tsx`

Página de gestión de proyectos. La más compleja de testear porque involucra llamadas al backend.

| #   | Descripción                                                                               | Tipo        |
| --- | ----------------------------------------------------------------------------------------- | ----------- |
| 1   | Muestra todos los proyectos de todos los JSONs (11 fuentes)                               | integración |
| 2   | El filtro de tipo "Diseño Gráfico" muestra sólo proyectos `gd`                            | unitario    |
| 3   | El filtro de tipo "Desarrollo" muestra sólo proyectos `dev`                               | unitario    |
| 4   | Cambiar el tipo resetea el filtro de categoría                                            | unitario    |
| 5   | El filtro de categoría filtra correctamente dentro del tipo                               | unitario    |
| 6   | El filtro de visibilidad "Sólo visibles" oculta los proyectos con `visible: false`        | unitario    |
| 7   | El toggle "mostrar ocultos" muestra proyectos ocultos                                     | unitario    |
| 8   | Seleccionar una fila activa los botones de bulk action                                    | unitario    |
| 9   | "Seleccionar todo" marca todas las filas                                                  | unitario    |
| 10  | Pulsar "Marcar como oculto" llama a `PATCH /api/projects/visibility` con `visible: false` | integración |
| 11  | La UI actualiza `visible` localmente sin recargar                                         | integración |
| 12  | Hacer clic en una fila navega a `/kimo/edit-project/:id`                                  | integración |
| 13  | Si la API falla, muestra un mensaje de error                                              | integración |

---

### `AddProjectPage` — `tests/pages/AddProjectPage.test.tsx`

| #   | Descripción                                                           | Tipo        |
| --- | --------------------------------------------------------------------- | ----------- |
| 1   | Se renderiza el formulario completo                                   | unitario    |
| 2   | Cambiar "Tipo" a "Diseño Gráfico" muestra las 8 categorías de diseño  | unitario    |
| 3   | Cambiar "Tipo" a "Desarrollo" muestra las 3 categorías de desarrollo  | unitario    |
| 4   | Cambiar el tipo resetea la categoría seleccionada                     | unitario    |
| 5   | El campo de stack sólo aparece cuando el tipo es "Desarrollo"         | unitario    |
| 6   | Los botones de stack rápido (React, TypeScript, etc.) añaden al array | unitario    |
| 7   | El botón "Añadir imagen" agrega un nuevo par ruta+label               | unitario    |
| 8   | El botón "Eliminar" de una imagen la quita del formulario             | unitario    |
| 9   | Arrastrar un archivo sobre la zona de drop lo añade con miniatura     | unitario    |
| 10  | Enviar el formulario sin título muestra error de validación           | unitario    |
| 11  | Enviar el formulario sin categoría muestra error de validación        | unitario    |
| 12  | Enviar un formulario válido llama a `POST /api/projects`              | integración |
| 13  | Si hay archivos pendientes, llama a `POST /api/upload` antes de crear | integración |
| 14  | En caso de éxito, muestra el ID del proyecto creado                   | integración |
| 15  | En caso de error de API, muestra el mensaje de error                  | integración |

---

### `EditProjectPage` — `tests/pages/EditProjectPage.test.tsx`

| #   | Descripción                                                              | Tipo        |
| --- | ------------------------------------------------------------------------ | ----------- |
| 1   | Muestra spinner de carga mientras obtiene el proyecto                    | integración |
| 2   | El formulario se pre-rellena con los datos del proyecto cargado          | integración |
| 3   | Campos de vídeos que son objetos `{ruta, label}` se normalizan a strings | integración |
| 4   | Si el proyecto no existe (404), muestra mensaje de error                 | integración |
| 5   | Misma lógica de drag & drop y upload que `AddProjectPage`                | integración |
| 6   | Enviar el formulario llama a `PUT /api/projects/:id`                     | integración |
| 7   | Los cambios guardados con éxito muestran confirmación                    | integración |

---

## 8. Cliente API

### `apiClient` — `tests/api/apiClient.test.ts`

Hay que mockear `fetch` global. El objetivo es verificar que cada función construye la petición correcta (URL, método, cabeceras, body) y maneja los errores.

| #   | Descripción                                                                              | Tipo     |
| --- | ---------------------------------------------------------------------------------------- | -------- |
| 1   | `getProject(3800)` hace `GET` a `/api/projects/3800`                                     | unitario |
| 2   | `getProject` lanza error si `success: false` en la respuesta                             | unitario |
| 3   | `createProject(data)` hace `POST` a `/api/projects` con `Content-Type: application/json` | unitario |
| 4   | `createProject` envía el body como JSON                                                  | unitario |
| 5   | `updateProject(id, data)` hace `PUT` a `/api/projects/:id`                               | unitario |
| 6   | `updateProject` envía sólo los campos proporcionados                                     | unitario |
| 7   | `updateVisibilityBatch([1,2], false)` hace `PATCH` a `/api/projects/visibility`          | unitario |
| 8   | `updateVisibilityBatch` envía `{ ids, visible }` en el body                              | unitario |
| 9   | `uploadImages(files, 'gd', 'carteleria', 'Test')` hace `POST` a `/api/upload`            | unitario |
| 10  | `uploadImages` envía `FormData` sin cabecera `Content-Type` manual                       | unitario |
| 11  | `uploadImages` incluye `type`, `category`, `title` y cada fichero en el FormData         | unitario |
| 12  | `apiFetch` lanza un `Error` con el mensaje de la API si `success: false`                 | unitario |
| 13  | `apiFetch` lanza un `Error` genérico en caso de fallo de red                             | unitario |

---

## 9. Backend — Utilidades

### `validation.cjs` — `tests/api/validation.test.cjs`

La validación es la primera línea de defensa del backend. Cada función debe probarse en positivo y en todos los casos de error.

#### `validateType`

| #   | Descripción                                 |
| --- | ------------------------------------------- |
| 1   | `'gd'` es válido (no lanza)                 |
| 2   | `'dev'` es válido (no lanza)                |
| 3   | `'web'` lanza error con mensaje descriptivo |
| 4   | `undefined` lanza error                     |
| 5   | Cadena vacía `''` lanza error               |

#### `validateCategory`

| #   | Descripción                                            |
| --- | ------------------------------------------------------ |
| 6   | `'carteleria'` es válida para `'gd'`                   |
| 7   | `'logotipos'` es válida para `'gd'`                    |
| 8   | `'frameworks'` es válida para `'dev'`                  |
| 9   | `'carteleria'` no es válida para `'dev'` (lanza error) |
| 10  | `'invalida'` no es válida para ninguno (lanza error)   |

#### `validateProject`

| #   | Descripción                                                  |
| --- | ------------------------------------------------------------ |
| 11  | Proyecto completo y válido devuelve `true`                   |
| 12  | Sin `title` en creación lanza error                          |
| 13  | Sin `cliente` en creación lanza error                        |
| 14  | Sin `type` en creación lanza error                           |
| 15  | Sin `category` en creación lanza error                       |
| 16  | `title` como número (no string) lanza error                  |
| 17  | `imagenes` como string (no array) lanza error                |
| 18  | En modo update (`isUpdate: true`), los campos son opcionales |
| 19  | En modo update, `visible` como no-booleano lanza error       |
| 20  | Errores múltiples se acumulan en un solo mensaje             |

#### `validateId`

| #   | Descripción                                      |
| --- | ------------------------------------------------ |
| 21  | `'3800'` (string numérico) se convierte y acepta |
| 22  | `3800` (número) se acepta                        |
| 23  | `'abc'` lanza error                              |
| 24  | `0` lanza error (debe ser > 0)                   |
| 25  | `-5` lanza error                                 |
| 26  | `3.14` lanza error (debe ser entero)             |

#### `validateIdArray`

| #   | Descripción                          |
| --- | ------------------------------------ |
| 27  | Array de IDs válidos se acepta       |
| 28  | Array vacío `[]` lanza error         |
| 29  | Array con un ID inválido lanza error |
| 30  | `null` (no array) lanza error        |

#### `validateVisibility`

| #   | Descripción                  |
| --- | ---------------------------- |
| 31  | `'true'` devuelve `'true'`   |
| 32  | `'false'` devuelve `'false'` |
| 33  | `'all'` devuelve `'all'`     |
| 34  | `undefined` devuelve `null`  |
| 35  | `'yes'` lanza error          |

---

### `uploadController.cjs` — funciones puras — `tests/api/uploadController.test.cjs`

Las funciones `slugify`, `pad` y `getNextSerial` son puras o casi puras y se pueden testear con mocks del filesystem.

#### `slugify`

| #   | Descripción                                               |
| --- | --------------------------------------------------------- |
| 1   | `'Mi Cartel 2024'` → `'mi-cartel-2024'`                   |
| 2   | `'Café con leche'` → `'cafe-con-leche'` (elimina acentos) |
| 3   | Espacios múltiples se colapsan en un guion                |
| 4   | Cadenas de más de 60 caracteres se truncan                |
| 5   | Caracteres especiales (`!`, `?`, `@`) se eliminan         |

#### `pad`

| #   | Descripción                                            |
| --- | ------------------------------------------------------ |
| 6   | `pad(1)` → `'001'`                                     |
| 7   | `pad(12)` → `'012'`                                    |
| 8   | `pad(123)` → `'123'`                                   |
| 9   | `pad(1000)` → `'1000'` (no trunca si supera 3 dígitos) |

#### `getNextSerial`

| #   | Descripción                                  |
| --- | -------------------------------------------- |
| 10  | Carpeta vacía devuelve `1`                   |
| 11  | Si existe `mi-cartel001.jpg`, devuelve `2`   |
| 12  | Si existen `001` y `002`, devuelve `3`       |
| 13  | Ignora archivos que no coinciden con el slug |

---

### `fileSystem.cjs` — `tests/api/fileSystem.test.cjs`

| #   | Descripción                                                                 |
| --- | --------------------------------------------------------------------------- |
| 1   | `getFilePath('gd', 'carteleria')` devuelve la ruta correcta                 |
| 2   | `getFilePath('dev', 'frameworks')` devuelve la ruta correcta                |
| 3   | `readJsonFile` lanza error si el archivo no existe                          |
| 4   | `readJsonFile` devuelve el contenido parseado como objeto                   |
| 5   | `writeJsonFile` crea el directorio si no existe (mock fs)                   |
| 6   | `writeJsonFile` escribe JSON con sangría de 2 espacios                      |
| 7   | `loadProjectsByType('gd')` carga las 8 categorías y las combina             |
| 8   | `loadProjectsByType('dev')` carga las 3 categorías y las combina            |
| 9   | Cada proyecto enriquecido tiene los campos `type`, `category` y `_filePath` |

---

## 10. Backend — Controladores

### `projectController.cjs` — `tests/api/projectController.test.cjs`

Los controladores se testean mockeando `fileSystem`. Se utiliza el patrón `req/res/next` mock.

#### `listProjects`

| #   | Descripción                                                  |
| --- | ------------------------------------------------------------ |
| 1   | Sin filtros devuelve todos los proyectos de todos los JSONs  |
| 2   | `?type=gd` filtra sólo proyectos de diseño                   |
| 3   | `?type=dev` filtra sólo proyectos de desarrollo              |
| 4   | `?category=carteleria` filtra por categoría                  |
| 5   | `?visible=true` devuelve sólo los visibles                   |
| 6   | `?visible=false` devuelve sólo los ocultos                   |
| 7   | Los proyectos se devuelven ordenados por fecha descendente   |
| 8   | La respuesta incluye `{ success: true, data: [], count: N }` |

#### `getProjectById`

| #   | Descripción                                    |
| --- | ---------------------------------------------- |
| 9   | Devuelve `200` con el proyecto cuando existe   |
| 10  | El resultado no contiene el campo `_filePath`  |
| 11  | Devuelve `404` si el ID no existe              |
| 12  | Devuelve `400` si el ID no es un número válido |

#### `createProject`

| #   | Descripción                                                  |
| --- | ------------------------------------------------------------ |
| 13  | Crea el proyecto y devuelve `201` con los datos del proyecto |
| 14  | El ID generado es `max(ids) + 1` del JSON de destino         |
| 15  | El campo `date` se genera automáticamente                    |
| 16  | Devuelve `400` si falta `title`                              |
| 17  | Devuelve `400` si falta `cliente`                            |
| 18  | Devuelve `400` si `type` no es válido                        |
| 19  | Devuelve `400` si `category` no es válida para el tipo       |

#### `updateProject`

| #   | Descripción                                                |
| --- | ---------------------------------------------------------- |
| 20  | Actualiza los campos proporcionados y devuelve `200`       |
| 21  | No modifica campos no proporcionados en el body            |
| 22  | Devuelve `404` si el proyecto no existe                    |
| 23  | Devuelve `400` si el body tiene campos con tipos inválidos |

#### `deleteProject`

| #   | Descripción                             |
| --- | --------------------------------------- |
| 24  | Elimina el proyecto y devuelve `200`    |
| 25  | Devuelve `404` si el proyecto no existe |

#### `updateVisibility`

| #   | Descripción                                             |
| --- | ------------------------------------------------------- |
| 26  | Actualiza `visible` en los proyectos de múltiples JSONs |
| 27  | Devuelve `200` con cuántos proyectos se actualizaron    |
| 28  | Devuelve `400` si `ids` está vacío                      |
| 29  | Devuelve `400` si `visible` no es booleano              |

#### `getCategories`

| #   | Descripción                                      |
| --- | ------------------------------------------------ |
| 30  | Devuelve `{ gd: [...8 cats], dev: [...3 cats] }` |
| 31  | Todas las categorías conocidas están presentes   |

---

## 11. Backend — Endpoints (integración)

### `server.cjs` — `tests/api/server.test.cjs`

Tests de integración con el servidor real. Requieren `supertest`. Los JSONs se mockean con datos de prueba para no depender de los datos de producción.

| #   | Ruta                                           | Descripción                              |
| --- | ---------------------------------------------- | ---------------------------------------- |
| 1   | `GET /health`                                  | Devuelve `200` con `{ success: true }`   |
| 2   | `GET /api/categories`                          | Devuelve las categorías correctas        |
| 3   | `GET /api/projects`                            | Lista proyectos (200)                    |
| 4   | `GET /api/projects?type=gd`                    | Filtra por tipo                          |
| 5   | `GET /api/projects/:id` (válido)               | Devuelve el proyecto (200)               |
| 6   | `GET /api/projects/:id` (inválido)             | Devuelve 404                             |
| 7   | `GET /api/projects/abc`                        | ID inválido → 400                        |
| 8   | `POST /api/projects` (válido)                  | Crea y devuelve 201                      |
| 9   | `POST /api/projects` (sin title)               | Devuelve 400                             |
| 10  | `PUT /api/projects/:id` (válido)               | Actualiza (200)                          |
| 11  | `PUT /api/projects/:id` (no existe)            | Devuelve 404                             |
| 12  | `DELETE /api/projects/:id` (válido)            | Elimina (200)                            |
| 13  | `DELETE /api/projects/:id` (no existe)         | Devuelve 404                             |
| 14  | `PATCH /api/projects/visibility` (válido)      | Bulk update (200)                        |
| 15  | `PATCH /api/projects/visibility` (ids vacío)   | Devuelve 400                             |
| 16  | `POST /api/upload` (con imagen válida)         | Sube imagen (200)                        |
| 17  | `POST /api/upload` (extensión inválida `.exe`) | Devuelve 400                             |
| 18  | `POST /api/upload` (sin type)                  | Devuelve 400                             |
| 19  | `GET /ruta-inexistente`                        | Devuelve 404 con `{ success: false }`    |
| 20  | CORS desde `localhost:5173`                    | Cabeceras CORS presentes en la respuesta |

---

## 12. Tests E2E (flujos completos)

Estos tests verifican flujos de usuario completos. Requieren que tanto el frontend como el backend estén activos. Se recomienda Playwright o Cypress.

### Flujo 1: Añadir un proyecto desde el formulario

1. Navegar a `/kimo/add-project`
2. Seleccionar "Diseño Gráfico" como tipo
3. Seleccionar "Logotipos" como categoría
4. Rellenar título y cliente
5. Arrastrar un archivo de imagen sobre la zona de drop
6. Verificar que aparece la miniatura
7. Enviar el formulario
8. Verificar que se muestra el ID del proyecto creado
9. Navegar a `/kimo/data` y verificar que el proyecto aparece

### Flujo 2: Editar un proyecto desde la tabla de datos

1. Navegar a `/kimo/data`
2. Hacer clic en la fila de un proyecto existente
3. Verificar que navega a `/kimo/edit-project/:id`
4. Verificar que el formulario está pre-rellenado con los datos correctos
5. Editar el título
6. Guardar
7. Navegar de vuelta a la tabla y verificar el título actualizado

### Flujo 3: Cambiar visibilidad en lote

1. Navegar a `/kimo/data`
2. Seleccionar 3 proyectos con los checkboxes
3. Pulsar "Marcar como oculto"
4. Verificar que los proyectos cambian de estado en la UI sin recargar
5. Activar el toggle "mostrar ocultos" para confirmar que siguen apareciendo

### Flujo 4: Toggle de tema y persistencia

1. Abrir la aplicación (tema claro por defecto)
2. Pulsar el botón de toggle en el header
3. Verificar que el atributo `data-theme="dark"` está en `<html>`
4. Verificar que `CategoryHero` usa la imagen de fondo oscura
5. Recargar la página
6. Verificar que el tema oscuro persiste (viene de `localStorage`)

### Flujo 5: Buscar y filtrar libros

1. Navegar a `/kimo/books`
2. Verificar que se muestra la galería
3. Filtrar por un título parcial
4. Verificar que sólo se muestran portadas que coinciden
5. Hacer clic en una portada
6. Verificar que el modal muestra los datos correctos del libro
7. Cerrar con `Escape`
8. Cambiar a vista tabla y verificar que el filtro persiste

---

## 13. Estado actual de cobertura

| Área                  | Archivos de test existentes | Estado                                     |
| --------------------- | --------------------------- | ------------------------------------------ |
| App routing           | `tests/App.test.tsx`        | ✅ básico                                  |
| Hooks                 | —                           | ❌ pendiente                               |
| BaseTable             | —                           | ❌ pendiente                               |
| BooksFilter           | —                           | ❌ pendiente                               |
| BookModal             | —                           | ❌ pendiente                               |
| BooksGallery          | —                           | ❌ pendiente                               |
| BooksTable            | —                           | ❌ pendiente                               |
| PlacesTable           | —                           | ❌ pendiente                               |
| DataPage              | —                           | ❌ pendiente                               |
| AddProjectPage        | —                           | ❌ pendiente                               |
| EditProjectPage       | —                           | ❌ pendiente                               |
| MainHeader            | —                           | ❌ pendiente                               |
| CategoryHero          | —                           | ❌ pendiente                               |
| apiClient             | —                           | ❌ pendiente                               |
| validation.cjs        | —                           | ❌ pendiente                               |
| uploadController.cjs  | —                           | ❌ pendiente                               |
| fileSystem.cjs        | —                           | ❌ pendiente                               |
| projectController.cjs | —                           | ❌ pendiente                               |
| Server (integración)  | —                           | ❌ pendiente (requiere supertest)          |
| E2E                   | —                           | ❌ pendiente (requiere Playwright/Cypress) |

### Prioridad de implementación recomendada

1. **Alta** — Hooks (`useTheme`, `useShowHidden`) y utilidades puras del backend (`validation`, `slugify`, `pad`) — son los más fáciles de escribir y los que más bugs previenen.
2. **Alta** — `BaseTable` y `apiClient` — son la base sobre la que se construyen todos los tests de páginas.
3. **Media** — `BooksFilter`, `BookModal`, `BooksGallery` — componentes con lógica de negocio rica.
4. **Media** — `DataPage`, `AddProjectPage`, `EditProjectPage` — requieren mocks de API.
5. **Baja** — Tests de integración del servidor (requieren configurar supertest).
6. **Baja** — Tests E2E (requieren infraestructura adicional).
