# QA y evidencias

## Comandos finales

| Validación | Resultado |
| --- | --- |
| `pnpm run test` | 7/7 PASS, 0 fail, 223.4114 ms |
| `pnpm run typecheck` | PASS, exit 0 |
| `pnpm run build` | PASS, 106 módulos, 6.47 s |
| `pnpm -s build` (repetición final) | PASS, 106 módulos, 5.90 s |
| `pnpm exec tsc --noEmit` (repetición final) | PASS, exit 0 |
| `pnpm run verify` | PASS, exit 0 |
| `git diff --check` | 0 errores; solo avisos CRLF |
| Escaneo de rutas locales en source | 68 rutas únicas, 0 ausentes |
| Consola del recorrido final | 0 `error`/`warn` observados |

## Recorridos

| Recorrido | Evidencia | Estado |
| --- | --- | --- |
| A — completa | Intro → misión → 3 sectores → Stack → proyecto → Map → Contact → Credits | CONFIRMADO |
| B — rápida | Intro → perfil → destacados → proyecto/Stack/Contact → mundo | CONFIRMADO |
| C — móvil | 390×844, overlays principales y capturas | CONFIRMADO |
| D — teclado | Enter en Map, Escape en Recruiter, foco restaurado | CONFIRMADO |
| E — reduced motion | ramas de código/CSS | NO VERIFICADO runtime |
| F — sesión | progreso persiste tras recarga; reset devuelve estado base/contexto Norte | CONFIRMADO |

## Matriz Intro + Recruiter

En los 10 tamaños solicitados: `introOk=true`, `recruiterOk=true`, `introOverflow=0`, `recruiterOverflow=0`.

## Evidencia visual final

- `intro-390x844.png`
- `exploration-mission-compact-390x844.png`
- `recruiter-1920x1080-final.png`
- `recruiter-390x844-final.png`
- `project-case-study-390x844-final.png`
- `capability-map-390x844-final.png`
- `contact-390x844-final.png`
- `credits-390x844-final.png`

## Límites de QA

No se verificaron red externa, correo real, CV, lector de pantalla, hardware físico, Lighthouse ni deployment. El servidor usado fue Vite en `127.0.0.1:5173`; debe detenerse al entregar.
