# VISUAL Execution Log

## VISUAL — EchoPortal portfolio composition pass — 2026-05-30
- Scope: acomodar la caja EchoPortal y sus elementos internos para que funcionen como acceso principal del portafolio en la pantalla NORTH.
- Plan aplicado:
  - Fase 1: contener composición del portal dentro del marco, reduciendo escalas agresivas y offsets fijos en px.
  - Fase 2: reforzar lectura de portafolio con copy `PORTFOLIO SYSTEMS`.
  - Fase 3 pendiente: convertir el portal en menú narrativo de misiones/proyectos sin cubrir la escena.
  - Fase 4 pendiente: revisar responsive real en navegador y proteger la composición aprobada.
- Files changed: index.css, src/components/environment/EchoPortal.tsx, src/components/environment/zones/NorthZone.tsx
- Rollback: revertir los 3 archivos listados en esta entrada.

## VISUAL — EAST layer ordering pass — 2026-05-30
- Scope: ordenar capas de la pantalla ESTE para que el entorno se lea como escenario de portafolio y no como assets superpuestos sin profundidad.
- Problemas detectados:
  - `Estructura Base Norte-Este` y `Estructura Transición` no usaban ancho de pane (`w-[100vw]`), por eso sus transforms se comportaban como capas sueltas ancladas al borde.
  - `Hero Este` estaba desplazado demasiado hacia abajo (`translateY` muy alto), quedando fuera de la lectura principal.
  - Los z-index no formaban una jerarquía clara de fondo → estructura lejana → base/rocas → props interactivos.
- Orden aplicado:
  - Fondo principal `Paisaje Este`: z-20.
  - Gateway lateral `Estructura Transición`: z-28, como marco de profundidad.
  - Base rocosa `Estructura Base Norte-Este`: z-62, foreground derecho sin comerse la escena.
  - Props interactivos `BARREL`/`Hero Este`: z-86/z-92, encima del escenario y con posición visible.
- Files changed: src/components/environment/zones/EastZone.tsx
- Rollback: revertir `src/components/environment/zones/EastZone.tsx`.

## VISUAL — EAST arsenal prop grounding fix — 2026-05-30
- Scope: corregir el prop derecho que abre `TECHNICAL STACK` para que se lea como objeto interactivo de escenario.
- Ajuste aplicado:
  - `Hero Este`/ARSENAL deja de depender de `left + translateX`; ahora se ancla desde `right` para evitar choque con la masa rocosa.
  - Se redujo su altura visual y se subio su z-index a foreground (`z-[118]`) para que quede por delante de rocas/base.
  - Se agrego sombra de contacto bajo el crate para que se apoye en el piso y no flote.
  - La base rocosa derecha bajo a `z-[58]`, menor altura y mas desplazamiento a la derecha para funcionar como fondo/foreground ambiental sin tapar el prop clickeable.
- Files changed: src/components/environment/zones/EastZone.tsx
- Rollback: revertir `src/components/environment/zones/EastZone.tsx`.

## VISUAL — WEST scene layer correction — 2026-05-30
- Scope: corregir la seccion OESTE, especialmente la imagen `TACTICAL INTERFACE` que abre `LootMap`.
- Problemas detectados:
  - `TACTICAL INTERFACE` estaba en `position: fixed`, altura `100vh` y `z-[170]`, por eso se comportaba como UI pegada al viewport y no como parte del escenario.
  - `WEST_A` y `WEST_B` estaban escalados de forma excesiva, compitiendo entre si por primer plano.
  - `QUEST GIVER` y el acceso a mapa no tenian una jerarquia clara de foreground.
- Orden aplicado:
  - `WEST_A`: z-22, fondo/escenario principal, menor escala y mas centrado.
  - `WEST_B`: z-54, estructura media, desplazada a la derecha y menos dominante.
  - `QUEST GIVER`: z-108, prop interactivo secundario de proyectos.
  - `TACTICAL INTERFACE`: z-118, prop interactivo principal de mapa, dentro del pane OESTE y apoyado visualmente en el piso.
