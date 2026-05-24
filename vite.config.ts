import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/portfolio/',
  plugins: [
    react(),
    VitePWA({
      // El SW se registra automáticamente y se actualiza sin intervención del usuario
      registerType: 'autoUpdate',

      // Archivos estáticos adicionales que el SW debe precachear
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'robots.txt'],

      manifest: {
        name: 'kimografico — diseño & desarrollo',
        short_name: 'kimografico',
        description: 'Portfolio de Kimo — diseñador gráfico y desarrollador de software',
        // theme_color afecta la barra del navegador en Android/Chrome cuando se instala
        theme_color: '#f4f4f2',
        // background_color es el fondo de la splash screen mientras carga la app
        background_color: '#f4f4f2',
        // standalone elimina la barra de navegación del navegador (app nativa)
        display: 'standalone',
        orientation: 'portrait',
        // scope y start_url deben coincidir con `base` de Vite y con el basename de React Router
        scope: '/portfolio/',
        start_url: '/portfolio/',
        // Usar el favicon existente como icono de prueba para desarrollo/local.
        // Reemplaza estos por PNGs reales en `public/` cuando los tengas.
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        // Solo precachear el bundle de la app (JS, CSS, HTML compilado) y los iconos root
        // Las imágenes del portfolio son demasiado grandes para precaché y se sirven via runtimeCaching
        globPatterns: ['**/*.{js,css,html}', '*.{ico,svg,png,webp,woff,woff2}'],

        // Fallback para SPA: en offline, cualquier navegación a una ruta conocida
        // devuelve index.html, permitiendo que React Router gestione el enrutado
        navigateFallback: '/portfolio/index.html',

        // Excluir rutas de la API del backend del fallback de navegación
        navigateFallbackDenylist: [/^\/api\//],

        // Estrategias de caché en tiempo de ejecución (runtime caching)
        runtimeCaching: [
          {
            // Google Fonts CSS — CacheFirst porque rara vez cambia
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts archivos de fuente — CacheFirst, son inmutables
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Imágenes del portfolio — StaleWhileRevalidate:
            // sirve desde caché inmediatamente y actualiza en background
            urlPattern: /\/portfolio\/images\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'portfolio-images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
