# Errores corregidos

## P0.1 — Weapons

- **Causa raíz verificada:** `019_w1a2bcg.png` no existe y los tres registros lo compartían.
- **Solución:** los tres registros conservan sus datos y apuntan a `024_daniel-unibe-pistola-2.jpg` (242,593 bytes, 1920×1920).
- **Evidencia:** filesystem y navegación local con `naturalWidth=1920`.

## P0.2 — Resize

- **Causa raíz verificada:** el hook sólo inicializaba el scroll y no reaccionaba a cambios de anchura.
- **Solución:** listener `resize` que restablece `activeIndex × window.innerWidth` sin animación.
- **Estado runtime:** NO VERIFICADO por el bloqueo posterior del navegador.

## P0.3 — Notch móvil

- **Causa raíz verificada:** grid central con mínimo 210 px más controles laterales excedía el ancho disponible.
- **Solución:** en `<=480px`, display, transporte y volumen pasan a tres filas; botones principales y volumen son 44×44 px.
- **Estado visual:** NO VERIFICADO por el bloqueo posterior del navegador.

## P0.4 — Credits autoplay

- **Causa raíz verificada:** `useEffect` ejecutaba `setCurrentIndex(..., { autoplay: true })` al montar.
- **Solución:** se eliminó ese efecto; solo `Play theme` mantiene la llamada explícita.
- **Estado runtime:** NO VERIFICADO por el bloqueo posterior del navegador.
