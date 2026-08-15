# 08_NEXT_EXECUTION_PLAN

## Fase 0: Congelar documentacion (esta fase)

- Backup con timestamp
- Auditoria read-only
- Documentos base y guardrails

## Fase 1: Scripts y calidad (sin redisenar)

- Proponer `lint` (ESLint) y `format` (Prettier)
- Proponer `test` (Vitest) para piezas criticas (InteractionSystem, flags, helpers)

## Fase 2: CSS sensible (reorganizacion sin cambios visuales)

- Extraer bloque EchoPortal de `index.css` a `src/styles/echo-portal.css`
- Mantener mismos estilos (cambio mecanico)

## Fase 3: Asset map semantico (sin renombrar aun)

- Crear indice de assets y convencion de naming

## Fase 4: Pulido visual controlado

- Cambios pixel-perfect con reglas: un cambio por PR, rollback, verificacion visual

## Fase 5: Performance

- Split chunks (dynamic import) en modales pesados (StackScreen)
- Revisar Three.js (reduccion de work por frame)

## Fase 6: Preparacion portafolio publico

- README real + deploy plan
- Licencias/creditos de assets si aplica

