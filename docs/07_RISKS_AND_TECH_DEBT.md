# 07_RISKS_AND_TECH_DEBT

## Riesgos principales

| Riesgo | Archivo/Area | Impacto | Recomendacion |
|---|---|---|---|
| Cambios visuales "a ciegas" por duplicados de texto | UI/UX aparece en varios componentes | Alto | Siempre localizar con `rg` antes de editar |
| CSS sensible y denso | `index.css` (EchoPortal) | Alto | Separar en fase posterior a archivo dedicado (sin cambiar estilos) |
| README desactualizado | `README.md` | Medio | Mantener `README_PROPOSED.md` y luego migrar con aprobacion |
| Ausencia de lint/test | `package.json` scripts | Medio-Alto | Agregar en fase posterior (ESLint/Vitest) |
| Bundle grande | build warning > 500kb | Medio | Code-splitting en fase posterior |

## Deuda documental (estado actual)

- Faltaba: snapshot, stack, arquitectura, visual system, guardrails.
- Esta fase agrega `docs/*` + `AGENTS.md` + `CODEX_GUARDRAILS.md` + `README_PROPOSED.md`.