- Files changed: src/components/environment/zones/WestZone.tsx
- Rollback: revertir `src/components/environment/zones/WestZone.tsx`.

## VISUAL — NORTH EchoPortal vertical centering pass — 2026-05-30
- Scope: corregir la pantalla central NORTE para que `EchoPortal` y su HUD interno se lean como un solo bloque verticalmente centrado.
- Problemas detectados:
  - El wrapper de `EchoPortal` estaba anclado desde `bottom`, asi que el portal respondia como objeto apoyado abajo y no como interfaz/holograma centrado.
  - El HUD interno usaba offsets negativos grandes en `UI/UX`, `GAME DESIGNER`, banner, descripcion y stats, rompiendo la lectura vertical.
  - La escala de impacto de `UI/UX` empujaba visualmente el contenido fuera del marco.
- Orden aplicado:
  - `EchoPortal` queda centrado verticalmente con `top-1/2 + translateY(-50%)`, manteniendo su posicion lateral sin centrarlo horizontalmente.
  - Overlay interno reducido a `--echo-overlay-scale: 0.98` para unir avatar, marco y HUD sin desbordes.
  - Titulo, subtitulo, banner, descripcion y stats ahora usan offsets suaves en `cqw`, no saltos grandes en px.
  - Stats suben dentro del marco para cerrar la composicion y evitar que parezcan una capa separada.
- Files changed: src/components/environment/zones/NorthZone.tsx, src/components/environment/EchoPortal.tsx, index.css
- Rollback: revertir los 3 archivos listados en esta entrada.

## VISUAL — Atmosphere clouds/fog/desert wind pass — 2026-05-30
- Scope: reforzar la sensacion de desierto Borderlands en la interfaz mediante nubes visibles, haze y ventiscas de polvo.
- Ajuste aplicado:
  - `ThreeSky`: mas nubes instanciadas, mayor opacidad, alpha mas permisivo y movimiento/parallax mas visible.
  - `ThreeSky`: nubes HTML de fondo mas visibles con `mixBlendMode: screen` y una tercera capa media para profundidad.
  - `SandFog`: franja de niebla mas alta y mas baja hacia el horizonte/suelo, con mayor densidad de noise.
  - `SandFog`: nuevas lineas `desert-wind-streak-*` para simular rachas horizontales de polvo sin bloquear interacciones.
- Files changed: src/components/environment/ThreeSky.tsx, src/components/effects/SandFog.tsx, src/styles/animations.css, src/styles/animation-utilities.css
- Rollback: revertir los 4 archivos listados en esta entrada.

## VISUAL — Credits cinematic mode pass — 2026-05-30
- Scope: agregar un acceso diegetico de `CREDITS` en la zona NORTE y una pantalla cinematografica con roll vertical tipo pelicula.
- Ajuste aplicado:
  - `NorthZone`: nueva caja/terminal `CREDITS` como prop interactivo de escenario, sin convertirlo en PNG para mantenerlo editable desde UI/CSS.
  - `CreditsScreen`: pantalla fullscreen con scroll vertical de creditos, herramientas creativas declaradas, stack auditado, playlist local y aviso de tecnologias no auditadas.
  - `MusicPlayerProvider`: creditos no reduce volumen por ducking; la pantalla intenta iniciar una pista tematica de `public/playlist.json` al abrir.
  - `animation-utilities.css`/`animations.css`: nueva animacion `credits-roll` pausada al hover para lectura.
- Files changed: src/features/CreditsScreen/index.tsx, src/components/environment/zones/NorthZone.tsx, src/components/environment/Horizon.tsx, src/App.tsx, src/styles/animations.css, src/styles/animation-utilities.css
- Rollback: revertir los 6 archivos listados en esta entrada y borrar `src/features/CreditsScreen/index.tsx`.

