# Riesgos restantes

| Nivel | Riesgo | Estado | Mitigación |
| --- | --- | --- | --- |
| P0 | Bloqueo funcional crítico | ninguno observado | mantener `verify` y flujo completo |
| P1 | CV, URLs, correo y licencias no verificados | abierto | validación editorial antes de publicar |
| P1 | Three.js 557.27 kB minificado | abierto | medir carga real y evaluar separación |
| P2 | Casos destacados salvo UnibeLands sin estructura completa | abierto | completar case studies con evidencia |
| P2 | Textos históricos del catálogo pueden sobreafirmar | abierto | revisión editorial pieza por pieza |
| P2 | Reduced motion no recorrido con emulación runtime | abierto | ejecutar en navegador con media emulation |
| P2 | Sin QA de lector de pantalla/zoom 200 %/dispositivo físico | abierto | QA manual especializado |
| P3 | Rieles móviles muestran scroll horizontal explícito | aceptado | revisar estilo solo si afecta uso real |
| NO VERIFICADO | red externa, correo, analytics y deployment | abierto | smoke de staging |

No quedan P0 conocidos. Los P1 impiden declarar `CANDIDATO A PUBLICACIÓN`.
