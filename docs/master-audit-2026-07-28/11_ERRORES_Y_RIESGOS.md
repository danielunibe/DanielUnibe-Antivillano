# 11 — Errores y riesgos

## BUG-001 — Imagen de Weapons rota

- **Severidad:** Alta.
- **Módulo:** Stack / Weapons.
- **Pasos:** iniciar → Este → Arsenal → Armas.
- **Actual:** `FRONTEND BLASTER` crea `<img src="/assets/remote/019_w1a2bcg.png">` con `complete=true`, `naturalWidth=0`.
- **Esperado:** ilustración válida o fallback explícito.
- **Evidencia:** `evidence/stack-weapons-1366x768.png`; filesystem no contiene 019.
- **Causa:** tres armas comparten ruta ausente en `config/assets.ts`.
- **Archivos:** `src/config/assets.ts`, `features/StackScreen/data.ts`, `InspectorPanel.tsx`.

## BUG-002 — Controles de volumen recortados

- **Severidad:** Media.
- **Módulo:** Music notch.
- **Pasos:** iniciar a 390×844 o 360×800.
- **Actual:** `volume up` sale a 390; down/up salen a 360.
- **Esperado:** controles visibles con targets adecuados.
- **Evidencia:** `evidence/world-390x844.png`, `world-360x800.png`, rects DOM.
- **Causa probable:** grid min 210 px + sides dentro de ancho `100vw-28px`.
- **Archivos:** `index.css`, `NotchMusicPlayer.tsx`.

## BUG-003 — Resize desincroniza el sector

- **Severidad:** Media.
- **Módulo:** navegación horizontal.
- **Pasos:** iniciar en un ancho, cambiar viewport sin recargar.
- **Actual:** scroll conserva píxeles del ancho anterior.
- **Esperado:** sector activo permanece centrado.
- **Causa:** `useParallaxScroll` no escucha resize.
- **Archivo:** `src/hooks/useParallaxScroll.ts`.

## CONFLICT-001 — Credits reproduce música al abrir

- **Severidad:** Media.
- **Módulo:** Credits/audio.
- **Pasos:** iniciar con música detenida → abrir Credits.
- **Actual:** botón cambia a Pause, estado PLAYING, track Patio de Chatarra.
- **Esperado contractual:** no autoplay hasta acción explícita de reproducción.
- **Evidencia:** runtime y `setCurrentIndex(..., {autoplay:true})`.
- **Archivo:** `CreditsScreen/index.tsx`.

## A11Y-001 — Overlays sin aislamiento modal

- **Severidad:** Alta.
- **Módulos:** todos los fullscreen screens.
- **Actual:** mundo, música, Settings y navegación permanecen en DOM accesible/tabulable bajo overlay; sin role/dialog/inert/trap.
- **Esperado:** foco entra al modal, fondo queda inerte, Escape cierra, foco regresa al trigger.
- **Evidencia:** snapshots de Stack/Projects/Contact/Credits/Loot Map incluyen controles subyacentes.
- **Archivos:** `App.tsx`, cinco screens.

## A11Y-002 — Interacciones no semánticas

- **Severidad:** Alta.
- **Módulos:** Norte, Loot Map, Este/Oeste.
- **Actual:** Contact, Quest Giver, Hero, Tactical Interface y nodos usan contenedores/imágenes clickables en distinto grado; nodos no aparecen como botones.
- **Esperado:** botones/links con nombre, foco y teclado.
- **Archivos:** zones y `LootMapScreen`.

## CONTENT-001 — Contacto y links provisionales

- **Severidad:** Media.
- **Actual:** cinco redes abren páginas offline; no hay CV PDF; email no verificado.
- **Riesgo:** un reclutador no puede llegar a perfiles reales.
- **Archivos:** `ContactScreen`, `public/offline-links`, `public/cv`.

## SEC-001 — Iframe con permisos amplios

- **Severidad:** Media.
- **Actual:** CodePen recibe allow para camera, microphone, geolocation, payment y más, además de sandbox scripts/same-origin/popups/forms.
- **Riesgo:** superficie/capabilities mayores a las necesarias; no se observó abuso.
- **Archivo:** `ProjectsScreen/index.tsx`.

## DEPLOY-001 — Rutas root-absolute

- **Severidad:** Alta si se elige subpath; baja en dominio raíz.
- **Actual:** `/assets`, `/offline-links`, `/playlist.json`, `/index.css`, `/index.tsx`.
- **Riesgo:** 404 en GitHub Pages/subpath.
- **Decisión requerida:** root vs subpath.

## PERF-001 — Payload alto

- **Severidad:** Media.
- **Evidencia:** Three 557.27 kB min; dist 145.34 MiB; video 59.76 MiB.
- **Impacto:** carga y memoria, especialmente móvil.
- **No demostrado:** una métrica de usuario concreta.

## Riesgos no verificados

- CORS/404 de CodePen en redes restrictivas.
- Context loss WebGL real.
- Compatibilidad Safari/iOS/Firefox.
- Licencias de assets/música.
- Vulnerabilidades de dependencias; no se ejecutó audit online.
- SEO/rendimiento real en hosting.

