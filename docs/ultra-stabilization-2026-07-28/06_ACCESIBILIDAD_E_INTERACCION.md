# Accesibilidad e interacción

## Implementado

- Intro es la única superficie interactiva antes de iniciar; el HUD no queda invisible pero focusable.
- Arsenal, Contact, Projects, Tactical Map, nodos del mapa y celdas del inventario son botones con nombre accesible.
- Overlays: `role=dialog`, `aria-modal`, fondo `inert`, foco inicial tras lazy-load, Escape inmediato, trampa Tab/Shift+Tab y restauración de foco con fallback.
- Playlist: toggle táctil/teclado, `aria-expanded`, `aria-controls`, nombres accesibles y status live moderado.
- Contact: feedback visible y `aria-live` para copia o error.
- Reduced motion evita scroll suave, movimiento continuo del cielo/fog/iconos y convierte Credits en transcript desplazable.
- Loot Map se abre con Enter y sus nodos comunican `aria-pressed`.

## Validado

- DOM accesible de Intro, mundo, Stack/Weapons, Projects, Loot Map, Contact, Credits y Settings.
- Escape cerró un modal dentro de los primeros 150 ms.
- Consola final: 0 errores, 0 warnings en el recorrido observado.

## No verificado

NVDA/JAWS/VoiceOver, navegación switch, touch físico y forced-colors.

