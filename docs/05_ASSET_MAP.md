# 05_ASSET_MAP

## Ubicaciones

- Public assets:
  - `public/assets/audio/*`
  - `public/assets/fonts/*`
  - `public/assets/world/base/*` (fondos, nubes, estructuras y props del mundo)
  - `public/assets/world/interactive/*` (elementos interactivos del mundo)
  - `public/assets/portfolio/projects/*` (miniaturas de proyectos y renders 3D)
  - `public/assets/portfolio/imports/*` (material importado, imágenes y video)
  - `public/assets/technology/icons/*` (logos de tecnologías)
  - `public/assets/profile/*` y `public/assets/capability-map/*` (perfil y mapa de carrera)
  - `public/assets/archive/unclassified/*` (material sin uso asignado todavía)
- Offline links:
  - `public/offline-links/*.html` (usados por ContactScreen)
- Music tracks:
  - `public/assets/audio/music/*.mp3` (playlist principal)
- CV:
  - `public/cv/daniel-unibe-cv.pdf` (placeholder; falta colocar PDF final)

## Assets y su uso (mapeo inicial)

EchoPortal:
- Componente: `src/components/environment/EchoPortal.tsx`
- Imagen: `public/assets/world/interactive/041_ulhz9on.png` (alt: "Avatar Vault Hunter")
- Layout y animaciones: `index.css` (`.echo-*`)

Quest giver (Portal):
- Componente: `src/components/environment/Portal.tsx`
- Asset: `ASSETS.PROPS.PROPP` (definido en `src/config/assets`), alt: "QUEST GIVER"

Projects:
- Data: `src/features/ProjectsScreen/data.ts`
- Imágenes referenciadas por URL en `public/assets/portfolio/projects/*`

## Convención vigente

- Cada recurso público se agrupa por uso, no por su origen de descarga.
- Se conservan los nombres de archivo para no perder trazabilidad con el mapa de procedencia.
- `remote-image-map.json` es un registro histórico de procedencia y no participa en el runtime; la estructura anterior `remote` ya no contiene recursos usados por la aplicación.

## Audio principal agregado

- `anti-villano.mp3`
- `anti-villano-x.mp3`
- `anti-villano-x2.mp3`
- `not-the-role-they-gave.mp3`
- `not-the-role-they-gave-alt.mp3`
- `nucleo-del-exilio.mp3`
- `patio-de-chatarra.mp3`

## Covers extraidos

- Carpeta: `public/assets/audio/covers/`
- Fuente: portada incrustada en cada MP3 (`Front Cover`)
- Uso: `public/playlist.json`

## Portfolio imports destacados

- Carpeta: `public/assets/portfolio/imports/`
- Imagenes: `featured-portfolio-01.png` a `featured-portfolio-08.png`
- Video: `featured-recording.mp4`
- Uso: categoria `FEATURED` en Quest/Portfolio
