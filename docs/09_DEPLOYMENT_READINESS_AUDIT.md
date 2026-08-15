# 09_DEPLOYMENT_READINESS_AUDIT

Fecha/Hora: 2026-05-20 (America/Mexico_City)

Proyecto:
- Nombre: `unibelands-3`
- Ruta: `E:\Voyager 2026\Desktop\interface de diseño\unibelands3\unibelands-3`

## 1. Estado actual del proyecto

Stack detectado (package.json):
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Three.js
- pnpm
- @tanstack/react-query (instalado; uso no verificado)

Scripts actuales:
- `pnpm dev` -> `vite`
- `pnpm build` -> `vite build`
- `pnpm preview` -> `vite preview`

Puerto local:
- Dev server configurado en `127.0.0.1:4281` (vite.config.ts)

Build:
- `pnpm -s build`: OK (genera `dist/`)

Preview:
- `pnpm -s preview`: OK (validado con `--port 4282` para evitar conflicto con dev)

## 2. Compatibilidad con hosting estatico

### `pnpm build` genera `dist/`
Si. `vite build` genera `dist/index.html` y assets versionados en `dist/assets/*`.

### Assets publicos
- Hay `public/assets/*` y `public/offline-links/*`.
- En Vite, `public/` se copia a `dist/` en build, manteniendo rutas.
- En el codigo se usan rutas absolutas tipo `/assets/remote/...` y `/offline-links/...`.
  - Esto funciona bien en hosting estatico siempre que el sitio se sirva desde raiz `/`.
  - En GitHub Pages (subpath) requiere configurar `base` o ajustar rutas.

### Rutas absolutas problematicas
Riesgo: medio-alto para GitHub Pages.
- Uso de rutas absolutas:
  - `index.html`: `href="/index.css"`
  - `index.html`: `src="/index.tsx"` (en dev) / en build Vite lo reescribe
  - Componentes: `src="/assets/remote/041_ulhz9on.png"`, links a `/offline-links/*.html`, etc.

### Dependencias de localhost / referencias a 127.0.0.1
No hay dependencias funcionales de localhost en runtime de produccion detectadas.
Si hay referencias locales de tooling:
- `vite.config.ts` fija host/port a `127.0.0.1:4281` (dev/preview local).

### Rutas Windows hardcodeadas
No se detectaron rutas Windows hardcodeadas dentro de `src/` en esta auditoria.
Nota: Vite inyecta paths locales en HMR durante dev, pero eso no va a produccion.

### Fetch externos
No se detecto uso de `fetch(...)` (o axios) en `src/` en esta auditoria.
Implicacion: el sitio es mayormente self-contained (bueno para hosting estatico).

### Variables de entorno / API keys
Uso detectado:
- `src/config/runtimeFlags.ts` usa `import.meta.env.VITE_*` para toggles:
  - `VITE_ENABLE_WEBGL_SKY`
  - `VITE_ENABLE_3D_VIEWERS`
  - `VITE_ENABLE_PARTICLES`

Archivo presente:
- `.env.local` contiene `GEMINI_API_KEY=PLACEHOLDER_API_KEY`.

Evaluacion:
- No se detecto que `GEMINI_API_KEY` se use en el codigo actual; parece remanente de template.
- Aun asi: para deploy publico, evitar incluir keys reales en el bundle. Mantener `.env.local` solo local.

### Service workers / cache legacy
Detectado en `index.tsx`:
- Hay una rutina de limpieza de service workers/caches legacy que corre solo en localhost/127.0.0.1.
- Esto no afecta produccion.

### Base path (GitHub Pages)
Riesgo: alto si se publica en subpath.
- Por el uso de rutas absolutas (`/assets/...`, `/offline-links/...`), GitHub Pages (ej: `https://user.github.io/repo/`) fallaria sin:
  - `base` en `vite.config.ts`, y/o
  - migrar rutas a relativas / `import.meta.env.BASE_URL`, y/o
  - servir desde root con dominio propio.
Regla de esta fase: no se aplican cambios, solo se documenta.

## 3. Matriz de publicacion

| destino | viable | dificultad | riesgo | costo | recomendacion |
|---|---:|---:|---:|---:|---|
| Vercel | Si | Baja | Bajo | $0 | Recomendada (ruta principal) |
| Netlify | Si | Baja | Bajo | $0 | Buena alternativa (ruta secundaria) |
| Cloudflare Pages | Si | Media | Bajo | $0 | Buena opcion si ya usas Cloudflare |
| Firebase Hosting | Si | Media | Bajo | $0-$ | Util si quieres dominio+CDN con tooling Google |
| GitHub Pages | Parcial | Media | Alto | $0 | Riesgosa por `base`/subpath (requiere ajustes) |
| Google AI Studio Build | Parcial | Media | Medio-Alto | $0 | Mejor como demo/sandbox; no como deploy principal |
| CodePen | Parcial | Alta | Alto | $0 | Solo demo simplificada; no ideal para el proyecto completo |

