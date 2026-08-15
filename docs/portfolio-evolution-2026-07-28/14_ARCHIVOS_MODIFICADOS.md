# Archivos modificados

## Evolución de producto

| Área | Archivos | Motivo | Riesgo | Validación |
| --- | --- | --- | --- | --- |
| Estado | `src/features/experience/{types,model,ExperienceContext}.ts(x)` | misión, persistencia, reset | medio | 4 tests + navegador |
| UI misión | `MissionTracker.tsx` | progreso no bloqueante | medio | móvil/desktop |
| Recruiter | `RecruiterScreen.tsx` | revisión rápida | medio | 10 viewports |
| App | `src/App.tsx` | conectar modos/módulos | alto | flujo completo, foco |
| Intro | `IntroScreen.tsx` | elección de recorrido | medio | matriz responsive |
| Projects | `types.ts`, `data.ts`, `selection.ts`, `index.tsx` | curación y casos | alto | 3 tests + QA visual |
| Stack | `index.tsx`, `InspectorPanel.tsx` | evidencia y progreso | medio | selección real |
| Loot Map | `index.tsx` | conexiones profesionales | medio | Enter + CTA |
| Contact | `index.tsx` | límites honestos | bajo | móvil |
| Credits | `index.tsx` | cierre/progreso/reset | medio | recorrido A/F |
| Scripts | `package.json` | test/typecheck/build | bajo | `pnpm run verify` |

## Estabilización heredada del Prompt 1

También permanecen cambios en `index.css`, assets, zonas del mundo, ThreeSky, SandFog, InteractionSystem, Notch, InventoryGrid, GenericIcon3D, GlobalTicker y `useParallaxScroll`. Su detalle está en `docs/ultra-stabilization-2026-07-28/10_ARCHIVOS_MODIFICADOS.md`.

## Integridad

No se eliminaron archivos ajenos. Se retiraron únicamente nueve capturas de depuración/estados obsoletos creadas durante esta ejecución; las capturas finales permanecen en `evidence-after/`.
