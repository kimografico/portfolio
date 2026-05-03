# Otras tareas

Añadir este proyecto a "React"
Añadir proyectos mas nuevos
Reescribir recent-works

---

Parece que el editar no esta añadiendo el prefijo portfolio

---

"ruta": "/portfolio/images/portfolio/web/wordpress/xerri-espumas002.jpg", deberia ser mucho más corto, no depender de la estructura del proyecto. la ruta deberia ir en app.ts
este cambio afecta también a la seccion admin de añadir o editar, ya que al subir una imagen se genera el json con esta estructura

---

/\*\*

- Configuración global de la aplicación
- Sincronizado con vite.config.ts y main.tsx
  \*/

// Prefijo base para rutas internas (React Router, navegación)
export const APP_BASENAME = '/portfolio';

// Prefijos para rutas de imágenes públicas (solo si no cambian por entorno)
export const IMAGES_PATH = `${APP_BASENAME}/images`;
export const BOOK_COVERS_PATH = `${IMAGES_PATH}/books`;
export const ILLUSTRATIONS_PATH = `${IMAGES_PATH}/illustrations`;
export const UI_IMG_PATH = `${IMAGES_PATH}/ui`;

// Prefijo para rutas de datos locales (si accedes a JSONs desde el frontend)
export const DATA_PATH = `${APP_BASENAME}/data`;

// Puedes añadir más rutas base aquí según crezcan tus necesidades
