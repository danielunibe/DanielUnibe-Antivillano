# 01 — Estado técnico

## Identidad verificada

| Campo | Valor |
| --- | --- |
| Proyecto | Unibelands 3 (`unibelands-3`) |
| App | `C:\Desarrollos DEV daniel\Desarrollo CV borderlands3\UnibeLands-3\unibelands3\unibelands-3` |
| Git top-level | `C:\Desarrollos DEV daniel\Desarrollo CV borderlands3` |
| SO | Windows 11 Home 64-bit, 10.0.26200 |
| Auditoría | 2026-07-28 04:40:11 -06:00 |
| Rama | `main` |
| HEAD | `61fdf5c90f82afd9148061471830633b816cab8e` |
| Último commit | `Initial clean commit`, 2026-07-14 12:20:03 -06:00 |
| Remoto | `origin`, GitHub |
| Node | 24.18.0 |
| npm | 11.16.0 |
| pnpm | 10.14.0 |
| Git | 2.55.0.windows.3 |
| Package manager declarado | `pnpm@10.14.0` |
| Lock autoritativo | `pnpm-lock.yaml` |
| Lock adicional | `package-lock.json`, sin seguimiento; origen/uso `NO VERIFICADO` |

## Estado de Git

`git -c safe.directory='*' status --short --branch` informó:

```text
## main
?? ../../../AUDITORIA_COMPLETA_PROYECTO.md
?? "../../../CV 2027/"
?? docs/master-audit/
?? package-lock.json
```

La carpeta de esta auditoría se agregó después. No se modificó ni eliminó ningún cambio preexistente. No hay tags ni otras ramas visibles. El historial contiene un único commit; por tanto, no permite reconstruir evolución granular ni atribuir intención.

## Stack y versiones instaladas

| Dependencia | Declarada | Instalada | Función / uso real | Clasificación | Riesgo |
| --- | --- | --- | --- | --- | --- |
| `react`, `react-dom` | ^19.2.3 | 19.2.8 | UI y montaje en `index.tsx` | Crítica | Medio |
| `three` | ^0.182.0 | 0.182.0 | cielo, shaders y viewers 3D | Importante | Alto: 557.27 kB min. |
| `howler` | ^2.2.4 | 2.2.4 | SFX en `SoundManager` | Importante | Bajo-Medio |
| `@tanstack/react-query` | ^5.100.10 | 5.101.4 | No hay imports runtime | Aparentemente sin uso | Medio |
| `@types/howler` | ^2.2.13 | 2.2.13 | tipos de desarrollo, colocado en `dependencies` | Desarrollo mal clasificado | Bajo |
| `@fontsource/*` | ^5.2.x | 5.3.0 | cinco familias importadas en `index.tsx` | Importante | Medio por cantidad de subsets |
| `vite` | ^6.2.0 | 6.4.3 | dev/build/preview | Crítica de tooling | Medio |
| `typescript` | ~5.8.2 | 5.8.3 | tipado, `noEmit` | Crítica de tooling | Medio |
| Tailwind/PostCSS/Autoprefixer | 3.4/8.5/10.5 | 3.4.19/8.5.23/10.5.4 | pipeline CSS | Importante | Medio |
| `@vitejs/plugin-react` | ^5.0.0 | 5.2.0 | plugin React Vite | Importante | Bajo |
| `@types/node` | ^22.14.0 | 22.20.1 | tipos de tooling | Desarrollo | Bajo |

No se calculó impacto individual de cada fuente en runtime más allá del build; atribuciones exactas por paquete son `NO VERIFICADO` sin analizador de bundle.

## Scripts y configuración

- Presentes: `dev`, `build`, `preview`.
- Ausentes: `lint`, `test`, `typecheck`, `format`, `format:check`, E2E.
- Vite: React plugin, host 127.0.0.1, puerto 5173 flexible, polling 150 ms, manual chunks por `three` y features.
- TypeScript: ES2022, DOM, bundler resolution, `allowJs`, `isolatedModules`, `skipLibCheck`, `noEmit`; no activa `strict` explícitamente.
- Tailwind: escanea entrypoints y `src/**/*`; sin plugins.
- Variables: `VITE_ENABLE_WEBGL_SKY`, `VITE_ENABLE_3D_VIEWERS`, `VITE_ENABLE_FOG`, `VITE_ENABLE_PARTICLES`.
- Defaults: WebGL sky/3D viewers/fog activos; particles inactivo.
- No hay `.env` actual. El documento de mayo que afirmaba `.env.local` es obsoleto.

## Resultado técnico actual

- Build y TypeScript: correctos.
- Runtime local: responde y permite recorrido funcional.
- Calidad automatizada: insuficiente por ausencia de gates.
- Preparación para producción: parcial; depende de resolver assets, accesibilidad, subpaths, contenido/licencias y QA adicional.

