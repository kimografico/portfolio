# [SDD] Inicialización del proceso Spec-Driven Development

**Fecha:** 2026-04-22

## Resumen de acciones

- Se ha creado la estructura base para Spec-Driven Development (SDD) en el proyecto.
- Se ha generado el archivo de configuración `openspec/config.yaml` con las convenciones y stack del equipo.
- Se han creado las carpetas para specs master, cambios activos y archivo de cambios.
- Se ha documentado la guía SDD en `openspec/GUIA-SDD.md` y un README rápido en `openspec/README.md`.

## Instrucciones para el equipo

1. **Para cada cambio relevante:**
   - Crea una carpeta en `openspec/changes/{change-name}/`.
   - Añade `proposal.md` con el objetivo del cambio.
   - Documenta specs en `specs/`, diseño en `design.md`, tareas en `tasks.md`.
   - Implementa siguiendo tasks y marca `[x]` al completar.
   - Verifica con `pnpm test` y `pnpm typecheck` en `/frontend`.
   - Documenta resultados en `verify-report.md`.
   - Archiva el cambio al completar.

2. **Specs master** solo se actualizan al archivar cambios.
3. **Consulta siempre** `openspec/GUIA-SDD.md` y `.github/specifications.md` para dudas.

## Recomendaciones

- Usa Markdown para specs y decisiones.
- Explica alternativas y decisiones técnicas en `design.md`.
- Mantén el flujo SDD visible y versionado.
- Usa pnpm para todos los comandos de frontend.
- Los datos van en `/data/*.json` y las imágenes en `/frontend/public/images/`.

---

**Siguiente paso sugerido:**

- Cuando quieras proponer un cambio, crea la carpeta en `openspec/changes/{change-name}/` y añade `proposal.md`.
