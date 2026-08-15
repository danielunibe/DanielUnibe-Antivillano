# unibelands-3

Portafolio interactivo estilo HUD/AAA.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Three.js
- pnpm

## Requisitos

- Node.js (recomendado: version moderna LTS)
- pnpm

## Comandos

```powershell
pnpm install
pnpm dev
pnpm -s build
pnpm preview
```

## Desarrollo local

- `http://127.0.0.1:4281/`

## Estructura

- `index.html`, `index.tsx`, `src/App.tsx` son los entrypoints principales.
- `src/components/` contiene entorno/effects/ui.
- `src/features/` contiene modales y sistemas cross-cutting.
- `index.css` contiene estilos globales y un bloque sensible de EchoPortal (`.echo-*`).

## Notas

- El texto "UI/UX" aparece en multiples lugares (EchoPortal, StackScreen, ProjectsScreen). Usar busqueda antes de editar.
- Actualmente no hay scripts de lint/test; se recomienda agregarlos en una fase posterior.