## VISUAL — Credits info audit + intro cleanup — 2026-05-30
- Scope: asegurar que `CREDITS_MODE` no afirme tecnologias no auditadas y limpiar botones que aparecian sobre la pantalla negra inicial.
- Ajuste aplicado:
  - `CreditsScreen`: stack ajustado a lo confirmado por `package.json`/`docs/01_TECH_STACK.md`; herramientas IA/Adobe quedan como apoyo declarado, no dependencias runtime.
  - `CreditsScreen`: se explicita que repositorios externos no auditados no se declaran como incorporados.
  - `IntroScreen`: se removieron botones sociales/CV del estado inicial negro; la intro conserva solo carga, logo, iniciar sistema y footer.
- Files changed: src/features/CreditsScreen/index.tsx, src/components/ui/IntroScreen.tsx
- Rollback: revertir los 2 archivos listados en esta entrada.

## VISUAL — SFX library + custom cursor pass — 2026-05-30
- Scope: mejorar sensacion tactil con una libreria open source de audio y activar cursor custom sin depender de una libreria visual externa.
- Ajuste aplicado:
  - `SoundManager`: migrado de `HTMLAudioElement` manual a `howler` para Web Audio, preload, pool, cooldown y variaciones sutiles de pitch/volumen.
  - `CustomCursor`: activado despues de `INITIALIZE SYSTEM`, con cursor nativo oculto solo en dispositivos de puntero fino.
  - `base.css`/`animation-utilities.css`/`animations.css`: estilos de color, hover, respiracion y recoil del cursor.
  - `TECH_STACK`: `howler` queda registrado como dependencia de SFX.
- Files changed: package.json, pnpm-lock.yaml, src/utils/SoundManager.ts, src/App.tsx, src/components/ui/CustomCursor.tsx, src/styles/base.css, src/styles/animations.css, src/styles/animation-utilities.css, docs/01_TECH_STACK.md
- Rollback: `pnpm remove howler @types/howler` y revertir los archivos listados.

## VISUAL — Performance balance + Credits hitbox pass — 2026-05-30
- Scope: reducir lentitud percibida, eliminar nubes negras y corregir la sensacion/interaccion de la caja amarilla `CREDITS` sin cambiar assets.
- Ajuste aplicado:
  - `ThreeSky`: nubes HTML PNG reemplazadas por nubes CSS claras; WebGL baja a 9 instancias, pixel ratio maximo 1.25 y render intercalado.
  - `SandFog`: menos densidad de noise, 2 rachas de viento y 4 blobs para mantener desierto con menor costo visual.
  - `NorthZone`: `CREDITS` ahora es `button` semantico, con hitbox mas grande, foco accesible, menos sombra, lectura negra sobre amarillo y posicion baja separada de portal/`CONTACT`.
  - `NorthZone`: la roca ambiental deja de ser `interaction-target` porque su PNG transparente capturaba clicks encima de `CREDITS`.
  - `EastZone`: fondos/base/gateway dejan de ser `interaction-target`; solo el prop real de `STACK` conserva interaccion para evitar bloqueos invisibles entre panes.
  - `CustomCursor`: deteccion de hover simplificada sin `getComputedStyle` en el loop de mousemove.
- Files changed: src/components/environment/ThreeSky.tsx, src/components/effects/SandFog.tsx, src/components/environment/zones/NorthZone.tsx, src/components/environment/zones/EastZone.tsx, src/components/ui/CustomCursor.tsx, src/styles/animation-utilities.css, docs/visual/VISUAL_EXECUTION_LOG.md
- Rollback: revertir los 7 archivos listados en esta entrada.

## VISUAL — Tactical Map + interface dot grid pass — 2026-05-31
- Scope: mejorar `TACTICAL MAP`, hacer que el prop Oeste ocupe toda la altura visual del viewport y unificar la textura de puntos entre pantallas fullscreen.
- Ajuste aplicado:
  - `LootMapScreen`: header alineado al patron fullscreen de 76px, mapa ocupa el alto restante y panel tactico usa borde/scanline HUD sin tarjeta redondeada flotante.
  - `WestZone`: `TACTICAL INTERFACE` usa altura `100vh` y bottom compensado contra el wrapper del escenario para empatar visualmente arriba/abajo sin volverlo `fixed`.
  - `WestZone`: fondos `WEST_A`/`WEST_B` dejan de ser objetivos interactivos para reducir bloqueos invisibles y trabajo de hover; solo el prop real de mapa conserva `interaction-target`.
  - `animation-utilities.css`: nuevo `interface-dot-grid` y `interface-screen-vignette` compartidos para Stack, Projects, Contact, Credits y Tactical Map.
  - `StackScreen`/`ProjectsScreen`/`ContactScreen`/`CreditsScreen`: reemplazan patrones de puntos divergentes por la misma textura CSS clara y estatica.
