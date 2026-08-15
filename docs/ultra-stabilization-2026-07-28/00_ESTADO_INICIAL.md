# Estado inicial de la estabilización Ultra

Fecha de corte: 2026-07-28  
Raíz de aplicación: `C:\Desarrollos DEV daniel\Desarrollo CV borderlands3\UnibeLands-3\unibelands3\unibelands-3`

## Línea base confirmada

| Campo | Resultado |
| --- | --- |
| Git top-level | `C:\Desarrollos DEV daniel\Desarrollo CV borderlands3` |
| Rama | `main` |
| HEAD | `61fdf5c90f82afd9148061471830633b816cab8e` |
| Node | `v24.18.0` |
| pnpm | `10.14.0` |
| `pnpm exec tsc --noEmit` | Exit 0; 3,357 ms |
| `pnpm -s build` | Exit 0; 5,883 ms total; Vite 3.92 s |
| Chunk Three.js | 557.27 kB minificado / 146.67 kB gzip; warning >500 kB |

## Árbol mixto preexistente

Antes de esta carpeta ya existían modificaciones rastreadas en:

- `index.css`
- `src/App.tsx`
- `src/config/assets.ts`
- `src/features/CreditsScreen/index.tsx`
- `src/features/ProjectsScreen/index.tsx`
- `src/hooks/useParallaxScroll.ts`

También existían elementos no rastreados, entre ellos `docs/master-audit-2026-07-28/`, `docs/master-audit/`, `docs/stabilization-2026-07-28/`, `package-lock.json` y materiales fuera de la raíz de la app. Se preservarán sin limpieza, reset, stash, restore, commit ni push.

Las seis modificaciones rastreadas corresponden a una estabilización parcial previa que declara soluciones para Weapons, resize, notch móvil, Credits, overlays, reduced motion e iframe. Su propia evidencia marca como **NO VERIFICADO** el runtime visual completo; por tanto, no se consideran cerradas hasta repetir la regresión en esta ejecución.

## Evidencia histórica disponible

Se revisaron la auditoría maestra fechada y sus capturas de mundo en diez viewports, además de Projects, Stack/Weapons y Loot Map a 1366×768. Esas imágenes representan el estado anterior a la estabilización parcial y se usarán como comparación, no como certificación actual.

## Estado de validación actual

- **CONFIRMADO:** raíz, rama, HEAD, árbol mixto, versiones, TypeScript y build.
- **CONFIRMADO:** no había servidor escuchando en 5173/5174/4173 al registrar esta línea base.
- **NO VERIFICADO ACTUALMENTE:** servidor, consola, red, los diez viewports, secuencia de resize, audio/Credits, teclado/foco, reduced motion, CodePen y ausencia de regresiones visuales.

## Política de continuidad

La intervención partirá del árbol real y preservará los cambios preexistentes. Cualquier diferencia entre la auditoría histórica y el runtime actual se clasificará como error preexistente, mejora preexistente no validada o regresión demostrada antes de editar producto.
