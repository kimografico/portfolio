# Guía de uso: SDD Orchestrator — kimografico portfolio

> Esta guía es para ti, no para los agentes. Explica cómo funciona el agente orquestador SDD, cómo invocarlo y cuáles son los pasos esperados hasta completar el proyecto.

---

## ¿Qué es el SDD Orchestrator?

Es un agente de VS Code Copilot que gestiona el flujo **Spec-Driven Development (SDD)** en este proyecto. Su función es coordinar una cadena de skills especializados (init, explore, propose, spec, design, tasks, apply, verify, archive) para que cada cambio que hagas en el proyecto esté:

1. **Documentado antes de implementarse** (propuesta + specs + diseño)
2. **Desglosado en tareas concretas** (tasks.md)
3. **Implementado siguiendo lo documentado** (apply)
4. **Verificado antes de cerrar** (verify con tests reales)
5. **Archivado con trazabilidad** (archive)

El resultado queda en una carpeta `openspec/` en la raíz del repositorio, que actúa como memoria del proyecto.

---

## Cómo invocar el agente

En el chat de GitHub Copilot (VS Code), selecciona el agente **SDD Orchestrator** en el selector de agentes y escríbele en lenguaje natural. Ejemplos:

```
sdd init
```

```
nueva fase: fase-1-setup
```

```
quiero implementar la sección de libros
```

```
explorar cómo hacer el toggle de vista (galería/tabla)
```

```
verificar fase-1-libros
```

```
archivar fase-1-libros
```

---

## El ciclo SDD en detalle

Cada "cambio" (feature, fase, fix) pasa por estas etapas. No todas son obligatorias para todos los cambios, pero el orden siempre se respeta:

```
init → explore → propose → spec → design → tasks → apply → verify → archive
```

| Etapa       | Qué produce                  | Cuándo es opcional                  |
| ----------- | ---------------------------- | ----------------------------------- |
| **init**    | `openspec/config.yaml`       | Solo la primera vez                 |
| **explore** | `exploration.md`             | Cuando no hay incertidumbre técnica |
| **propose** | `proposal.md`                | Nunca (siempre recomendado)         |
| **spec**    | `specs/{dominio}/spec.md`    | Nunca                               |
| **design**  | `design.md`                  | Nunca                               |
| **tasks**   | `tasks.md`                   | Nunca                               |
| **apply**   | Código real                  | Nunca                               |
| **verify**  | `verify-report.md`           | Nunca (gate de calidad)             |
| **archive** | Mueve el cambio a `archive/` | Solo si verify está en PASS         |

---

## Estructura de ficheros que genera el agente

```
openspec/
├── config.yaml                          ← Contexto del proyecto (generado en init)
├── specs/                               ← Especificaciones master (fuente de verdad)
│   ├── libros/
│   │   └── spec.md
│   ├── lugares/
│   │   └── spec.md
│   └── ...
└── changes/
    ├── fase-1-libros/                   ← Cambio activo
    │   ├── exploration.md
    │   ├── proposal.md
    │   ├── specs/
    │   │   └── libros/
    │   │       └── spec.md
    │   ├── design.md
    │   ├── tasks.md
    │   └── verify-report.md
    └── archive/
        └── 2026-04-21-fase-1-libros/    ← Cambio completado
```

---

## Pasos recomendados para este proyecto

Aquí tienes el orden sugerido para llevar el proyecto de cero a completo, mapeado en cambios SDD concretos.

---

### Paso 0 — Inicializar SDD (una sola vez)

```
sdd init
```

Detecta el stack, linting, testing y convenciones del proyecto. Genera `openspec/config.yaml`. Solo necesitas hacerlo una vez al principio.

---

### Fase 1 — Arquitectura base + sección personal

#### Cambio 1: `fase-1-setup`

**Qué cubre:** Inicialización del proyecto Vite, Tailwind, ESLint, Vitest, TanStack Table, Storybook, scripts de package.json, vite.config.ts para GitHub Pages, favicon, robots.txt, 404.html, meta tags Open Graph.

```
nueva fase: fase-1-setup
```

- Exploración recomendada: revisar el estado actual del repo (qué ya está hecho en la checklist de la spec)
- Diseño: estructura de ficheros base según `specifications.md §3`
- Al aplicar: seguir la checklist de `§7 Fase 1.1`

#### Cambio 2: `fase-1-cicd`

**Qué cubre:** Creación de `ci.yml` (lint + typecheck + tests + imagen check + build) y `deploy.yml` (build + GitHub Pages).

```
nueva fase: fase-1-cicd
```

- Los workflows están ya especificados en `specifications.md §6`
- El agente los generará y verificará que el pipeline funcione

#### Cambio 3: `fase-1-estructura-base`

**Qué cubre:** Tipos TypeScript en `types/index.ts`, componentes Header y Footer básicos, configuración de React Router con todas las rutas, páginas placeholder, primera story de Storybook.

```
nueva fase: fase-1-estructura-base
```

#### Cambio 4: `fase-1-datos-mock`

**Qué cubre:** Archivos JSON de datos de prueba en `/data/` (libros, lugares, portfolio-diseno, portfolio-dev) siguiendo los modelos de `specifications.md §4`.

```
nueva fase: fase-1-datos-mock
```

#### Cambio 5: `fase-1-libros`

**Qué cubre:** Sección `/kimo/libros` completa. Componente `LibroCard`, componente `LibrosTabla` (TanStack Table), toggle galería/tabla con persistencia localStorage, noindex meta tag.

```
nueva fase: fase-1-libros
```

- Este es un cambio con buena carga de lógica: la exploración previa es muy recomendable
- El agente debe escribir tests antes de implementar (TDD detectado en la spec)