- Files changed: src/features/LootMapScreen/index.tsx, src/components/environment/zones/WestZone.tsx, src/styles/animation-utilities.css, src/features/StackScreen/index.tsx, src/features/ProjectsScreen/index.tsx, src/features/ContactScreen/index.tsx, src/features/CreditsScreen/index.tsx, docs/visual/VISUAL_EXECUTION_LOG.md
- Rollback: revertir los 8 archivos listados en esta entrada.

## VISUAL — Norte (Glass/Hex/Stats/LR) + Notch minimal tweaks — 2026-05-21
- Backup: C:\tmp\_backup_unibelands_visual_north_notch_20260521_034106
- Files changed: index.css, src/components/environment/EchoPortal.tsx, src/components/environment/Horizon.tsx, src/components/environment/zones/NorthZone.tsx, src/App.tsx
- EchoPortal:
  - Glass: reduced overlay opacity + blur (more see-through).
  - Hex: larger background-size + slightly higher opacity; kept single pass on .echo-card::before (::after remains disabled).
  - Stats: aspect-ratio changed to 1.9/1; added staggered slide-in from portal edges when grid becomes .active.
  - Added minimal L/R nav buttons wired to world panes (West/East).
- Notch:
  - Playlist header removed yellow accent border; darker glass black header with cyan text.
- Build: pnpm -s build OK
- Rollback: restore backup folder or revert the 5 files listed above.


## VISUAL — EchoPortal glassmorphism increase + RADIO KAIROS widget — 2026-08-14
- Scope (.echo-card es CSS sensible, ver docs/refactor/03_CSS_SENSITIVE_MAP.md): aumentar el nivel de vidrio esmerilado del holograma y sustituir el widget de musica.
- Plan aplicado:
  - .echo-card (index.css): blur 20px -> 36px + saturate 1.4 + brightness 1.08; tinte de vidrio reforzado (blanco/cian arriba, negro abajo); borde cian mas presente; hex de ::before baja de 0.48 a 0.30 (hover 0.68 -> 0.5) para que el vidrio sea el protagonista.
  - Nuevo widget RADIO KAIROS: src/components/ui/RadioKairosPlayer.tsx (port a React del HTML provisto; motor Web Audio, refs en vez de IDs, teclado Space + flechas solo con modal abierto), estilos k-* en index.css, fuentes Bebas Neue/Oswald via CDN en index.html, 5 portadas descargadas a public/assets/audio/covers/rk-*.png.
  - App.tsx: se quita <NotchMusicPlayer /> del HUD; se anade <RadioKairosPlayer ducked/muted/arrowsEnabled> junto a los logos de esquina (visible en todas las pantallas menos el inicio). Se anade el logo derecho espejo (corner-logo-right, assets CORNER_LOGO_RIGHT) sobre el cual tambien queda el widget.
  - LootMapScreen/index.tsx: se retira su <NotchMusicPlayer />.
  - Se conservan NotchMusicPlayer.tsx, MusicPlayerContext.tsx y playlist.json (creditos siguen usando el motor actual).
- Files changed: index.html, index.css, src/App.tsx, src/config/assets.ts, src/features/LootMapScreen/index.tsx, src/components/ui/RadioKairosPlayer.tsx (nuevo), public/assets/audio/covers/rk-*.png (nuevos), public/assets/interface/logo-corner-right.png (nuevo).
- Build: pnpm -s typecheck + pnpm -s build + pnpm -s test OK.
- Rollback: quitar componente/CSS/links de fuentes/covers, restaurar <NotchMusicPlayer />; en .echo-card revertir blur/tinte/opacidad hex.
