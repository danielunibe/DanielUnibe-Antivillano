# 14 — Plan de ejecución recomendado

## Fase 1 — Consolidación del estado real

- **Objetivo:** aceptar esta auditoría como baseline fechado.
- **Tareas:** revisar hallazgos con PO; decidir qué contenido es final.
- **Entregable:** matriz aprobada y decisiones asignadas.
- **Salida:** no hay hallazgos disputados sin estado.
- **No tocar:** arquitectura/UI.

## Fase 2 — Bloqueos

- **Objetivo:** eliminar fallos visibles y riesgos de release.
- **Tareas:** weapon asset/fallback; licencias; hosting root/subpath; contactos/CV.
- **Dependencias:** decisiones de contenido/licencia/hosting.
- **Salida:** cero assets rotos y datos públicos aprobados.
- **No tocar:** EchoPortal salvo bug explícito.

## Fase 3 — Calidad automatizada

- **Objetivo:** impedir regresiones.
- **Tareas:** scripts lint/typecheck/format; tests de assets/playlist/flags; smoke E2E de Intro y modales.
- **Riesgo:** reglas nuevas pueden revelar deuda preexistente; registrar baseline.
- **Salida:** gates reproducibles en limpio.

## Fase 4 — Accesibilidad estructural

- **Objetivo:** navegación completa por teclado/AT.
- **Tareas:** modal primitive; semántica de props/nodos; Escape; foco; reduced motion.
- **Dependencia:** tests de Fase 3.
- **Salida:** recorrido sin mouse documentado.
- **No tocar:** composición visual más allá de focus/targets necesarios.

## Fase 5 — Definición funcional

- **Objetivo:** eliminar puntos muertos.
- **Tareas:** contrato Loot Map, Contact live, audio, fallbacks, comportamiento ABRIR.
- **Salida:** cada CTA tiene resultado y error state.

## Fase 6 — Consolidación visual

- **Objetivo:** aprobar Norte y fullscreen por resolución.
- **Tareas:** notch móvil, resize, ultrawide, contraste, zoom.
- **Dependencias:** contrato responsive y dispositivos objetivo.
- **Salida:** capturas aprobadas en 10 viewports.
- **No tocar:** rediseño global o reemplazo del concepto HUD.

## Fase 7 — Contenido final

- **Objetivo:** publicación honesta.
- **Tareas:** stats, proyectos, créditos, email, redes, CV, año legal, licencias.
- **Salida:** checklist editorial firmado.

## Fase 8 — Rendimiento

- **Objetivo:** cumplir presupuesto medido.
- **Tareas:** Lighthouse/profiling; video; lazy screens/Three; preload; fonts.
- **Dependencia:** presupuesto y hardware/navegador objetivo.
- **Salida:** comparación antes/después sin regresión visual.

## Fase 9 — QA integral

- **Objetivo:** verificar historia completa.
- **Tareas:** browsers, viewports, teclado, lector, offline, WebGL off/context loss, audio permisos, enlaces.
- **Salida:** defects cerrados o aceptados, evidencia reproducible.

## Fase 10 — Publicación

- **Objetivo:** release reversible.
- **Tareas:** metadata, base path, preview producción, deploy, smoke post-deploy, rollback.
- **Salida:** URL aprobada y checklist.

## Fase 11 — Mantenimiento

- **Objetivo:** continuidad entre agentes.
- **Tareas:** actualizar master state por release, changelog, dependabot/audit controlado, backups.
- **Salida:** documentación vigente y ownership claro.

No se recomienda reescritura completa: la arquitectura actual compila, corre y sus módulos están separados suficientemente para una estabilización incremental.