#### Cambio 6: `fase-1-lugares`

**Qué cubre:** Sección `/kimo/lugares`. Componente `LugaresTabla` (TanStack Table), concatenación de nombres de lugares, ordenación por fecha y país.

```
nueva fase: fase-1-lugares
```

---

### Fase 2 — Portfolio de diseño gráfico

#### Cambio 7: `fase-2-portfolio-diseno`

**Qué cubre:** Grid de proyectos con filtro por categoría, página de detalle con galería, datos reales.

```
nueva fase: fase-2-portfolio-diseno
```

---

### Fase 3 — Portfolio de desarrollo

#### Cambio 8: `fase-3-portfolio-dev`

**Qué cubre:** Grid de proyectos de software, página de detalle con enlace a repo y demo vivo.

```
nueva fase: fase-3-portfolio-dev
```

---

### Fase 4 — Home, CV y Contacto

#### Cambio 9: `fase-4-home`

**Qué cubre:** Landing completa con presentación, proyectos destacados, carrusel de clientes.

```
nueva fase: fase-4-home
```

#### Cambio 10: `fase-4-cv-contacto`

**Qué cubre:** Página de CV interactivo, página de contacto con mailto:.

```
nueva fase: fase-4-cv-contacto
```

---

### Fase 5 — Pulido y extras

Cada sub-feature de esta fase es un cambio independiente:

| Cambio                 | Descripción                                               |
| ---------------------- | --------------------------------------------------------- |
| `fase-5-animaciones`   | Framer Motion en transiciones                             |
| `fase-5-dark-mode`     | Modo oscuro con Tailwind                                  |
| `fase-5-contacto-real` | Node.js + Nodemailer sustituyendo al mailto:              |
| `fase-5-lazy-images`   | Lazy loading de imágenes                                  |
| `fase-5-mapa`          | Mapa interactivo con react-simple-maps en `/kimo/lugares` |
| `fase-5-dominio`       | Migración kimografico.com → GitHub Pages (CNAME + DNS)    |

```
nueva fase: fase-5-dark-mode
```

---

### Fase 6 — Migración a Lit (opcional)

Solo si quieres profundizar en Web Components y Lit. Se hace componente a componente, empezando por `basics/` y luego `combinations/`.

```
nueva fase: fase-6-lit-basics
```

---

## Flujo típico de una sesión de trabajo

Así es como se ve una sesión normal:

1. **Abres Copilot chat** y seleccionas el agente **SDD Orchestrator**
2. **Le dices qué quieres hacer:**
   ```
   quiero implementar la sección de libros
   ```
3. **El agente te propone el nombre del cambio** (`fase-1-libros`) y ejecuta las fases en orden:
   - Exploration → lee el código actual, analiza opciones
   - Proposal → propuesta formal con alcance y riesgos
   - Spec → requisitos y escenarios (Given/When/Then)
   - Design → cómo se estructura el código, qué ficheros se tocan
   - Tasks → checklist desglosada en pequeñas tareas
4. **Revisas el tasks.md** antes de que empiece a escribir código
5. **Dices "aplica"** y el agente implementa, marcando tareas `[x]` conforme avanza
6. **El agente verifica:** ejecuta `pnpm test` y `pnpm typecheck` desde `/frontend`
7. **Si todo pasa:** archivar el cambio
   ```
   archivar fase-1-libros
   ```

---

## Comandos de referencia rápida

| Lo que quieres hacer            | Qué escribirle al agente                              |
| ------------------------------- | ----------------------------------------------------- |
| Inicializar SDD por primera vez | `sdd init`                                            |
| Empezar un nuevo cambio         | `nueva fase: {nombre-cambio}`                         |
| Solo explorar una idea          | `explorar {tema}`                                     |
| Crear propuesta de un cambio    | `propuesta para {change-name}`                        |
| Escribir specs de un cambio     | `specs para {change-name}`                            |
| Escribir el diseño técnico      | `diseño para {change-name}`                           |
| Generar el task breakdown       | `tareas para {change-name}`                           |
| Implementar (aplicar tareas)    | `aplicar {change-name}` o `implementar {change-name}` |
| Verificar (tests + checks)      | `verificar {change-name}`                             |
| Archivar un cambio completado   | `archivar {change-name}`                              |
| Ver el estado de un cambio      | `estado de {change-name}`                             |

---

## Notas importantes

- **El agente nunca escribe código sin haber leído antes la spec y el diseño.** Si intentas pedirle que implemente algo sin artefactos previos, te pedirá que primero se hagan las fases anteriores.
- **El archive solo ocurre si verify está en PASS.** Si hay tests fallando o errores de tipos, el cambio no se puede cerrar.
- **Puedes retomar un cambio a medias.** El agente detecta qué artefactos ya existen y continúa desde donde se dejó.
- **Los artefactos en `openspec/specs/` son la fuente de verdad.** A medida que completas cambios, esos specs se van actualizando con el comportamiento real del sistema.
- **Proyecto didáctico:** el agente está configurado para explicar las decisiones técnicas, patrones usados y alternativas. Úsalo para aprender, no solo para generar código.

---

## Archivos relevantes

| Archivo                                    | Propósito                                                                        |
| ------------------------------------------ | -------------------------------------------------------------------------------- |
| `.github/agents/sdd-orchestrator.agent.md` | Definición del agente orquestador                                                |
| `.github/sdd/`                             | Skills SDD (init, explore, propose, spec, design, tasks, apply, verify, archive) |
| `.github/specifications.md`                | Especificaciones completas del proyecto                                          |
| `copilot-instructions.md`                  | Instrucciones base de Copilot para el proyecto                                   |
| `openspec/`                                | Artefactos SDD generados (se crea al hacer `sdd init`)                           |
