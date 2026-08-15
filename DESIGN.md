# DESIGN.md

## Identidad visual

- La pantalla de `EchoPortal` funciona como un portal holográfico sobre un fondo visible.
- La composición debe leerse como una sola pieza: marco, avatar, título, descripción y stats.
- El patrón hexagonal forma parte del lenguaje visual base y no debe reemplazarse por otra retícula.

## Reglas de composición

- `UI/UX` y `GAME DESIGNER` permanecen como foco principal.
- Las cajas de `YEARS`, `PROJECTS`, `COURSES` y `AWARDS` deben sentirse unidas al mismo holograma.
- Los ajustes futuros deben modificar tamaño, densidad o contraste; no deben cambiar el concepto.

## Estado confirmado

- El portal se considera una pantalla protegida en su intención general.
- Se permiten solo ajustes puntuales de escala, opacidad, degradado y posición relativos.
- En `EchoPortal`, título, banner, stats y descripción deben ocupar zonas separadas. La descripción no debe volver a quedar detrás de las cajas de stats.

## Quest Giver / Portal de mundo

- `src/components/environment/Portal.tsx` controla el personaje interactivo `QUEST GIVER`, distinto de `EchoPortal`.
- En layout `west`, el personaje debe quedar completo dentro del viewport OESTE y conservar click directo hacia `MASTER_QUEST_LOG`.
- Ajustes permitidos: posicion horizontal/vertical, pulso de pista y escala local del personaje.
- No modificar `EchoPortal` ni los estilos `.echo-*` para corregir el `QUEST GIVER`.

## Master Quest Log

- `src/features/ProjectsScreen/index.tsx` debe explicar el flujo de uso desde el primer vistazo.
- La pantalla debe mostrar tres acciones claras: elegir categoria, seleccionar quest y revisar o abrir.
- El rail lateral de desktop debe permanecer legible; no volver a colapsarlo a iniciales sin una pista visible equivalente.
- La media principal sigue siendo protagonista, pero debe tener una ficha compacta de contexto del proyecto seleccionado.
