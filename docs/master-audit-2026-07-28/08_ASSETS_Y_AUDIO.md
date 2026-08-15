# 08 — Assets y audio

## Resumen medido

- `public`: 84 archivos, 150,354,485 bytes (~143.39 MiB).
- `dist`: 160 archivos, 152,404,407 bytes (145.34 MiB).
- Imágenes raster relevantes: 50; SVG de logos: 6; HTML offline: 12; JSON: 2; fuente JSON: 1.
- Audio: 7 pistas musicales + 4 SFX; covers 7.
- Video: 1, H.264, 1584×1070, 30 fps, 78.14 s, 62,663,521 bytes, ~6.42 Mbps.

## Assets más pesados

| Asset | Tamaño | Dimensiones/duración | Uso |
| --- | ---: | --- | --- |
| `featured-recording.mp4` | 59.76 MiB | 1584×1070, 78.14 s | Projects featured |
| `patio-de-chatarra.mp3` | 6.49 MiB | 281.8 s | playlist |
| `anti-villano-x2.mp3` | 6.23 MiB | 279.4 s | playlist |
| `not-the-role-they-gave.mp3` | 5.79 MiB | 250 s | playlist |
| `042_3xc56nd.png` | 2.55 MiB | 1311×1504 | Tactical interface |
| `041_ulhz9on.png` | 2.53 MiB | 1024×1536 | EchoPortal avatar |
| `007_vylr8mt.png` | 2.27 MiB | 1536×1024 | West background |
| `010_ssl76ih.png` | 1.98 MiB | 2346×3863 | declarado pedestal; uso directo no hallado |

## Integridad

- Playlist JSON parsea y sus 14 referencias existen.
- `019_w1a2bcg.png`: falta; se usa en tres armas y se reprodujo visualmente.
- `014_p7puwyx.png`: falta; está en `ASSETS.PROPS.DRONE`, se precarga, pero no se encontró render actual.
- Rutas `antivillano.*` vistas en comentarios de tipo no son referencias runtime.
- `featured-recording.mp4` existe aunque `rg --files` lo omite por reglas ignore/globales; el inventario físico directo es autoritativo.
- `public/cv/README.md` es el único archivo potencialmente no referenciado; no hay PDF.

## Dimensiones y formatos destacables

- Floor 002: JPEG 5760×1080, adecuado para panorama pero pesado.
- Horizon mask 004: PNG 4215×417.
- Assets 020–026: JPG entre 1369×967 y 1920×1920.
- Capturas featured: 1298–1803 px de ancho, salvo 06 muy comprimida (0.05 MiB).
- Covers: JPG 360×360.
- 039: PNG 161×81, solo 503 bytes; parece placeholder/thumbnail mínimo.

## Audio funcional

- Música usa `HTMLAudioElement`; SFX usa Howler/Web Audio.
- No hay autoplay al iniciar mundo; pista aleatoria queda STOPPED.
- Credits fuerza selección y reproducción de tema.
- Ducked: 80 % del volumen al abrir modal salvo Credits; restaura después.
- No persiste volumen/índice; no existe mute; seek solo está en API.
- Cleanup del Audio principal: pause, src vacío y listeners removidos.
- SFX se precargan al importar singleton; errores se silencian.

## Licencias

- No se encontró inventario de autoría/licencia para imágenes, música, fuentes, iconos ni material inspirado en Borderlands.
- `@fontsource` y librerías tienen licencia en dependencias, pero la obligación de atribución/distribución no fue auditada.
- Preparación legal para publicación: **NO VERIFICADO**.

## Oportunidades futuras

- Validación automática de manifiesto/rutas.
- Poster y compresión/adaptive bitrate del video.
- WebP/AVIF para raster cuando se apruebe.
- Lazy loading real por modal y prioridad de imágenes above-the-fold.
- Separar `remote` en nombres semánticos sin renombrar hasta contar con manifest y QA.

