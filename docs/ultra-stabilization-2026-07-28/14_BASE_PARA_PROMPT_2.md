# Base para Prompt 2

## Estado final

La base local está estabilizada: P0 cerrado, build/typecheck PASS, mundo horizontal conservado, overlays lazy, responsive móvil reparado, semántica y modales reforzados. Publicación sigue **NO VERIFICADA**.

## Arquitectura actual

- `App.tsx`: selección de interfaz, mundo, Settings y navegación.
- `Horizon` + tres zonas: hub horizontal protegido.
- `useParallaxScroll`: autoridad de sector/scroll.
- `MusicPlayerProvider` + notch: música persistente por sesión de página.
- `InteractionProvider`: hover/copiar/feedback.
- Features lazy: Stack, Projects, Loot Map, Contact y Credits.

## Componentes y activos reutilizables

- Intro existente, Settings, world-nav, tooltips, paneles de overlay, tabs, rail de Projects, inventario, inspector, nodos de Loot Map, Credits transcript y playlist.
- Mundo/props/portfolio media/audio existentes; no se requieren assets nuevos para misión/progreso/recruiter.
- Tokens visuales ya presentes: amarillo `#F2D019`, cyan `#00F0FF`, rojo de salida, Teko/Roboto Mono, cortes y HUD.

## Oportunidades seguras

- Estado pequeño de experiencia y progreso basado en acciones relevantes.
- Misión no bloqueante y minimizable.
- Indicadores visitados por sector/módulo.
- Ruta rápida de reclutador que reutilice datos/components.
- Projects como evidencia estructurada; UnibeLands como caso de estudio.
- Weapons como combinaciones y no como puntuaciones.
- Loot Map como conexiones entre capacidades/proyectos.
- Contact y Credits como conversión/cierre.

## Limitaciones y riesgos

- No inventar experiencia, resultados, clientes, métricas, roles, fechas o tecnologías.
- CV/URLs/contacto final requieren datos del autor.
- Progreso no debe bloquear, inflar App, duplicar datasets ni crear loops.
- Nuevas funciones deben conservar lazy loading, reduced motion y presupuesto multimedia.
- Archivos protegidos: imágenes del mundo, `Horizon`, providers, sistema musical, transforms y worktree mixto.

## Criterios de entrada

Prompt 2 puede comenzar solo con un mapa de experiencia documentado, estado tipado y verificable, reutilización de contenido, reset explícito y QA de recorrido completo/rápido/móvil/teclado/reduced motion.

