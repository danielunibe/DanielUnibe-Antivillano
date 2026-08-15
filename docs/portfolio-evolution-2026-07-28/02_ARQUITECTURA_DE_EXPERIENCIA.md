# Arquitectura de experiencia

## Mapa actual antes de implementar

| Módulo | Objetivo actual | Valor profesional | Entrada | Salida | Estado | Problema | Duplicación | Oportunidad | Riesgo |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Intro | Cargar y entrar | Presenta marca | carga | mundo | estable | no explica rutas | no | elegir experiencia/rápida | sobrecargar primer frame |
| Mundo | Escenario horizontal | identidad diferenciadora | Intro | sectores/overlays | estable | objetivo implícito | no | hub con orientación | mover arte protegido |
| Oeste | Tactical Map | conexiones externas | nav izquierda | Loot Map | estable | propósito poco explícito | Contact | mapa de capacidades/evidencia | duplicar Projects |
| Norte | identidad, Projects, Contact, Credits | perfil y conversión | centro | overlays | estable | alta concentración | Contact/Credits | base de operaciones | saturación móvil |
| Este | Stack/Weapons | capacidades | nav derecha | Stack | estable | porcentajes no fiables retirados | no | skills + combinaciones | inventar evidencia |
| Projects | inventario de 34 piezas | evidencia visual | Quest giver | mundo/enlace | funcional | Featured genérico | Loot/Contact | casos/tier destacado | textos no auditados |
| Stack | herramientas | capacidades | Arsenal | mundo | funcional | vínculo a proyectos débil | Weapons | uso/evidencia | afirmar dominio sin respaldo |
| Weapons | combos | proceso/capacidad | tab ARMAS | Stack | funcional | tres imágenes iguales | Stack | flujos aplicados | métricas falsas |
| Loot Map | cuatro destinos | conexiones profesionales | Oeste | mundo | funcional | nodos no enlazan evidencia | Contact | grafo pequeño | URLs finales ausentes |
| Contact | copiar y previews locales | conversión | Norte | mundo | funcional | email/URLs/CV sin validar | Loot | CTA honesta | aparentar disponibilidad |
| Credits | making-of | caso del producto | Norte/Settings | mundo | funcional | cierre no registra recorrido | no | final/reset/contacto | autoplay |
| Audio | música y SFX | autoría/atmósfera | gesto del usuario | persistente | estable | error poco visible | no | feedback no exclusivo | peso/autoplay |
| Settings | reset mundo/créditos | control | HUD | mundo/credits | estable | sin progreso/quick mode | Intro | reset/ruta rápida | panel demasiado grande |

## Recorrido objetivo

Entrar → elegir experiencia o revisión rápida → comprender misión → explorar sin bloqueo → abrir capacidades/proyectos/contacto → ver progreso → cerrar o reiniciar.

## Decisiones

- Un solo dataset profesional compartido.
- Estado de experiencia pequeño, tipado y persistido solo en `sessionStorage`.
- Misión informativa, minimizable y no bloqueante.
- `App.tsx` consume acciones; reducer/context viven en un feature separado.
- El modo rápido es un overlay reutilizable, no una segunda app.
- Contacto siempre accesible; progreso no desbloquea contenido.

