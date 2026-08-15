# 03_CSS_SENSITIVE_MAP (REFAC.0)

Regla: NO modificar CSS en esta fase. Solo mapear.

| selector/clase | archivo | controla | componente relacionado | riesgo | recomendacion |
|---|---|---|---|---|---|
| `.echo-portal-root` | `index.css` | variables, base del portal | `EchoPortal` | Alto | extraer a `src/styles/echo-portal.css` en REFAC.2 sin cambiar estilos |
| `.echo-card` + `::before/::after` | `index.css` | tarjeta/hex bg | `EchoPortal` | Alto | mantener estable; cambios minimos y verificados |
| `.echo-line-uiux` | `index.css` | titulo UI/UX | `EchoPortal` | Alto | tocar solo si esta 100% localizado |
| `.echo-line-designer` | `index.css` | subtitle GAME DESIGNER | `EchoPortal` | Alto | idem |
| `.echo-stats-grid` | `index.css` | grid stats | `EchoPortal` | Alto | cambios pueden romper layout |
| `.interaction-target` | `index.css` (imports) | hover outline/behavior | `InteractionSystem` | Alto | cross-cutting |
| `.sci-fi-scroll` | `index.css` | scrollbars | multiples modales | Medio | revisar accesibilidad/contrast en fase posterior |
| `@keyframes *` (portal/scanline/etc.) | `index.css` + `src/styles/animations.css` | animaciones globales | varios | Medio-Alto | catalogar antes de mover a archivos |

