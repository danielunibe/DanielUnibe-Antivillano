# 12 — Registro de deuda técnica

| ID | Título | Categoría/tipo | Sev. | Impacto / probabilidad | Evidencia | Solución propuesta | Riesgo cambio | Prioridad |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DT-001 | Asset weapon ausente | assets / defecto | Alta | Alto/Alta | runtime naturalWidth 0 | reemplazar ruta o fallback + test manifest | Bajo-Medio | P1 |
| DT-002 | Sin gates de calidad | pruebas / riesgo | Alta | Alto/Alta | scripts ausentes | lint, typecheck, unit, smoke | Medio | P1 |
| DT-003 | Modal no accesible | accesibilidad / defecto | Alta | Alto/Alta | fondo interactivo | primitive modal compartida | Alto | P1 |
| DT-004 | Interacciones div/img | accesibilidad / defecto | Alta | Alto/Alta | Loot/Norte DOM | botones/links semánticos | Medio | P1 |
| DT-005 | Rutas absolutas | despliegue / riesgo | Alta cond. | Alto/Alta en subpath | código y Vite sin base | decidir hosting y adaptar manifest | Alto | P1 |
| DT-006 | App concentrado | arquitectura / riesgo | Alta | Medio/Media | 252 líneas y coordinación | extraer controller/modal registry por fases | Alto | P3 |
| DT-007 | CSS global sensible | estilos / riesgo | Alta | Alto/Media | 1,054 líneas | extraer mecánicamente con visual diff | Alto | P3 |
| DT-008 | React Query sin uso | mantenimiento / mejora | Media | Bajo/Alta | cero imports | confirmar y retirar en tarea autorizada | Bajo | P3 |
| DT-009 | Archivos TSX sin uso | mantenimiento / hipótesis | Media | Bajo/Media | búsqueda de imports | confirmar y archivar/eliminar por fase | Medio | P4 |
| DT-010 | README plantilla | documentación / defecto | Media | Medio/Alta | Gemini/npm obsoletos | aprobar README_PROPOSED actualizado | Bajo | P2 |
| DT-011 | Docs contradictorios | documentación / defecto | Media | Medio/Alta | E:, 4281, .env inexistente | índice de vigencia + actualizar fuentes | Bajo | P2 |
| DT-012 | Preload oculta fallos | código/UX / defecto | Media | Medio/Alta | onerror=success | resultados de preload y fallback | Medio | P2 |
| DT-013 | Resize no realinea | UX / defecto | Media | Medio/Media | prueba de resize | listener/ResizeObserver por activeIndex | Medio | P2 |
| DT-014 | Notch touch pequeño | responsive/a11y | Media | Medio/Alta móvil | 24–28 px | layout compacto accesible | Medio | P2 |
| DT-015 | Autoplay Credits | UX / conflicto | Media | Medio/Alta | runtime + guardrail | selección sin play; botón Play theme | Bajo | P2 |
| DT-016 | Iframe permisos amplios | seguridad / riesgo | Media | Medio/Media | allow/sandbox | mínimo privilegio + fallback | Medio | P2 |
| DT-017 | Content inline disperso | contenido/arquitectura | Media | Medio/Alta | múltiples screens | centralizar con status/verificación | Medio | P3 |
| DT-018 | Video 59.76 MiB | rendimiento / mejora | Media | Alto/Alta | ffprobe/filesystem | encode web, poster, bitrate adaptado | Medio | P2 |
| DT-019 | Three chunk 557 kB | rendimiento / riesgo | Media | Medio/Media | build warning | lazy 3D y medición | Alto | P3 |
| DT-020 | Sin reduced motion | accesibilidad / defecto | Media | Alto/Alta | cero matches | CSS/media + runtime control | Medio | P2 |
| DT-021 | Sin metadata pública | despliegue/SEO | Media | Medio/Alta | index mínimo | description, OG, favicon, robots según decisión | Bajo | P2 |
| DT-022 | Licencias sin inventario | publicación / riesgo | Alta | Alto/Media | docs ausentes | manifest de origen/licencia | Medio | P1 |
| DT-023 | Git con un commit | mantenimiento / riesgo | Media | Medio/Alta | historial | no reparable retroactivamente; disciplina futura | Bajo | P3 |
| DT-024 | package-lock coexistente | mantenimiento / riesgo | Baja-Media | Bajo/Media | untracked | confirmar origen y unificar en tarea separada | Bajo | P3 |

## Distinciones

- **Defectos reales:** DT-001, 003, 004, 010–015, 020.
- **Riesgos:** DT-002, 005–007, 016, 019, 022–024.
- **Mejoras:** DT-008, 017, 018, 021.
- **Hipótesis:** DT-009 hasta confirmar imports/uso legado.
- No se convierte preferencia estética en requisito sin aprobación.

