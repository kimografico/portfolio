# SDD Quickstart

1. **Proponer un cambio**
   - Crea una carpeta en `openspec/changes/{change-name}/`.
   - Añade un `proposal.md` con el objetivo y alcance.
2. **Especificar**
   - Documenta requisitos y escenarios en `specs/` (Markdown).
3. **Diseñar**
   - Explica la solución técnica en `design.md`.
4. **Desglosar tareas**
   - Lista pasos en `tasks.md` (checklist).
5. **Implementar**
   - Sigue las tasks, marca `[x]` al completar.
6. **Verificar**
   - Ejecuta `pnpm test` y `pnpm typecheck` en `/frontend`.
   - Documenta resultados en `verify-report.md`.
7. **Archivar**
   - Mueve el cambio a `archive/` y actualiza specs master.

---

- Specs y diseño siempre en Markdown.
- Usa kebab-case para nombres de cambio.
- No sobrescribas specs master directamente.
- Consulta `openspec/GUIA-SDD.md` para detalles.
