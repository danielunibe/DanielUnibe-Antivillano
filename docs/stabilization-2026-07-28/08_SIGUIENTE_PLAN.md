# Siguiente tarea recomendada

## Tarea única

Ejecutar una regresión visual/runtime de los cuatro P0 sobre una instancia local habilitada para automatización de navegador.

## Alcance

- Sin cambios de producto salvo regresión demostrada.
- Recorrer Weapons, mundo Oeste/Norte/Este, resize sin recarga, notch y Credits.
- Capturar 1366×768, 390×844 y 360×800 como mínimo; incluir la secuencia de resize 1920→1366→1024→768×1024→390→360.

## Archivos probables

Solo `docs/stabilization-2026-07-28/03_VALIDACIONES.md` y evidencia de capturas, salvo que aparezca una regresión reproducible.

## Riesgo

El cambio de layout móvil puede revelar jerarquía visual a ajustar; no se debe rediseñar el HUD sin evidencia.

## Aceptación

- Weapons sin imágenes rotas y `naturalWidth > 0`.
- Cada sector se conserva tras cada resize.
- Sin clipping horizontal del notch ni controles fuera de viewport.
- Abrir Credits no cambia pista ni estado de reproducción; Play theme sí inicia la pista temática.
- Consola sin errores nuevos, TypeScript/build en exit 0.
