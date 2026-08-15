# 17 — Evidencia y validaciones

## Comandos principales

| Comando | Salida | Duración | Conclusión |
| --- | ---: | ---: | --- |
| `git -c safe.directory='*' branch --show-current` | 0 | <1 s | `main` |
| `git -c safe.directory='*' log -1 ...` | 0 | <1 s | HEAD identificado |
| `git -c safe.directory='*' status --short --branch` | 0 | <1 s | worktree sucio preexistente |
| `node --version` | 0 | <1 s | 24.18.0 |
| `npm --version` | 0 | <1 s | 11.16.0 |
| `pnpm --version` | 0 | <1 s | 10.14.0 |
| `pnpm -s build` | 0 | 8.90 s | build OK, warning Three >500 kB |
| `pnpm exec tsc --noEmit` | 0 | 5.45 s | TypeScript OK |
| `Invoke-WebRequest http://127.0.0.1:5173` | 0 / HTTP 200 | <5 s | servidor local OK |
| `ffprobe` media | 0 | ~22 s | duración/dimensiones verificadas |

## No ejecutados

- `pnpm install --frozen-lockfile`: omitido; `node_modules` ya existía y no se justificaba instalar.
- `pnpm lint`, `pnpm test`, `pnpm typecheck`, `pnpm format:check`: scripts ausentes.
- Lighthouse: no ejecutado.
- Audit online de vulnerabilidades: no ejecutado.
- Deploy/preview de producción: no ejecutado en hosting.

## QA runtime

- Intro cargó y habilitó Start.
- Mundo inició en Norte; navegación O/N/E operó.
- Settings abrió y cerró con Escape.
- Projects: 34 items, categorías, INFO, imagen, video y CodePen.
- Contact: pantalla y links offline; lectura de clipboard no confirmó el valor, por tanto copy queda `NO VERIFICADO` de extremo a extremo.
- Credits: abrió, inició música, pausa manual operó, cerró.
- Stack: Software y Weapons; imagen rota confirmada.
- Loot Map: abrió, nodos visibles; acción final real ausente.
- Consola capturada: cero warn/error en el navegador durante la consulta final.

## Capturas

- Mundo: `evidence/world-{viewport}.png` para 10 tamaños.
- Ultrawide: mosaicos `world-1920x1080-{left,right}.png`, `world-2560x1440-*`, `world-3440x1440-*`.
- Projects: `evidence/projects-1366x768.png`.
- Weapons: `evidence/stack-weapons-1366x768.png`.
- Loot Map: `evidence/lootmap-1366x768.png`.

## Integridad de assets

- 84 archivos físicos en `public`, ~143.39 MiB.
- 88 referencias locales extraídas por patrón; falsos positivos de comentarios excluidos al clasificar.
- Faltan realmente 014 y 019; 019 alcanza UI visible.
- 7/7 pistas y 7/7 portadas existen.
- Video existe y decodifica a readyState 4.

## Seguridad

- No hay `.env` actuales.
- Scan de asignaciones: solo placeholder `GEMINI_API_KEY` en documentación histórica; `tokens` del lockfile no es credencial.
- No se detectó `dangerouslySetInnerHTML`.
- Contact usa `noopener noreferrer`.
- Se detectó iframe CodePen con permisos amplios.

## Límites

- Capturador limita imagen directa a 1,675 px de ancho; DOM adoptó viewports completos y se usaron mosaicos.
- No se reprodujeron links externos ni se enviaron formularios.
- No se validaron cuentas, propiedad de correo, licencias, SEO publicado ni hardware físico.

