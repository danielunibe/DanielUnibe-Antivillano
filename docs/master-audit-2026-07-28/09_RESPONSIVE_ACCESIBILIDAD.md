# 09 — Responsive y accesibilidad

## Viewports evaluados

| Viewport | DOM sin overflow documental | Controles recortados | Observación visual |
| --- | --- | --- | --- |
| 3440×1440 | Sí | ninguno según DOM | portal a izquierda, gran escena; evidencia en mosaicos |
| 2560×1440 | Sí | ninguno | composición amplia |
| 1920×1080 | Sí | ninguno | composición desktop estable |
| 1600×900 | Sí | ninguno | estable |
| 1366×768 | Sí | ninguno | estable, CTAs Norte visibles |
| 1280×720 | Sí | ninguno | denso pero operable |
| 1024×768 | Sí | ninguno | recorte compositivo, controles presentes |
| 768×1024 | Sí | ninguno | portal y CTAs compiten |
| 390×844 | Sí | `volume up` | Norte recorta identidad; CTAs dominan |
| 360×800 | Sí | `volume down/up` | notch comprimido |

Cada viewport se recargó e inició desde cero para no conservar `scrollLeft`. Capturas: `evidence/world-*.png`. En >1675 px, el capturador limitó la imagen; se añadieron `-left/-right`.

## Targets táctiles

En los diez tamaños se midieron:

- Previous/Play/Next: 28×28 px.
- Volume down/up: 24×28 px.

Están por debajo de 44×44 px; esto es una observación de usabilidad, no declaración formal de incumplimiento WCAG.

## Semántica y teclado

### Correcto/parcial

- Intro, navegación, Settings, Credits terminal, botones de screens y links Contact usan elementos semánticos.
- Settings expone `aria-label`, `aria-expanded`, `aria-controls`; Escape funciona.
- Imágenes principales tienen alt; decorativas suelen usar alt vacío o `aria-hidden`.
- Slider de volumen tiene label.
- Iframe tiene title.

### Problemático/ausente

- Contact Norte y Quest Giver dependen de contenedores/imágenes clicables.
- Nodos Loot Map son `div` clicables.
- Screens fullscreen no usan `role=dialog`, `aria-modal`, `inert`, foco inicial, trap ni restauración.
- Background continúa tabulable/visible para tecnología asistiva bajo overlays.
- Escape no cierra Stack, Loot Map, Projects, Contact ni Credits.
- No hay `prefers-reduced-motion` ni control global de animaciones.
- Intro loading no anuncia progreso.
- Tooltip Ctrl/Shift+Click no tiene equivalente táctil claro.
- Playlist aparece solo por hover; teclado/touch discovery es débil.
- No hay live region confirmada para errores, carga o copy.
- Contact clipboard no ofrece feedback de éxito/error.

## Focus y orden

- Se inspeccionó el DOM y navegación básica, no un recorrido Tab exhaustivo de cada elemento.
- Focus visible consistente: `NO VERIFICADO`.
- Lector de pantalla, Voice Access y navegación por switch: `NO VERIFICADO`.
- No se declara cumplimiento WCAG.

## Sin mouse/WebGL/audio/motion

- Sin mouse: parcial; navegación principal puede usar botones, props no.
- Sin WebGL: existe fallback de gradiente por flag/error, pero falla de contexto real no se forzó.
- Sin audio: la UI sigue operable; errores SFX son silenciosos.
- Sin animaciones: no hay modo de reducción.
- Sin red: assets locales funcionan; CodePen queda sin fallback útil más allá de imagen/ABRIR.

## Bugs de responsive

### RSP-01 — Notch recortado en móvil

- Severidad: Media.
- Repro: iniciar a 390×844 o 360×800.
- Actual: uno o dos botones de volumen salen del viewport.
- Esperado: todos los controles esenciales visibles/táctiles.
- Evidencia: capturas y rects DOM.

### RSP-02 — Resize no recentra sector

- Severidad: Media.
- Repro: iniciar, cambiar ancho sin recargar.
- Actual: `scrollLeft` conserva píxeles del ancho anterior; el índice/sector visual puede desalinearse.
- Esperado: conservar sector activo y recalcular desplazamiento.
- Causa probable: `useParallaxScroll` solo inicializa en mount y calcula por `window.innerWidth` sin listener resize.

