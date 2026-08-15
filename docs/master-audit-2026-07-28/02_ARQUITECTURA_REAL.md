# 02 — Arquitectura real

## Flujo de arranque

```text
index.html
├── /index.css
└── /index.tsx
    ├── limpia service workers y Cache API solo en localhost, una vez por sesión
    └── ReactDOM.createRoot
        └── App
            └── InteractionProvider
                └── MusicPlayerProvider(enabled=hasStarted, ducked=modal abierto salvo Credits)
                    ├── modal activo
                    ├── IntroScreen
                    ├── OverlayEffects
                    ├── ThreeSky → ErrorBoundary → gradiente fallback
                    ├── viewer horizontal
                    │   ├── Horizon (300vw)
                    │   │   ├── WestZone → Loot Map
                    │   │   ├── NorthZone → EchoPortal, Projects, Contact, Credits
                    │   │   └── EastZone → Stack
                    │   ├── Floor
                    │   └── 3 paneles snap de 100vw
                    ├── SandFog
                    ├── NotchMusicPlayer
                    ├── Settings (portal a document.body)
                    └── navegación lateral
```

## Estado y contratos

- `App` conserva `hasStarted`, `activeInterface` e `isSettingsOpen`.
- `useParallaxScroll` conserva `activeIndex`, `viewerRef` y un `scrollRef` mutable para animación.
- No existe router; la navegación es estado local y scroll horizontal.
- El switch `InterfaceType` garantiza un solo overlay activo.
- `InteractionProvider` coordina hover, preview, tooltip Ctrl, Shift+Click, toast y eventos globales.
- `MusicPlayerProvider` posee un único `HTMLAudioElement`, playlist, índice, estado, tiempo, volumen, loop y ducking.
- Datos principales son TypeScript estático; playlist es JSON público.

## Render 3D y efectos

- `ThreeSky`: escena, cámara ortográfica, renderer con DPR máximo 1.25, context-lost handler, `GlobalTicker`, resize y cleanup de geometría/material/texturas/renderer.
- `Flag`: renderer propio, RAF propio, DPR máximo 2 y cleanup.
- `GenericIcon3D` y viewers: renderer/RAF propios mientras el inspector 3D está montado; liberan renderer, geometrías y materiales.
- `SandFog` comparte `GlobalTicker`.
- `useBarrelSmokeEffect` usa RAF propio, pero particles están desactivadas por defecto.
- No se observó un loop huérfano confirmado. La coexistencia de ticker + viewers + RAF especializados es riesgo de carga, no fuga demostrada.

## Límites y acoplamiento

| Zona | Observación | Riesgo |
| --- | --- | --- |
| `src/App.tsx` | Estado, overlays, providers, mundo, Settings y navegación en 252 líneas lógicas | Alto |
| `index.css` | 1,054 líneas físicas, notch, EchoPortal y navegación; 25 posiciones absolutas | Alto |
| `InteractionSystem` | cinco listeners globales y `CustomEvent` | Alto transversal |
| `MusicPlayerContext` | audio, fetch, estado y ducking en 297 líneas lógicas | Medio-Alto |
| `ProjectsScreen` | datos externos, media, categorías y overlay | Medio |
| Assets | manifiesto parcial; varias rutas también hardcodeadas | Medio-Alto |

## Fragilidades confirmadas o probables

- El resize cambia `window.innerWidth`, pero `useParallaxScroll` no realinea `scrollLeft`; una sesión redimensionada puede quedar entre sectores.
- Modal visual no equivale a modal accesible: no hay aislamiento de foco.
- `App` importa pantallas estáticamente; manual chunks separa archivos, pero no constituye lazy loading por interacción.
- `ErrorBoundary` cubre `ThreeSky`, no toda la app ni errores asíncronos/audio/red.
- `getPreloadList()` incluye rutas inexistentes y la Intro cuenta `onerror` como progreso válido.
- No se detectaron ciclos de imports evidentes en la inspección estática; análisis formal de ciclos: `NO VERIFICADO`.

## Archivos aparentemente sin uso

- `CustomCursor.tsx` (montaje comentado).
- `GameImage.tsx`.
- `ModeTab.tsx`.
- `StatRow.tsx`.
- `ThreeIconViewer.tsx`.

No deben eliminarse sin una tarea específica y confirmación de imports dinámicos/historia.

