# 03_VISUAL_SYSTEM

## Estetica general

- HUD/AAA con alto contraste: negro dominante + acentos amarillos/cyan
- Bordes angulares, skew, clip-path
- Efectos: glow, scanlines, grid textures, blur/backdrop
- Tipografia: titulares con `Teko`/`Anton`, telemetria con fuentes mono

## Paleta observada (indicativa)

- Amarillo HUD: `#F2D019` (y variantes `#ffaa00`)
- Cyan HUD: `#00F0FF`
- Base: negros/grises muy oscuros (`#050505`, `#080808`, etc.)
- Rojo peligro: `#ef4444`

## Tipografias

Desde `index.tsx`:
- Teko (300/400/600/700)
- Roboto Mono (400/700)
- Anton (400)
- Roboto Condensed (700)
- Share Tech Mono (400)

## Zonas sensibles (no tocar sin localizar primero)

- `index.css`:
  - bloque "ECHO PORTAL STYLES" y clases `.echo-*` (layout + animaciones)
  - estilos globales que afectan cursor, scrollbars y animaciones

## Regla de oro para cambios visuales

Antes de mover pixeles:
1. Identificar si el elemento vive en:
   - `index.css` (EchoPortal),
   - un componente React (Portal/Horizon/StackScreen),
   - o un modal (features/*Screen).
2. Buscar string/clase con `rg`.
3. Confirmar que no hay duplicados (UI/UX aparece en varias zonas).
4. Hacer el cambio minimo y verificable.

## Decisiones visuales activas

- 2026-05-21: Se retiro el selector inferior `OESTE / NORTE / ESTE`. La navegacion del mundo queda en botones laterales para liberar el escenario y evitar que el HUD tape la composicion inferior.
- 2026-05-21: El cielo WebGL con nubes queda activo por defecto. Si WebGL falla, el fallback permitido es el gradiente azul sin romper la experiencia.
- 2026-05-21: El suelo del desierto se limita a la franja inferior del viewport para no cubrir horizonte, props ni Quest Giver.
- 2026-05-21: La pantalla Quest/Portfolio usa presentacion fullscreen con modo visual limpio: la media principal queda libre por defecto, el rail lateral compacto se expande al interactuar y la metadata vive en un drawer `INFO` opcional para no tapar capturas, video o embeds.
- 2026-05-21: El reproductor no muestra texto de estado tipo `PAUSED`; usa cover, LED e icono de play/pause para una lectura mas limpia.
