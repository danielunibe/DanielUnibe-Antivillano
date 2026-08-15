# P0 corregidos

## P0.1 — Weapons

- La configuración usa el render local existente `024_daniel-unibe-pistola-2.jpg`.
- Runtime: `complete=true`, `naturalWidth=1920`, `naturalHeight=1920`.
- No se creó, movió ni renombró ningún asset.

## P0.2 — resize/parallax

- El índice se clampa a 0–2 y se sincroniza antes de navegar.
- El resize usa `clientWidth` y asignación directa de `scrollLeft` en `requestAnimationFrame`, evitando que `scroll-smooth` anime una corrección geométrica.
- Ratios medidos: Oeste 0, Norte 1, Este 2 en los diez viewports y retorno a 1920.

## P0.3 — notch móvil

- Layout de tres filas, skew neutralizado y controles de 44×44 px.
- Playlist ahora se abre con un botón persistente `aria-expanded`, no solo hover.
- Mute, volumen, transporte y slider permanecen dentro de 360/390 px.

## P0.4 — Credits

- Abrir Credits no llama a selección/reproducción.
- Medición final antes/después: misma pista, `STOPPED`, volumen `0.65`.
- `Play theme` sigue siendo una acción explícita.

## Puerta

**CERRADA.** No quedan P0 conocidos abiertos dentro del recorrido ejecutado.

