# 10 — Rendimiento

## Datos medidos

| Elemento | Tamaño minificado | Gzip |
| --- | ---: | ---: |
| `three` | 557.27 kB | 146.67 kB |
| vendor JS | 230.75 kB | 70.34 kB |
| feature Stack | 78.49 kB | 25.31 kB |
| app index JS | 67.24 kB | 19.75 kB |
| feature Projects | 18.28 kB | 5.63 kB |
| CSS index | 101.45 kB | 18.83 kB |
| CSS vendor/fonts | 35.70 kB | 18.60 kB |

- `dist`: 145.34 MiB.
- Video: 59.76 MiB.
- Música: ~36.47 MiB total.
- Build warning: chunks >500 kB.
- Lighthouse/Web Vitals/memoria/FPS: **NO VERIFICADO**.

## Observaciones de código

- App importa screens estáticamente; `manualChunks` organiza output, pero no garantiza carga bajo demanda.
- ThreeSky se monta antes de iniciar la Intro y renderiza bajo ella.
- Horizon completo de tres sectores se monta simultáneamente.
- Stack contiene viewers 3D y gran catálogo de SVG en código.
- El video usa `preload="metadata"`, favorable; imágenes de media principal no declaran lazy.
- Playlist carga metadata al iniciar la experiencia; SFX se precargan al importar.
- Ticker global evita múltiples loops para cielo/fog, pero Flag/viewers/smoke tienen RAF propios.
- DPR está limitado a 1.25 en sky y 2 en viewers/Flag.
- Cleanup explícito existe en sky, Flag y GenericIcon3D.
- Vite dev usa polling 150 ms; afecta desarrollo, no build publicado.

## Inferencias

- Primera carga de red puede ser alta por imágenes del manifiesto: Intro precarga rutas aunque no sean visibles.
- Equipos móviles/GPU modesta pueden sufrir por WebGL + filtros/blur + animaciones permanentes.
- Cargar tres panes simultáneos favorece navegación fluida, pero aumenta memoria/paint.
- El MP4 es el mayor candidato a optimización de transferencia.

Estas inferencias requieren profiling para convertirse en defectos confirmados.

## Recomendaciones futuras priorizadas

1. Medir con Lighthouse/Performance y registrar hardware/navegador.
2. Corregir asset manifest y definir prioridad de preload.
3. Lazy import de screens y 3D viewers por interacción.
4. Poster + compresión/streaming del video.
5. Pausar ticker/animaciones cuando documento está oculto y respetar reduced motion.
6. Medir memoria/contextos WebGL tras abrir/cerrar Stack repetidamente.
7. Revisar carga de todos los subsets de fuentes.

