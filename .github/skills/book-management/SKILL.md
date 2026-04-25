---
name: book-management
description: >
  Skill para añadir nuevos libros al archivo books.json. Valida portadas, datos faltantes, normaliza formatos y mantiene la coherencia del archivo.
license: MIT
metadata:
  author: kimografico
  version: '1.0'
---

# Book Management Skill — kimografico

Pasos para añadir nuevos libros al archivo `books.json` con validación y normalización.

---

## 1. Recibir información del libro

El usuario solo debe aportar:

- **Portada**: Imagen subida a `/public/images/books/<id>.jpg` (el nombre de la portada será el `id` del libro)
- **ID**: Nombre único del libro (debe coincidir exactamente con la portada)
- **Título**: Título del libro
- **Autor**: Nombre del autor
- **Fecha de lectura**: Formato completo `YYYY-MM-DD` (si falta el día, se pondrá `01`)

**Opcionales (se completan automáticamente si faltan):**

- **Idioma**: Si no se especifica, se asume `es` (español)
- **Género, sinopsis, serie, ISBN**: Si no se especifican, se buscarán automáticamente por internet y se sugerirán al usuario para revisión.

---

## 2. Validar datos completos

Comprobar que se han aportado los siguientes campos obligatorios:

- [ ] ID único (coincide con nombre de portada)
- [ ] Título
- [ ] Autor
- [ ] Fecha de lectura (formato completo: `YYYY-MM-DD`)

**Idioma:** Si no se especifica, se asigna automáticamente `es`.

**Género, sinopsis, serie, ISBN:** Si faltan, se buscarán automáticamente por internet y se mostrarán al usuario para confirmar o editar antes de guardar.

---

## 3. Normalizar datos

### Títulos y autores

- Capitalizar correctamente (primera letra mayúscula de cada palabra importante).
- Corregir faltas de ortografía.

**Ejemplos**:

- `el quijote` → `El Quijote`
- `Cervates` → `Cervantes`

### Fechas

- Convertir a formato `YYYY-MM` si es solo mes/año.
- Convertir a formato `YYYY-MM-DD` si es fecha completa.
- Si solo es año: `YYYY-01-01`

**Ejemplos**:

- `2024-08` → `2024-08` (ok)
- `August 2024` → `2024-08`
- `8/2024` → `2024-08`

### Idioma

- Usar códigos ISO 639-1: `es` (español), `en` (inglés), `fr` (francés), etc.
- Caso: siempre minúscula.

### Género

- Mantener consistencia con libros existentes.
- Capitalizar: `Ficción`, `Novela Gráfica`, `Sci-Fi`, etc.

### Sinopsis

- Corregir ortografía y gramática.
- Mantener punto final.
- Máximo 300 caracteres (aproximadamente).

---

## 4. Estructura JSON

**Formato base** en `books.json`:

```json
{
  "id": "unique-id",
  "title": "Título del Libro",
  "author": "Nombre del Autor",
  "portada": "/images/books/unique-id.jpg",
  "fecha": "2024-08-01",
  "idioma": "es",
  "genero": "Sci-Fi",
  "sinopsis": "Breve descripción del libro...",
  "serie": "Nombre de la Serie (opcional)",
  "isbn": "978-3-16-148410-0 (opcional)"
}
```

---

## 5. Insertar en `books.json`

**Ubicación**: `/src/data/books.json`

1. Añadir el nuevo objeto al array, manteniendo el orden (por defecto: más reciente primero, o alfabético si se especifica).
2. Validar JSON válido (sin errores de sintaxis).
3. Asegurar que el `id` es único.
4. Si algún campo opcional fue completado automáticamente, mostrarlo al usuario para revisión antes de guardar.

---

## 6. Verificar portada

- [ ] Archivo existe en `/public/images/books/<id>.jpg`
- [ ] El nombre del archivo coincide con el `id` del libro.
- [ ] La imagen es accesible desde el navegador.

---

## 7. Validación final

- [ ] JSON válido (sin errores sintácticos).
- [ ] Todos los campos requeridos presentes.
- [ ] ID único en el array.
- [ ] Portada accesible.
- [ ] Formato de fecha correcto.
- [ ] Sin duplicados en el archivo.

---

## Checklist de adición

- [ ] Portada subida a `/public/images/books/<id>.jpg`
- [ ] Datos del libro completos y normalizados (solo obligatorios: id, título, autor, fecha; el resto por defecto o buscados).
- [ ] Objeto JSON formato correcto.
- [ ] Insertado en array de `books.json`
- [ ] JSON válido (sin errores).
- [ ] ID único y coincidente con portada.
- [ ] Libro visible en BooksGallery y BooksTable.
