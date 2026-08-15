# 16 — Contrato para futuros agentes

## Reglas operativas

1. Leer `AGENTS.md`, `CODEX_GUARDRAILS.md`, `DESIGN.md` y el documento maestro antes de editar.
2. No cambiar arquitectura, diseño aprobado o contratos públicos sin autorización.
3. No reescribir componentes completos por comodidad.
4. No eliminar dependencias/archivos aparentemente sin uso sin import graph, runtime y aprobación.
5. No agregar dependencias sin justificar propósito, licencia, bundle y rollback.
6. Mantener TypeScript y nombres/props públicos salvo tarea de migración.
7. Trabajar un módulo/objetivo por vez; no mezclar refactor con corrección visual.
8. Preservar worktree sucio; no reset, stash, clean, checkout, commit, push ni `git add -A` sin solicitud.
9. Localizar textos/assets/selectores con `rg` y confirmar duplicados antes de UI/CSS.
10. Proteger `index.css .echo-*`, `EchoPortal`, `App`, Interaction, audio, runtime flags, Horizon y datos.
11. Ejecutar al menos TypeScript/build y la prueba específica del flujo tocado.
12. Separar error previo de regresión introducida.
13. Registrar archivos modificados, evidencia, límites, riesgos y rollback.
14. Detenerse ante secretos, pérdida de datos, licencias dudosas o autoridad insuficiente.
15. No afirmar éxito desde build solamente cuando la tarea exige runtime/visual/device.

## Archivos protegidos y validación requerida

| Archivo/sistema | Sensibilidad | Después de tocar | Rollback |
| --- | --- | --- | --- |
| `src/App.tsx` | orquestador/modal/nav | build + Intro + 5 screens + Settings | revert diff local |
| `index.css` | 1,054 líneas globales | 10 viewports + visual compare | revert bloque exacto |
| `.echo-*` / `EchoPortal` | diseño protegido | Norte 10 viewports y animación | revert CSS+component juntos |
| `Horizon`/zones/hook | scroll/posiciones | O/N/E + resize + props | revert archivos de zona |
| `InteractionSystem` | listeners/copy/toast | hover/Ctrl/Shift+Click + cleanup | revert un archivo |
| `MusicPlayerContext`/Notch | audio transversal | paused initial, controls, modal duck, Credits | revert context/UI |
| `config/assets.ts` | manifiesto global | script 0 missing + visual world/Stack | restaurar ruta previa |
| `runtimeFlags.ts` | fallbacks | build con flags on/off | revert flag |
| Projects data/screen | contenido/iframes/video | categorías, media, links, mobile | revert data/UI por separado |
| Stack data/viewers | catálogo/WebGL | Software/Weapons + context count | revert item/viewer |

## Plantilla estándar

```text
TAREA:
CONTEXTO:
OBJETIVO:
ALCANCE:
ARCHIVOS PERMITIDOS:
ARCHIVOS PROTEGIDOS:
COMPORTAMIENTO ACTUAL:
COMPORTAMIENTO ESPERADO:
CRITERIOS DE ACEPTACIÓN:
VALIDACIONES:
RIESGOS:
ROLLBACK:
ENTREGA:
```

## Plantilla de entrega

```text
RESULTADO:
ARCHIVOS MODIFICADOS:
CAMBIOS PREEXISTENTES PRESERVADOS:
VALIDACIONES Y CÓDIGOS DE SALIDA:
EVIDENCIA RUNTIME/VISUAL:
NO VERIFICADO:
RIESGO RESIDUAL:
ROLLBACK:
```

