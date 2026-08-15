# Estabilización 2026-07-28 — resumen ejecutivo

## Resultado

Se completaron cambios acotados para los cuatro defectos P0 y una primera capa P1 de interacción, movimiento reducido e iframe. TypeScript y build finalizaron en exit 0 después de cada bloque.

## Hechos verificados

- Weapons ya no referencia el PNG inexistente `019_w1a2bcg.png`; usa el render local existente `024_daniel-unibe-pistola-2.jpg`.
- El asset nuevo respondió localmente y el navegador informó `complete=true`, `naturalWidth=1920`, `naturalHeight=1920`.
- `useParallaxScroll` vuelve a convertir el sector activo a píxeles al recibir `resize`.
- Credits no ejecuta ninguna selección/reproducción de pista durante su montaje; `Play theme` conserva esa decisión explícita.
- El notch tiene un layout móvil de tres filas con botones de 44×44 px en `<=480px`.

## Límites

La automatización de navegador permitió iniciar la app y verificar la respuesta/naturalWidth del asset, pero su política bloqueó la siguiente recarga/redimensión. Resize secuencial, clipping visual móvil, flujo de Credits, Escape/foco e iframe quedan **NO VERIFICADOS en runtime** en esta intervención.

No se declara producción lista, optimización de media, WCAG formal ni QA integral.
