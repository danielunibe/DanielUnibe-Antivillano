# SVG y assets

## Inventario SVG

- 69 SVG inline revisados; 68 declaran `viewBox`.
- El único sin `viewBox` es el lienzo de depuración de tamaño cero en `ShadowDebugger`; no participa en el render normal.
- 6 SVG externos revisados; todos declaran `viewBox`.
- Los IDs dinámicos relevantes usan `useId`; no se confirmó colisión de gradientes/filtros.
- Los iconos principales del notch ya son decorativos mediante `aria-hidden`.

## Assets

- `014_p7puwyx.png`: inexistente, sin consumidor visual real; retirado del contrato runtime `ASSETS.PROPS` y de la precarga.
- `019_w1a2bcg.png`: inexistente; Weapons usa un JPG local verificado.
- La precarga se limita a imágenes críticas del mundo, deduplicadas. Audio y feature media cargan por sus propietarios.
- Escaneo estático: 82 rutas locales encontradas, 0 archivos ausentes.

## Protección artística

No se movieron, renombraron, recortaron ni regeneraron imágenes. Se preservaron transformaciones y puntos focales del mundo; las correcciones responsive afectan contenedores/HUD.

