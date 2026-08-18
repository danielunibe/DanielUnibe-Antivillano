# AAA Optimization — 2026-08-17

Pasada de optimizacion completa del portafolio Unibelands 3 (Vite + React + Three.js).
Fases P1 (bugs/perf), P2 (SEO/a11y/config) y P3 (bundle) aprobadas por el director creativo.
Assets: SOLO auditados, no se tocaron (decision del usuario).

## Resumen de cambios

| Fase | Alcance | Resultado |
|------|---------|-----------|
| A | Fuentes/anti-cache/console.debug/CSS huerfano | Eliminados Google Fonts y jsDelivr de index.html; metas anti-cache fuera; `console.debug` gateado con `import.meta.env.DEV`; borrado `src/features/VoyagerOS/index.css` (huerfano, sintaxis Tailwind v4); `.env.example` documentado; `vite.config.ts` con `target: 'es2020'` y `chunkSizeWarningLimit: 700` |
| B | Romper cadena three.js | Movidos `Icons.tsx` y `emblem.tsx` a `src/components/ui`; manualChunks granulares (three, howler, vendor, config, utils, ui, profile, interaction, feature-*). **Three.js (557 KB) ya NO esta en el modulepreload del entry.** Tests 28/28 OK |
| C | SEO/a11y/config | Metas OG/Twitter/theme-color/favicon en index.html; `robots.txt` + `sitemap.xml` (dominio placeholder `unibelands.example` pendiente); headers de cache/seguridad en `vercel.json`; skip-link, `<main id="app-main">` y h1 sr-only en App.tsx |
| D | Howler lazy / ShadowDebugger | `SoundManager.ts` carga Howler con `import()` dinamico; `ShadowDebugger` solo se importa en DEV. `howler` 36.91 kB como chunk propio; vendor baja 384→347 kB; ShadowDebugger excluido de prod (string SLIDERS ausente de todos los chunks) |
| E | **Unificar musica en un solo servicio** | Nuevo `src/features/music/MusicService.ts` (singleton HTMLAudioElement, un solo fetch de `/playlist.json`, emits throttled a ~8fps, duck/mute/shuffle/repeat, persistencia localStorage). `MusicPlayerContext` ahora es un wrapper fino (API publica intacta). `RadioKairosPlayer` dejo el motor WebAudio propio y el loop rAF de 60fps; consume `useMusicPlayer`. Props muertas implementadas (`arrowsEnabled` desactiva el atajo Espacio con interfaz abierta; `ducked`/`muted`/`isWorld` eliminadas de su contrato y movidas al provider). `VoyagerOS/MusicContext` ahora delega al servicio real (antes simulaba progreso con timers). `feature-music` quedo en 6.27 kB |
| F | Favicon | Nuevo `public/favicon.svg` con el emblema anti-villano en blanco (paths tomados de `src/components/ui/LootMapEmblem.tsx`, fill `#ffffff`), referenciado en index.html reemplazando al retrato webp |

## Resultados de bundle (build 2026-08-17)

- `three-DQ5CSgmf.js` 557.27 kB (gzip 146.67) — chunk aparte, fuera del entry preload
- `vendor-HoG_mXDx.js` 347.27 kB (gzip 108.48) — bajo desde ~384 kB
- `howler-DyiGaB6C.js` 36.91 kB (gzip 10.13) — solo se descarga si se reproduce un SFX
- `feature-music-D25Z6MbX.js` 6.27 kB (gzip 2.23) — musica unificada
- ShadowDebugger NO existe en el bundle de produccion
- `pnpm -s test`: 28/28 OK · `pnpm -s typecheck`: OK · `pnpm -s build`: OK

## Auditoria de assets (public/, 2026-08-17)

Total: **346.52 MB en 399 archivos** — NO modificados (decision del usuario).

| Extension | Archivos | Tamano |
|-----------|----------|--------|
| .png | 331 | 243.69 MB |
| .mp4 | 1 | 59.76 MB |
| .mp3 | 14 | 36.89 MB |
| .jpeg | 5 | 3.09 MB |
| .jpg | 14 | 2.93 MB |
| .json | 2 | 0.06 MB |
| .pdf | 9 | 0.06 MB |
| .svg | 7 | 0.02 MB |
| otros | 16 | 0.02 MB |

- PNG > 500 KB: 289 archivos / 231.6 MB. PNG > 1 MB: 29 archivos / 58.82 MB.
- Mas pesados: `capability-map/mapa.png` 6.11 MB, `interface/go-back.png` 3.85 MB, `world/base/pared-este-derecha.png` 2.56 MB, `interface/anti-villano-logo.png` 2.04 MB.
- MP4 unico: 59.76 MB (video anti-villano).

### Oportunidades (diferidas por decision del usuario)

- PNG fotograficos → WebP/AVIF (estimado -60/-75 %, ~150-180 MB de ahorro). Requiere migrar rutas en `src/config/assets.ts` y el LootMap, o un pipeline de build.
- MP4 → recodificar a H.264 ~8 Mbps o WebM (aprox. 15-25 MB).
- MP3 36.89 MB → revisar bitrate (audio de escena).

## Pendientes / decisiones abiertas

- Dominio real pendiente: `robots.txt`, `sitemap.xml` y canonical/og:url usan placeholder `unibelands.example`.
- Conversion de assets (WebP/AVIF/MP4) diferida.
- Sin commits realizados (no solicitados).

## Rollback

- Cada fase es un diff pequeno; revertir por archivo es directo.
- Musica unificada: el servicio nuevo es `src/features/music/MusicService.ts`; el comportamiento anterior vivia dentro de `RadioKairosPlayer.tsx` y `MusicPlayerContext.tsx` (git history).