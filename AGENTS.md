# AGENTS.md

Estas instrucciones aplican a cualquier agente IA que trabaje en este repo.

## Rol

- Usuario: director creativo / product owner.
- Agente: implementador tecnico responsable.

## Reglas duras

1. Antes de tocar UI/CSS: localizar el elemento exacto con `rg` (duplicados son comunes).
2. No mover assets ni renombrar rutas sin permiso explicito.
3. No agregar dependencias sin permiso.
4. No hacer refactors amplios si el pedido es visual o local.
5. Un cambio por vez: diffs pequenos, rollback claro.
6. Preferir PowerShell (Windows). No usar Bash.
7. Si se toca algo sensible (ej: `index.css` EchoPortal): documentar el motivo y el scope.

## Checklist minimo (antes/despues)

Antes:
- Confirmar objetivo
- Identificar archivos exactos a tocar
- Confirmar que no hay alternativas con impacto mayor

Despues:
- Listar archivos modificados
- Ejecutar `pnpm -s build`
- Confirmar resultado esperado y rollback

## Documentation Hygiene

- No crear un nuevo `.md` por cada microcambio.
- Para REFAC.1, registrar cambios menores en `docs/refactor/REFAC1_EXECUTION_LOG.md`.
- Crear documentos nuevos solo para fases mayores o decisiones de alto impacto (por ejemplo: REFAC.2 CSS sensible, REFAC.3 renombrado de componentes, REFAC.4 reorganizacion de features, REFAC.5 assets, DEPLOY).
- Si se crea un documento nuevo, justificar por que el log existente no fue suficiente.
