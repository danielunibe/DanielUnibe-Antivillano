# Estado final de UnibeLands 3

Fecha: 2026-07-28  
Clasificación: **CANDIDATO A QA**

## Propósito y propuesta de valor

**CONFIRMADO:** UnibeLands 3 es un portafolio interactivo horizontal que conecta diseño de producto digital, frontend y creación 3D. La propuesta combina un mundo explorable diferenciador con una revisión profesional rápida que no obliga a “jugar” para encontrar evidencia o contacto.

## Arquitectura

**CONFIRMADO:** React 19, TypeScript, Vite y Three.js. `App.tsx` compone el mundo y overlays; `features/experience` concentra estado, misión y modo reclutador; Projects y Stack conservan sus datasets como autoridades. Los módulos pesados usan `React.lazy`/`Suspense`. La sesión se guarda en `sessionStorage`.

## Modos y recorrido

**CONFIRMADO:**

- Experiencia: Intro → misión → Oeste/Norte/Este → Stack/Weapons/Projects/Map/Contact/Credits.
- Revisión rápida: Intro → perfil → destacados → herramientas → contacto → mundo.

Los contenidos permanecen accesibles sin desbloqueos. La navegación conserva tres sectores, flechas con destino y regreso por Escape/Salir.

## Misión y progreso

**CONFIRMADO:** cinco señales: identidad, capacidades, proyecto, proceso y contacto. El progreso se registra por acciones reales, es idempotente, textual y minimizable. Móvil inicia compacto. El reset limpia sesión y centra Norte. Hay cuatro pruebas unitarias de lógica.

## Projects

**CONFIRMADO:** 35 piezas. Cuatro destacados: UnibeLands 3, Kirby World, Sci-Fi Pistol y Julia. Nueve capturas sin contexto están preservadas en Archivo. UnibeLands 3 tiene caso estructurado con contexto, contribución, proceso, evidencia y siguiente paso. Tres pruebas verifican filtrado/conteos.

**PENDIENTE:** completar casos estructurados y evidencia de los otros destacados.

## Stack y Weapons

**CONFIRMADO:** Stack muestra herramientas por categoría y registra evidencia al inspeccionar. El Inspector ya no ofrece porcentajes, rating ni rareza como validación. Weapons comunica combinaciones de capacidades y conserva assets existentes.

**PENDIENTE:** vincular más herramientas y combinaciones a proyectos verificables.

## Loot Map

**CONFIRMADO:** cuatro nodos profesionales conectan Product Design, UnibeLands 3, Frontend Systems y Contact. Cada nodo explica evidencia y lleva a un módulo real. Selección accesible con `aria-pressed`.

## Contact

**CONFIRMADO:** contacto accesible desde mundo, Map y Recruiter; copiar correo tiene feedback.

**NO VERIFICADO:** entrega del correo y URLs sociales. La UI etiqueta previews locales y verificación pendiente.

## Credits y cierre

**CONFIRMADO:** Credits documenta making-of, muestra progreso de sesión y ofrece Projects, Contact y reset. No reproduce audio al montar; `Play theme` requiere gesto.

## Game feel y audio

**CONFIRMADO:** estados hover/focus/pressed/selected/disabled, transiciones existentes, SFX en acciones y playlist controlable. Mute restaura volumen. Overlay y misión no se solapan.

**NO VERIFICADO:** mezcla en hardware físico y derechos/licencias finales.

## Responsive

**CONFIRMADO:** Intro y Recruiter sin overflow horizontal en 10 viewports: 3440×1440, 2560×1440, 1920×1080, 1600×900, 1366×768, 1280×720, 1024×768, 768×1024, 390×844 y 360×800. Recorrido móvil 390×844 cubrió mundo y overlays principales.

## Accesibilidad

**CONFIRMADO:** controles semánticos, `role=dialog`, fondo `inert`, foco inicial, trampa de foco, Escape, restauración de foco, 44 px en controles principales, nombres accesibles y progreso textual.

**NO VERIFICADO:** lector de pantalla real, zoom 200 %, dispositivo táctil físico y media emulation de reduced motion. Las ramas/CSS de reduced motion existen.

## Rendimiento

**CONFIRMADO:** entrada 11.53 kB/4.23 gzip; Recruiter 6.00/2.02; shell 67.18/19.41. `dist` tiene 163 archivos y 152,437,021 bytes. El mundo no monta durante Intro y los módulos principales están diferidos.

**PENDIENTE:** Three.js permanece en 557.27 kB minificado/146.67 gzip y dispara warning de Vite.

## Tests y QA

**CONFIRMADO:**

- 7/7 tests PASS.
- TypeScript PASS.
- build PASS, 106 módulos, 6.47 s.
- repetición `pnpm -s build`: PASS, 106 módulos, 5.90 s.
- `pnpm run verify` PASS.
- 68 rutas locales escaneadas, 0 ausentes.
- consola final: 0 errores/warnings observados.
- Escape cerró Recruiter en 150 ms observado y restauró foco a Settings.

## Archivos sensibles

**CONFIRMADO:** no se modificaron assets protegidos, artwork o transformaciones para rediseñar el mundo. Se preservaron providers y navegación horizontal. Los cambios principales están en `features/experience`, Intro, App, Projects, Stack, Loot Map, Contact y Credits.

## Decisiones y riesgos

**CONFIRMADO:** no se inventaron CV, métricas, clientes, roles, resultados o enlaces. Ausencias se etiquetan.

- P0: ninguno conocido.
- P1: datos/publicación no verificados y chunk Three.js.
- P2: casos incompletos, reduced motion runtime y QA accesible/físico.
- P3: refinamiento editorial/cosmético adicional.

## Estado de publicación

**CANDIDATO A QA**, no Candidato a publicación. El producto compila y sus recorridos centrales funcionan localmente, pero la puerta editorial, la red externa, la accesibilidad física/runtime y staging no están certificados.

## Siguiente paso

Entregar CV, correo y URLs profesionales confirmados; después ejecutar la puerta de staging descrita en `17_PLAN_DE_PUBLICACION.md`.
