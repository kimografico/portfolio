---
name: add-book
description: Use when the user wants to add a book to their personal library/portfolio. Trigger keywords: "añadir libro", "agregar libro", "nuevo libro", "add book", "libro", "book". Handles searching for book metadata (author, synopsis, genre, ISBN, series) and creating the book entry via the API.
---

# Add Book Skill

You help the user add a book to their personal library stored in `src/data/kimo/books.json` via the backend API.

## Data Structure

A book has these fields:

| Field | Required | Format | Notes |
|-------|----------|--------|-------|
| `id` | No | slug string | Auto-generated from title via `slugify()` |
| `title` | **Yes** | string | |
| `author` | **Yes** | string | |
| `language` | **Yes** | string | Only `"Español"` or `"Inglés"` |
| `cover` | **Yes** | filename | Uploaded via `/api/kimo/upload` first |
| `dateRead` | No | `"YYYY-MM"` or empty | When the user read the book |
| `genre` | No | string | e.g. `"Aventuras"`, `"Fantasía"` |
| `isbn` | No | string | e.g. `"9788467035544"` |
| `series` | No | string | e.g. `"Canción de hielo y fuego"` |
| `synopsis` | No | string | Paragraph |

## Workflow

### Step 1: Get the book name

Ask the user: **"¿Qué libro quieres añadir? Puedes decirme el título y, si lo sabes, el autor."**

If the user only gives a title, that's fine. You'll search for the author.

### Step 2: Search for metadata

Use `websearch` to find the book's details. Search queries like:
- `"[title]" [author] libro género ISBN`
- `"[title]" book synopsis genre ISBN`

Extract from results:
- **author** (if not provided)
- **genre** / género
- **isbn** (the 13-digit one starting with 978 or 979)
- **series** (if it belongs to one)
- **synopsis** (a 2-3 sentence summary in Spanish)
- **language** (detect from title/author: if Spanish author or Spanish title → `"Español"`, otherwise → `"Inglés"`)

### Step 3: Present what you found and ask for missing data

Show the user what you found and ask for the fields you **cannot** know:

```
He encontrado estos datos:
- Título: [title]
- Autor: [author]
- Idioma: [Español/Inglés]
- Género: [genre]
- ISBN: [isbn]
- Serie: [series or "Ninguna"]
- Sinopsis: [synopsis]

Para completar el registro necesito:
1. ¿Cuándo leíste este libro? (formato YYYY-MM, ej: "2024-03")
2. ¿Tienes una imagen de la portada? (pásame la ruta del archivo)
```

**Never skip asking for dateRead and cover.** The user must provide these.

### Step 4: Upload the cover image

The user will provide a file path for the cover image. Upload it first:

```bash
curl -s -X POST http://localhost:3001/api/kimo/upload \
  -H "Authorization: Bearer $(cat .env | grep KIMO_PASSWORD_HASH | cut -d'=' -f2)" \
  -F "collection=books" \
  -F "title=[bookId]" \
  -F "images=@[filePath]"
```

The response will contain the uploaded file info. Extract the filename from the `ruta` field.

### Step 5: Create the book

```bash
curl -s -X POST http://localhost:3001/api/kimo/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(cat .env | grep KIMO_PASSWORD_HASH | cut -d'=' -f2)" \
  -d '{
    "id": "[slugified-title]",
    "title": "[title]",
    "author": "[author]",
    "language": "[Español or Inglés]",
    "cover": "[uploaded-filename.jpg]",
    "dateRead": "[YYYY-MM]",
    "genre": "[genre]",
    "isbn": "[isbn]",
    "series": "[series]",
    "synopsis": "[synopsis]"
  }'
```

### Step 6: Confirm

Tell the user: **"Libro creado correctamente con ID: `[generated-id]`"**

## Important Notes

- The `id` is auto-generated from the title using `slugify()`: lowercase, accents removed, spaces → hyphens, max 80 chars
- If the ID already exists, the API returns a 409 error. Add `-2`, `-3` etc. to resolve
- The cover image filename stored is just the name, not the full path (e.g. `"libro001.jpg"`, not `"/images/books/libro001.jpg"`)
- The backend must be running on `localhost:3001`
- Auth token comes from `KIMO_PASSWORD_HASH` in `.env`
