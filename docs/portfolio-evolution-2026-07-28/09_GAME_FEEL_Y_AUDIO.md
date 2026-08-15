# Game feel y audio

## Estados

- Controles usan hover, focus-visible, pressed, disabled y selected donde corresponde.
- Cambios de proyecto/herramienta mantienen feedback de clic existente.
- La misión responde a progreso real y puede compactarse.
- Los modales conservan animación de entrada/salida y cierre inmediato por Escape.

## Audio

- Intro y Credits no inician audio automáticamente.
- Music Provider solo se habilita después de entrar.
- Abrir Credits no altera la pista ni fuerza reproducción.
- El tema de Credits requiere `Play theme`.
- Mute restaura el volumen previo.
- Errores de playlist tienen estado visible.

## Reduced motion

El código conserva ramas `matchMedia('(prefers-reduced-motion: reduce)')` para navegación, ThreeSky e iconos 3D, más reglas CSS que reducen animaciones. La emulación runtime del media query no estuvo disponible en el navegador de esta ejecución y se clasifica **NO VERIFICADO**.
