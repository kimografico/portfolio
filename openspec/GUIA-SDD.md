# Guía rápida para Spec-Driven Development (SDD) en kimografico-portfolio

## ¿Qué es SDD?

Spec-Driven Development es un flujo donde cada cambio relevante se documenta, diseña y verifica antes de integrarse. Todo el ciclo queda trazado en `openspec/`.

## Estructura SDD

- **openspec/config.yaml**: Configuración y convenciones SDD del proyecto.
- **openspec/specs/**: Specs "master" (fuente de verdad, solo se actualizan al archivar cambios).
- **openspec/changes/{change-name}/**: Carpeta de cada cambio activo.
  - `proposal.md`: Propuesta del cambio.
  - `specs/`: Specs y requisitos del cambio.
  - `design.md`: Diseño técnico.
  - `tasks.md`: Lista de tareas.
  - `verify-report.md`: Informe de verificación.
- **openspec/changes/archive/YYYY-MM-DD-{change-name}/**: Cambios completados y archivados.

## Convenciones

- **Nombres de cambio**: Usa kebab-case, descriptivo y corto (ej: `fase-1-libros`).
- **Specs**: Siempre en Markdown, claros y versionados por cambio.
- **Diseño técnico**: Explica decisiones, dependencias y estructura de código.
- **Tareas**: Checklist accionable, marca `[x]` al completar.
- **Verificación**: Ejecuta `pnpm test` y `pnpm typecheck` en `/frontend`.
- **Datos**: Siempre en `/data/*.json`.
- **Imágenes**: En `/frontend/public/images/`.

## Integración con el stack actual

- **React + Vite + TypeScript**: Specs deben detallar componentes, props y flujos de datos.
- **Tailwind**: No usar CSS-in-JS, documentar clases clave en specs/diseño.
- **Vitest + Testing Library**: Todo componente nuevo debe tener al menos un test básico.
- **pnpm**: Todos los comandos de frontend usan pnpm.

## ¿Cómo continuar el flujo SDD?

1. **Proponer un cambio**: Crea carpeta en `openspec/changes/{change-name}/` y añade `proposal.md`.
2. **Especificar**: Documenta requisitos en `specs/`.
3. **Diseñar**: Explica la solución en `design.md`.
4. **Desglosar tareas**: Lista pasos en `tasks.md`.
5. **Implementar**: Sigue tasks, marca `[x]` al completar.
6. **Verificar**: Ejecuta tests y typecheck, documenta en `verify-report.md`.
7. **Archivar**: Mueve el cambio a `archive/` y actualiza specs master.

---

### Recomendaciones

- Documenta TODO cambio relevante.
- Usa siempre Markdown para specs y decisiones.
- Versiona specs por cambio, nunca sobrescribas specs master directamente.
- Explica decisiones técnicas y alternativas en `design.md`.
- Mantén el flujo SDD visible para todo el equipo.

---

Para dudas, consulta `.github/specifications.md` y `copilot-instructions.md`.
