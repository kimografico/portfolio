---
name: testing
description: >
  Testing patterns and conventions for kimografico using Vitest + Testing Library.
  Use when: writing unit tests, integration tests, or reviewing test quality for React components.
  Triggers: "escribe tests", "qué testear", "test de comportamiento", "cómo testear".
license: MIT
metadata:
  author: kimografico
  version: "1.0"
---

# Testing Skill — kimografico

Stack: **Vitest + @testing-library/react + @testing-library/user-event**

---

## Principio fundamental

> Testea **comportamiento**, no implementación.

El usuario no sabe que existe un `useState`. Sabe que hace click en un botón y algo cambia en pantalla. Los tests deben reflejar eso.

```ts
// ❌ MAL — testea implementación interna
expect(component.state.isOpen).toBe(true);

// ✅ BIEN — testea lo que el usuario ve
expect(screen.getByRole("dialog")).toBeInTheDocument();
```

---

## Estructura de un test file

```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  // Grupo 1: rendering básico
  describe('rendering', () => {
    it('muestra el título correctamente', () => { ... })
    it('no muestra X cuando prop Y no está', () => { ... })
  })

  // Grupo 2: interacciones
  describe('interacciones', () => {
    it('llama a onX cuando el usuario hace click en Y', async () => { ... })
  })

  // Grupo 3: estados y edge cases
  describe('estados', () => {
    it('muestra estado vacío cuando no hay datos', () => { ... })
    it('muestra estado de error cuando X falla', () => { ... })
  })
})
```

---

## Patrones por tipo de test

### Rendering básico

```ts
it('renderiza el título', () => {
  render(<LibroCard titulo="El nombre del viento" autor="Rothfuss" />)
  expect(screen.getByText('El nombre del viento')).toBeInTheDocument()
  expect(screen.getByText('Rothfuss')).toBeInTheDocument()
})
```

### Condicional (mostrar/ocultar)

```ts
it('muestra "Recomendado por" solo cuando el campo existe', () => {
  const { rerender } = render(<LibroCard {...base} />)
  expect(screen.queryByText(/Rec\. por/)).not.toBeInTheDocument()

  rerender(<LibroCard {...base} recomendadoPor="Laura" />)
  expect(screen.getByText(/Rec\. por Laura/)).toBeInTheDocument()
})
```

### Interacciones de usuario

```ts
it('invierte el orden al hacer segundo click en la misma cabecera', async () => {
  const user = userEvent.setup()
  render(<LibrosTabla libros={mockLibros} />)

  const cabecera = screen.getByRole('columnheader', { name: /Autor/i })
  await user.click(cabecera)
  await user.click(cabecera)

  const filas = screen.getAllByRole('row').slice(1) // excluir header
  expect(filas[0]).toHaveTextContent('Zweig') // Z antes que A en orden inverso
})
```

### Persistencia en localStorage

```ts
it('guarda la preferencia de vista en localStorage', async () => {
  const user = userEvent.setup()
  render(<PaginaLibros libros={mockLibros} />)

  const toggle = screen.getByRole('button', { name: /tabla/i })
  await user.click(toggle)

  expect(localStorage.getItem('libros-vista')).toBe('tabla')
})
```

### Integración con datos mock

```ts
it('la ruta /kimo/libros carga y renderiza las cards', async () => {
  render(
    <MemoryRouter initialEntries={['/kimo/libros']}>
      <App />
    </MemoryRouter>
  )

  expect(await screen.findByText('El nombre del viento')).toBeInTheDocument()
})
```

### Mocks de módulos

```ts
// Mock de un loader de datos
vi.mock("../data/loaders", () => ({
  cargarLibros: vi.fn().mockResolvedValue(mockLibros),
}));

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });
```

---

## Datos mock

Define mocks cerca de los tests que los usan. Para datos reutilizados, crear `src/__mocks__/`:

