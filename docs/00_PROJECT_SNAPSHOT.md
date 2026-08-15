# 00_PROJECT_SNAPSHOT

Fecha/Hora: 2026-05-20 (America/Mexico_City)

Ruta del proyecto:
- `E:\Voyager 2026\Desktop\interface de diseño\unibelands3\unibelands-3`

Dev server:
- URL: `http://127.0.0.1:4281/`
- Tooling: Vite dev server

## Proposito (snapshot)

`unibelands-3` es un portafolio interactivo con estetica HUD/AAA. La experiencia principal es un "mundo" horizontal (Oeste/Norte/Este) que abre interfaces/modales (Stack, LootMap, Projects, Contact) sobre el entorno.

## Stack detectado (confirmado por package.json)

- Framework: React 19
- Lenguaje: TypeScript
- Build/Dev: Vite
- Styling: Tailwind CSS + CSS global en `index.css`
- 3D: Three.js
- Data: @tanstack/react-query (instalado; uso no verificado en esta auditoria)
- Package manager: pnpm

Scripts actuales:
- `pnpm dev`
- `pnpm build`
- `pnpm preview`

## Advertencias principales

- No hay documentacion viva de arquitectura/guardrails dentro del repo (antes de esta fase).
- `README.md` parece venir de plantilla (menciona Gemini/AI Studio) y no refleja fielmente el estado actual.
- `index.css` contiene CSS sensible (EchoPortal) que puede romperse con cambios no controlados.

