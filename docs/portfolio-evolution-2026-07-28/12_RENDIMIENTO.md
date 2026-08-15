# Rendimiento

## Build final

| Chunk | Minificado | Gzip |
| --- | ---: | ---: |
| Entrada | 11.53 kB | 4.23 kB |
| Shell principal | 67.18 kB | 19.41 kB |
| Recruiter | 6.00 kB | 2.02 kB |
| Projects | 20.49 kB | 6.27 kB |
| Stack | 78.52 kB | 25.70 kB |
| Loot Map | 5.97 kB | 2.41 kB |
| Three.js | 557.27 kB | 146.67 kB |

`dist`: 163 archivos, 152,437,021 bytes.

## Decisiones

- Recruiter, Projects, Stack, Contact, Loot Map, Credits y ThreeSky siguen diferidos.
- El mundo no se monta durante Intro.
- Preload limitado a imágenes críticas del mundo.
- GlobalTicker pausa con documento oculto.
- ThreeSky e iconos 3D reducen actividad con reduced motion.
- Recursos 3D se eliminan al desmontar.

## Riesgo

Three.js mantiene warning de chunk mayor a 500 kB minificado. No se alteró el umbral para ocultarlo. El tamaño total de `dist` está dominado por assets públicos preservados.
