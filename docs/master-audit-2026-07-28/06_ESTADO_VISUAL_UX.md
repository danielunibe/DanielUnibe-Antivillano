# 06 — Estado visual y UX/UI

## Sistema actual

- **Tema:** western sci-fi / Borderlands, HUD diegético, loot panels y portfolio cinematográfico.
- **Paleta:** amarillo `#F2D019`/`#ffaa00`, cyan `#00F0FF`, negro/grises, rojo `#ef4444`, acentos por categoría.
- **Tipografía:** Teko/Anton para titulares; Roboto Mono/Share Tech Mono para telemetría; Roboto Condensed auxiliar.
- **Forma:** clip-path angulares, skew, bordes negros, hazard stripes, marcos raster, tarjetas fullscreen.
- **Profundidad:** WebGL sky, nubes, horizon masks, blur, glow, scanlines, grid, viñeta, niebla y capas z-index.
- **Movimiento:** intro, pulse, scanlines, EchoPortal por fases, fog/wind, créditos, transiciones de modales y viewers 3D.

## Evaluación por experiencia

| Módulo | Claridad | Jerarquía | Coherencia | Legibilidad | Impacto | Observación |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Intro | 4 | 4 | 4 | 4 | 4 | clara, pero añade espera artificial |
| Norte | 3 | 4 | 5 | 3 | 5 | identidad potente; CTAs compiten y recortan |
| Oeste | 3 | 3 | 4 | 3 | 4 | el mapa parece funcional, pero no enlaza |
| Este | 3 | 3 | 4 | 3 | 4 | acceso Stack depende de prop visual |
| Stack | 4 | 4 | 5 | 4 | 5 | densidad alta; armas rotas bajan calidad |
| Projects | 4 | 4 | 5 | 4 | 5 | flujo en tres pasos explícito |
| Contact | 4 | 4 | 4 | 4 | 4 | contenido provisional contradice “Operational” |
| Credits | 3 | 4 | 5 | 3 | 5 | roll largo y autoplay discutible |
| Music notch | 3 | 4 | 5 | 2 | 4 | compacto, pero touch targets pequeños |

Puntuaciones de 0 a 5 son juicio razonado, no métricas científicas.

## CSS y consistencia

- `index.css`: 1,054 líneas físicas, 12 valores ≥100 px, 25 `position:absolute`, sin media queries explícitas.
- Responsive depende principalmente de clases Tailwind en JSX.
- `src/styles/interactions.css` y `base.css` contienen un `!important` cada uno.
- Hay valores mágicos de `vh`, `vw`, `px`, `calc` y z-index hasta cinco dígitos.
- `.echo-*` es contrato protegido. No rediseñar ni extraer sin tarea dedicada y comparación visual.
- Los fullscreen comparten dot grid/vignette, lo que mejora coherencia.

## Estados de interacción

- Hover y active están bien representados en desktop.
- Focus visible existe en Credits terminal y algunos inputs por CSS; no es consistente en todos los botones.
- Disabled se usa en navegación y música.
- No existe sistema central de tokens de espaciado/tipografía/color; la consistencia es convencional y por copy/paste.

## Problemas visuales confirmados

- Weapons muestra imagen rota.
- En móvil el Norte recorta gran parte del EchoPortal y prioriza Credits/Contact.
- A 390/360 px se recortan controles de volumen.
- En ultrawide la identidad queda concentrada a la izquierda con vacío central/derecho considerable; puede ser intencional, pero requiere aprobación creativa.
- La Intro usa `© 2024`, posiblemente obsoleto.
- La UI afirma `System Integrity Operational` y estados `LIVE/COMPLETE` sin validación externa.

## Deuda visual no confirmada como defecto

- Contraste exacto WCAG no medido.
- Coherencia de cada animación en GPU modesta no medida.
- Zoom 200/400 %, alto contraste de Windows y forced-colors no probados.
- Capturas ultrawide se guardaron en mosaicos por límite de 1,675 px del capturador, no por fallo de la app.