```ts
// src/__mocks__/libros.ts
import { Libro } from "../types";

export const mockLibros: Libro[] = [
  {
    id: "el-nombre-del-viento",
    titulo: "El nombre del viento",
    autor: "Patrick Rothfuss",
    idioma: "Español",
    caratula: "/images/books/el-nombre-del-viento.jpg",
    fechaFinLectura: "2023-04",
    genero: "Fantasía",
  },
  {
    id: "carta-a-un-joven-poeta",
    titulo: "Cartas a un joven poeta",
    autor: "Rainer Maria Rilke",
    idioma: "Español",
    caratula: "/images/books/rilke.jpg",
    fechaFinLectura: "2022-11",
    genero: "Ensayo",
    recomendadoPor: "Laura",
  },
];
```

---

## Qué testear por tipo de componente

### Componentes `basics/` (átomos)

- Renderiza correctamente con props obligatorias
- Variantes visuales existen en el DOM (no que "se ven bien")
- Props opcionales no rompen el render cuando faltan
- Callbacks se invocan al interactuar

### Componentes `combinations/` (moléculas)

- Composición correcta de basics
- Interacciones propias del combination (hover state, click)
- Prop `recomendadoPor` aparece/desaparece condicionalmente

### Componentes `compositions/` (organismos)

- Ordenación: click en cabecera → filas en orden correcto
- Doble click → orden invertido
- Concatenación de arrays en columnas (lugares)
- Toggle visible y funciona

### Páginas `pages/`

- La ruta carga y no explota
- Datos mock aparecen en pantalla
- Interacciones principales (toggle, filtro, ordenación) funcionan end-to-end

---

## Queries de Testing Library (orden de preferencia)

```
1. getByRole          → accesible y semántico (PREFERIDO siempre)
2. getByLabelText     → formularios
3. getByPlaceholderText → inputs sin label visible
4. getByText          → texto visible al usuario
5. getByDisplayValue  → valor actual de un input
6. getByAltText       → imágenes
7. getByTitle         → atributo title
8. getByTestId        → ÚLTIMO RECURSO — solo si no hay otra opción
```

---

## Antipatrones prohibidos

```ts
// ❌ No usar getByTestId salvo último recurso
screen.getByTestId('mi-componente')

// ❌ No testear estilos concretos
expect(element).toHaveStyle('font-size: 16px')

// ❌ No acceder a estado interno
expect(wrapper.vm.isOpen).toBe(true)  // Vue
expect(component.instance().state).toEqual(...)  // React class

// ❌ No usar snapshot tests para lógica (solo para detectar regresiones visuales específicas)
expect(container).toMatchSnapshot()

// ❌ No mockear lo que no necesitas mockear
vi.mock('react')  // nunca
```

---

## Setup global

El setup de tests está en `src/setupTests.ts`:

```ts
import "@testing-library/jest-dom";
// Aquí van los mocks globales (localStorage, fetch, etc.)
```

Y configurado en `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    globals: true,
  },
});
```

---

## Tests que tienen que pasar en Fase 1 (según specifications.md)

| Test                                              | Componente       | Tipo        |
| ------------------------------------------------- | ---------------- | ----------- |
| LibroCard renderiza título y autor                | `LibroCard`      | Unit        |
| LibroCard muestra "Rec. por X" solo si existe     | `LibroCard`      | Unit        |
| LibrosTabla ordena por autor al click             | `LibrosTabla`    | Unit        |
| LibrosTabla invierte al segundo click             | `LibrosTabla`    | Unit        |
| LugaresTabla concatena nombres de lugares         | `LugaresTabla`   | Unit        |
| Datos mock cumplen los tipos TypeScript           | `types/index.ts` | Type        |
| `/kimo/libros` carga, renderiza y toggle funciona | `PaginaLibros`   | Integration |
| `/kimo/lugares` carga y muestra tabla             | `PaginaLugares`  | Integration |
