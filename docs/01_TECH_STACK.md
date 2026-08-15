# 01_TECH_STACK

## Resumen

- Proyecto: SPA interactiva
- Framework: React (`react`, `react-dom`)
- Lenguaje: TypeScript
- Bundler/Dev server: Vite
- Estilos: Tailwind CSS + CSS global
- 3D: Three.js
- Audio SFX: howler.js
- Package manager: pnpm (lockfile presente)

## Archivos de stack (fuente de verdad)

- `package.json`
- `pnpm-lock.yaml`
- `vite.config.ts`
- `tsconfig.json`
- `tailwind.config.js`
- `postcss.config.js`

## Scripts

Confirmados:
- `dev`: `vite`
- `build`: `vite build`
- `preview`: `vite preview`

No presentes (hoy):
- `lint`
- `test`
- `format`

## Dependencias principales

- `react`, `react-dom`: UI runtime
- `three`: rendering 3D
- `howler`: reproduccion de efectos de sonido UI/SFX con Web Audio
- `tailwindcss`, `postcss`, `autoprefixer`: pipeline de estilos
- `@vitejs/plugin-react`, `vite`: tooling
- `typescript`: types + build checks

## Dependencias instaladas pero no verificadas

- `@tanstack/react-query`: instalada. En esta auditoria no se confirmo su uso real (no se busco `QueryClientProvider`/hooks a fondo).

## Recomendaciones (solo documentales por ahora)

- Agregar `lint`/`test` en fase posterior para reducir regresiones.
- Estabilizar README real del proyecto (este repo trae un README de plantilla).

