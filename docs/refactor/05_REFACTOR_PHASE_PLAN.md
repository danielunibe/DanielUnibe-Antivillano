# 05_REFACTOR_PHASE_PLAN (REFAC.0)

## REFAC.0 — Inventario y naming map

- Objetivo: documentar elementos/componentes/assets/CSS y proponer nombres.
- Archivos: `docs/refactor/*`
- Riesgo: Bajo
- Validacion: `pnpm -s build`
- Rollback: borrar docs nuevos (no toca runtime)

## REFAC.1 — Normalizar nombres internos sin mover archivos

- Objetivo: renombrar variables/labels internos de bajo riesgo (no rutas, no imports publicos).
- Riesgo: Bajo-Medio
- Validacion: build + QA visual puntual
- Rollback: revert por archivo

## REFAC.2 — Separar CSS sensible

- Objetivo: extraer `.echo-*` desde `index.css` a archivo dedicado SIN cambiar estilos.
- Riesgo: Medio (orden de import)
- Validacion: build + QA visual EchoPortal

## REFAC.3 — Renombrar componentes de entorno

- Objetivo: renombrar `Portal`/`EchoPortal`/Zonas a nombres semanticos.
- Riesgo: Medio-Alto (imports)
- Validacion: build + smoke test del mundo

## REFAC.4 — Reorganizar features

- Objetivo: consolidar naming `*Screen` vs `*Modal`, ordenar carpetas features.
- Riesgo: Medio-Alto
- Validacion: build + abrir/cerrar modales

## REFAC.5 — Renombrar assets con manifest

- Objetivo: assets semanticos, con mapping automatico y verificacion.
- Riesgo: Alto (rutas absolutas)
- Validacion: build + verificacion visual + 404 scan

## REFAC.6 — Limpieza final

- Objetivo: QA, performance, deploy readiness.
- Riesgo: Medio

