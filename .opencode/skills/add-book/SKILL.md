---
name: add-book
description: Use when the user wants to add a book to their personal library/portfolio. Trigger keywords: "añadir libro", "agregar libro", "nuevo libro", "add book", "libro", "book". Handles searching for book metadata (author, synopsis, genre, ISBN, series) and creating the book entry via the API.
---

# Add Book Skill

You help the user add a book to the personal library stored in `src/data/kimo/books.json` via the backend API.

## Data Structure

A book has these fields:

| Field | Required | Format | Notes |
|-------|----------|--------|-------|
| `title` | **Yes** | string | |
| `author` | **Yes** | string | |
| `language` | **Yes** | string | Only `"Español"` or `"Inglés"` |
| `cover` | **Yes** | filename | Uploaded via `upload-kimo.sh` first |
| `dateRead` | No | `"YYYY-MM"` or empty | When the user read the book |
| `genre` | No | string | e.g. `"Aventuras"`, `"Fantasía"` |
| `isbn` | No | string | e.g. `"9788467035544"` |
| `series` | No | string | e.g. `"Canción de hielo y fuego"` |
| `synopsis` | No | string | Paragraph |

IDs are auto-generated from title via `slugify()`. Do not send them.

## Prerequisites

The backend must be running on `localhost:3001`. If not, start it with `pnpm backend`.

## Helper Scripts

All scripts are in `scripts/skills/`:

| Script | Usage |
|--------|-------|
| `upload-kimo.sh` | `bash scripts/skills/upload-kimo.sh <collection> <title> <filepath>` |
| `add-book.sh` | `bash scripts/skills/add-book.sh '{"title":...}'` |
| `list-book-tags.cjs` | `node scripts/skills/list-book-tags.cjs` → outputs existing genres and authors |

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

### Step 3: Normalize genres and authors against existing data

Before presenting data to the user, check existing books to avoid duplicate tags:

```bash
node scripts/skills/list-book-tags.cjs
```

This returns JSON with `genres` and `authors` arrays. Apply these rules:

**Genres:**
- If the found genre exactly matches an existing one → use it as-is
- If the found genre is a subset/superset of an existing one (e.g. "Fantasía épica" → "Fantasía") → use the existing shorter form
- If no match found → use the genre from the web search, but inform the user it's new

**Authors:**
- Normalize whitespace and accents
- If the found author matches an existing one (case-insensitive, ignoring accents) → use the exact existing string
- Handle common variations: initials vs full names (e.g. "B. Sanderson" → "Brandon Sanderson"), different separator styles (e.g. "Neil Gaiman y Terry Pratchett" vs "Neil Gaiman & Terry Pratchett")
- If no match found → use the author from the web search, but inform the user it's new

**Present the normalized result to the user like this:**

```
He encontrado estos datos:
- Título: [title]
- Autor: [author] [-if new, add: "(nuevo — ¿lo añado así o prefieres otra variante?  existing: X, Y, Z)"]
- Idioma: [Español/Inglés]
- Género: [genre] [if new, add: "(nuevo — ¿lo añado así o prefieres otro? existentes: X, Y, Z)"]
- ISBN: [isbn]
- Serie: [series or "Ninguna"]
- Sinopsis: [synopsis]
```

**Never skip asking for dateRead and cover.** The user must provide these.

### Step 4: Upload the cover image

The user will provide a file path for the cover image. Upload it first:

```bash
bash scripts/skills/upload-kimo.sh books "[book-id]" "/ruta/imagen.jpg"
```

The response will contain the uploaded file info. Extract the filename from the `ruta` field.

### Step 5: Create the book

```bash
bash scripts/skills/add-book.sh '{"title":"[title]","author":"[author]","language":"[Español or Inglés]","cover":"[uploaded-filename.jpg]","dateRead":"[YYYY-MM]","genre":"[genre]","isbn":"[isbn]","series":"[series]","synopsis":"[synopsis]"}'
```

### Step 6: Confirm

Tell the user: **"Libro creado correctamente con ID: `[generated-id]`"**

## Important Notes

- The `id` is auto-generated from the title using `slugify()`: lowercase, accents removed, spaces → hyphens, max 80 chars
- If the ID already exists, the API returns a 409 error. Add `-2`, `-3` etc. to resolve
- The cover image filename stored is just the name, not the full path (e.g. `"libro001.jpg"`, not `"/images/books/libro001.jpg"`)
- The backend must be running on `localhost:3001`
- Auth token comes from `KIMO_PASSWORD_HASH` in `.env`
