# QA y validaciones

| Prueba | Resultado |
| --- | --- |
| `pnpm run verify` | PASS: typecheck + build, exit 0 |
| Vite build | PASS; 101 módulos; 6.40 s en corrida documentada |
| Rutas locales | PASS: 82 rutas, 0 ausentes |
| Consola de navegador | PASS observado: 0 error/warn |
| Resize Oeste | PASS: ratio 0 en 10 viewports + retorno |
| Resize Norte | PASS: ratio 1 en 10 viewports + retorno |
| Resize Este | PASS: ratio 2 en 10 viewports + retorno |
| Weapons | PASS: JPG 1920×1920 decodificado |
| Credits al abrir | PASS: pista/status/volumen sin cambio |
| Escape inmediato | PASS: diálogo 1→0 en 150 ms |
| Loot por teclado | PASS: Enter abre diálogo |
| Capturas | 37 before, 42 after |

La QA fue ejecutada en el navegador in-app a 127.0.0.1. No equivale a certificación física ni despliegue.

