# 06_SAFE_RENAME_CHECKLIST (REFAC.0)

## Antes de renombrar

- Buscar con `rg` el nombre actual (texto, clase, componente, export, filename).
- Confirmar duplicados (ej: `UI/UX`, `StackScreen` aparece en dos rutas).
- Identificar:
  - imports TS/TSX
  - referencias en `ASSETS` / rutas publicas
  - selectores CSS relacionados
- Crear backup con timestamp.

## Durante

- Renombrar una sola cosa por commit/cambio.
- Mantener cambios pequenos.
- No mezclar renombrado con cambios visuales.

## Despues

- `pnpm -s build`
- Smoke test local:
  - abrir mundo (O/N/E)
  - abrir modales (Stack/Projects/LootMap/Contact)
  - hover/copy de InteractionSystem
- Verificar assets:
  - sin 404
  - imagenes clave visibles
- Documentar rollback.

