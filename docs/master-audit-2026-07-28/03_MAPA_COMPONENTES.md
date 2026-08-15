# 03 — Mapa de componentes

| Sistema | Ruta principal | Responsabilidad | Datos / dependencias | Riesgo |
| --- | --- | --- | --- | --- |
| Bootstrap | `index.tsx` | fuentes, PWA cleanup, mount | ReactDOM, browser APIs | Medio |
| App | `src/App.tsx` | orquestación total | todos los screens/providers | Alto |
| Intro | `components/ui/IntroScreen.tsx` | preload y entrada | `getPreloadList` | Medio |
| Mundo | `components/environment/Horizon.tsx` | tres panes | zones, callbacks | Alto visual |
| Oeste | `zones/WestZone.tsx` | mapa táctico | assets 007/008/042 | Medio |
| Norte | `zones/NorthZone.tsx` | identidad, projects, contact, credits | EchoPortal, Portal | Alto visual |
| Este | `zones/EastZone.tsx` | acceso Stack | assets 001/013/003/009 | Medio |
| Cielo | `ThreeSky.tsx` | WebGL y nubes | Three.js, ticker | Alto rendimiento |
| Piso | `Floor.tsx` | franja panorámica | asset 002, 5760×1080 | Medio |
| Niebla | `SandFog.tsx` | atmósfera CSS/ticker | runtime flag | Medio |
| EchoPortal | `EchoPortal.tsx` + `.echo-*` | identidad/estadísticas | asset 041, CSS global | Alto protegido |
| Quest giver | `Portal.tsx` | acceso Projects | asset 011, CastShadow | Medio |
| Stack | `features/StackScreen` | skills/weapons | `data.ts`, iconos, viewers | Alto |
| Projects | `features/ProjectsScreen` | 34 proyectos y media | `data.ts`, iframe/video/img | Alto contenido |
| Loot Map | `features/LootMapScreen` | selector de 4 nodos | datos inline | Medio |
| Contact | `features/ContactScreen` | email y cinco enlaces offline | datos inline, clipboard | Medio |
| Credits | `features/CreditsScreen` | créditos animados y tema | datos inline, música | Medio-Alto |
| Settings | bloque en `App.tsx` | reset/credits | portal DOM | Medio |
| Música | `features/music/MusicPlayerContext.tsx` | playlist y controles | `/playlist.json`, Audio | Alto transversal |
| Notch | `components/ui/NotchMusicPlayer.tsx` | UI música | Music context | Medio responsive |
| SFX | `utils/SoundManager.ts` | hover/click/open/equip | Howler, cuatro MP3 | Medio |
| Interacción | `features/InteractionSystem.tsx` | hover/tooltip/copy/toast | eventos globales | Alto transversal |
| Error | `components/ui/ErrorBoundary.tsx` | fallback WebGL | React boundary | Bajo-Medio |

## Datos y puntos de entrada

- Stack: `src/features/StackScreen/data.ts` y `types.ts`.
- Projects: `src/features/ProjectsScreen/data.ts` y `types.ts`.
- Assets: `src/config/assets.ts`, más rutas hardcodeadas.
- Audio: `public/playlist.json`.
- Flags: `src/config/runtimeFlags.ts`.
- Styling: `index.css` importa `src/styles/base.css`, `interactions.css`, `scrollbars.css`, `animations.css` y `animation-utilities.css`.

## Dependencias entre sistemas

```text
Zones → App callbacks → activeInterface → fullscreen screen
Zones/screens → InteractionProvider → global tooltip/toast
Zones/screens → SoundManager → Howler/SFX
App → MusicPlayerProvider → Notch + Credits
Stack inspector → Visualizer3D → Three.js
ThreeSky/SandFog → GlobalTicker
```

