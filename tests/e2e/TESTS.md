### Lista de tests E2E recomendados

1. **Navegación general**
   ✅ El usuario puede acceder a todas las páginas principales desde el menú (diseño gráfico, desarrollo web, contacto).
   ✅ El logo redirige correctamente a la home.
   - Añadir un test por sección principal (home, diseño gráfico, desarrollo web, contacto, Kimo, etc.) que compruebe que la ruta carga y muestra el contenido esperado (por ejemplo, un heading o data-id único).
     - Ejemplo Playwright:
       ```js
       await page.goto('/graphic-design');
       await expect(page.locator('[data-id="graphic-design-home"]')).toBeVisible();
       ```

2. **Imágenes de ProjectCard**
   - Añadir un test que recorra las ProjectCard de una galería/listado y compruebe que:
     - La imagen está presente y visible.
     - El atributo `src` corresponde a la miniatura (`thumb`).
   - Ejemplo Playwright:
     ```js
     await page.goto('/graphic-design');
     const cards = await page.locator('[data-id^="project-card-"]');
     for (let i = 0; i < (await cards.count()); i++) {
       const img = cards.nth(i).locator('img');
       await expect(img).toBeVisible();
       await expect(await img.getAttribute('src')).toMatch(/thumb/);
     }
     ```

3. **Galería de libros**
   - Se muestran correctamente las portadas y metadatos de los libros.
   - Al hacer clic en una portada, se abre el modal con la información detallada.
   - El modal se puede cerrar correctamente (botón, fondo, tecla Escape).
   - El fallback de portada funciona si la imagen no existe.
     - Mockear el JSON de libros en el entorno de test para incluir un libro con `cover: ""` o ruta inválida (no en producción).
     - El test debe comprobar que la imagen muestra el fallback (`/images/portfolio/no-cover.jpg`).
     - Ejemplo Playwright:
       ```js
       await page.goto('/kimo/books');
       const fallback = await page.locator('img[alt="Portada de Libro sin portada"]');
       await expect(fallback).toHaveAttribute('src', /no-cover\.jpg$/);
       ```

4. **Tabla de libros**
   - La tabla muestra todos los libros con sus columnas.
   - El usuario puede ordenar por título, autor, fecha, etc.
   - El filtro de búsqueda funciona correctamente.

5. **Lugares visitados**
   - Se muestran todos los lugares en la tabla y/o mapa.
   - El usuario puede ordenar y filtrar por ciudad, país o fecha.
   - El modal o detalle de lugar muestra la información completa.

6. **Responsive**
   - El sitio se adapta correctamente a móvil, tablet y escritorio.
     - Usar Playwright para cambiar el tamaño de viewport o emular dispositivos.
     - Ejemplo:
       ```js
       await page.setViewportSize({ width: 375, height: 800 }); // móvil
       await expect(page.locator('[data-id="mobile-menu"]')).toBeVisible();
       await page.setViewportSize({ width: 1280, height: 800 }); // desktop
       await expect(page.locator('[data-id="desktop-menu"]')).toBeVisible();
       ```
   - Los menús y modales funcionan en todos los tamaños de pantalla.

7. **Comportamiento de errores**
   - Si falla la carga de datos (libros, lugares), se muestra un mensaje adecuado.
   - El fallback visual aparece si faltan imágenes o datos.

8. **SEO y metadatos**
   - Las páginas tienen los títulos y descripciones correctos.
   - El favicon y los meta tags están presentes.

9. **Login (si existe)**
   - Solo testear el flujo de UI (mostrar/ocultar formulario, validación de campos).
   - No usar credenciales reales ni exponer contraseñas en los tests.
   - Comprobar que el formulario aparece si no hay sesión y desaparece si la hay.
     - Simular login con localStorage/cookies.
     - Ejemplo:
       ```js
       // Sin sesión
       await page.goto('/kimo');
       await expect(page.locator('form[data-id="login-form"]')).toBeVisible();
       // Simula login
       await page.evaluate(() => localStorage.setItem('kimo-authenticated', 'true'));
       await page.goto('/kimo');
       await expect(page.locator('form[data-id="login-form"]')).not.toBeVisible();
       ```

10. **Darkmode**
    - Testear que el DarkMode funciona
      - Cambiar la preferencia de color del navegador o pulsar el botón de darkmode.
      - Comprobar que el body o root tiene la clase `dark` y que los colores cambian.
      - Ejemplo:
        ```js
        await page.goto('/');
        await page.locator('button[data-id="darkmode-toggle"]').click();
        await expect(page.locator('body')).toHaveClass(/dark/);
        ```
