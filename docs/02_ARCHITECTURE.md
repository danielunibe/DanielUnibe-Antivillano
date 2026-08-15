# 02_ARCHITECTURE

## Entry points

- `index.html`:
  - carga `index.css`
  - monta `#root`
  - boot de `index.tsx`
- `index.tsx`:
  - renderiza `<App />`
  - carga fuentes `@fontsource/*`
  - limpia state PWA legacy en localhost (service workers/caches) para evitar bugs en dev
- `src/App.tsx`:
  - orquestador principal (capas de entorno + UI + modales)

## Estructura (resumen)

`src/`
- `App.tsx`: runtime principal
- `components/`: piezas visuales reusables (environment/effects/ui)
- `features/`: pantallas/modulos grandes (modales) + sistemas cross-cutting (InteractionSystem)
- `hooks/`: hooks reusables
- `config/`: flags y configuracion
- `utils/`: utilidades (p.ej. audio)
- `styles/`: CSS base/animaciones/interacciones/scrollbars

## Flujo de render (alto nivel)

1. App monta y muestra IntroScreen (pantalla de inicio).
2. Entorno:
   - sky (WebGL opcional via flags)
   - horizonte + suelo + zonas clickeables
3. UI/HUD:
   - navigation inferior (puntos/etiquetas)
4. Interacciones:
   - InteractionProvider injecta UI de hover/copy/toast global
5. Modales:
   - Stack / LootMap / Projects / Contact se abren como overlays full-screen

## Modulos criticos

- `src/App.tsx`: capa mas sensible por ser orquestador
- `src/features/InteractionSystem.tsx`: comportamiento global de hover/copy/toast
- `index.css`: estilos globales y secciones sensibles (EchoPortal)