## 4. Recomendacion principal

Vercel.

Por que:
- Hosting estatico perfecto para `dist/` de Vite.
- Flujo simple: build + deploy con cache/CDN.
- Buen performance global, facil compartir link.
- Menos friccion que GitHub Pages para sitios con rutas absolutas y muchos assets.

## 5. Recomendacion secundaria

Netlify.

Por que:
- Igual de compatible con Vite estatico.
- UI sencilla para deploy por drag-and-drop de `dist/` o repo.
- Buen CDN.

## 6. Google AI Studio Build

Evaluacion:
- Viable como: entorno de demo/experimento o showcase parcial.
- Riesgos para este proyecto:
  - El repo trae un `README.md` de template que menciona Gemini, pero el codigo actual no parece depender de ello.
  - Por el volumen de assets + Three.js + CSS global sensible, es mas seguro desplegar con hosting estatico clasico (Vercel/Netlify).

Recomendacion de uso:
- Usarlo como asistente de generacion/iteracion, no como destino principal de deploy.

## 7. CodePen

Evaluacion:
- No es ideal para subir el proyecto completo (estructura multi-archivo, assets, build step, rutas de `public/`).
- Si se usa:
  - Hacer una version demo simplificada (una sola escena o un solo modal) y assets minimos.
  - Se perderia el pipeline normal de build, el manejo correcto de `public/`, y parte de la estructura modular.

## 8. Checklist AAA de publicacion

### Visual
- Responsive: desktop/laptop/tablet/movil
- Legibilidad/contraste
- Estados hover/focus visibles
- Carga inicial: no confusa
- Fallback si WebGL falla (existe fallback para sky via flags)

### Tecnica
- Build OK
- Preview OK
- Assets OK en `dist/`
- Rutas OK segun plataforma (root vs subpath)
- Sin errores de consola en produccion
- Sin API keys reales expuestas
- Sin rutas locales
- Bundle revisado (warnings de chunk > 500kb)

### UX
- Primera impresion clara
- Navegacion entendible
- Contacto visible
- Proyectos accesibles
- Interacciones no escondidas
- Fallback para usuario no gamer

### Portafolio
- Identidad clara (titulo, rol, copy)
- Proyectos claros (links, imagenes)
- Contacto/redes claras
- Metadata SEO basica (title/description/favicon)

## 9. Riesgos bloqueantes

| riesgo | archivo/zona | impacto | bloquea deploy | reparacion sugerida |
|---|---|---:|---:|---|
| Deploy en subpath rompe rutas absolutas | uso de `/assets/*`, `/offline-links/*` | Alto | Si (GitHub Pages tipico) | Configurar `base` en Vite y/o migrar a `BASE_URL` (fase DEPLOY.1) |
| README desalineado con proyecto | `README.md` | Medio | No | Migrar usando `README_PROPOSED.md` (fase DEPLOY.2) |
| `.env.local` con placeholder Gemini | `.env.local` | Medio | No (si no se usa) | Confirmar que no se usa; evitar keys reales en bundle (fase DEPLOY.0) |
| Bundle grande (warning) | build output | Medio | No | Code-splitting en modales pesados (fase DEPLOY.5) |

## 10. Plan de reparacion por fases

- DEPLOY.0 Auditoria de publicacion
  - Confirmar plataforma objetivo (root vs subpath)
  - Confirmar que no hay keys reales
  - Confirmar que no hay fetch externos inesperados

- DEPLOY.1 Limpieza de rutas/assets (sin redisenar)
  - Si se elige GitHub Pages: definir `base` y revisar rutas absolutas
  - Verificar `offline-links` y `assets/remote` en `dist/`

- DEPLOY.2 Metadata publica (sin tocar UI)
  - README final (migrar desde `README_PROPOSED.md`)
  - `title`, favicon, meta description (si aplica)

- DEPLOY.3 Build/preview estable
  - Validar build en entorno limpio
  - Validar preview en puerto no conflictivo

- DEPLOY.4 Deploy en plataforma recomendada
  - Vercel o Netlify: publicar `dist/` (o repo) con build `pnpm -s build`

- DEPLOY.5 QA visual y performance
  - Revisar consola
  - Revisar carga inicial
  - Revisar warnings de chunk

- DEPLOY.6 Version demo alternativa
  - Si se quiere AI Studio / CodePen: extraer demo reducida (sin tocar el main)

## Validaciones ejecutadas (registro)

- `pnpm -s build`: OK
- `pnpm -s preview`: OK (validado con `--port 4282` para no chocar con dev)

