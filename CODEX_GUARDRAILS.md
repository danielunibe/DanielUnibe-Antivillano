# CODEX_GUARDRAILS

## Proposito

Evitar regresiones, cambios no solicitados y ediciones en el archivo equivocado.

## Protocolo de edicion segura

1. Localizar:
   - buscar strings/clases con `rg`
   - confirmar si existen duplicados (ej: "UI/UX" aparece en EchoPortal, StackScreen y ProjectsScreen)
2. Tocar lo minimo:
   - 1-2 archivos idealmente
   - sin refactors
3. Validar:
   - `pnpm -s build`
4. Reportar:
   - que cambio
   - que NO se toco
   - rollback

## Protocolo de rollback

- Todo cambio debe poder revertirse con un diff pequeno.
- Antes de cambios grandes: crear backup con timestamp.

## Zonas sensibles (precaucion)

- `index.css`:
  - bloque `.echo-*` (EchoPortal)
- `src/App.tsx`:
  - orquestador principal
- `src/features/InteractionSystem.tsx`:
  - sistema global

## Decisiones protegidas recientes

- 2026-06-02: `EchoPortal` queda fijado como portal holográfico: el fondo visible, el patrón hexagonal y las cajas de identidad/stats forman una sola composición. No reinterpretar el concepto; solo ajustar escala, opacidad y posición si el usuario lo pide.
- 2026-05-21: No restaurar el menu inferior `OESTE / NORTE / ESTE` salvo instruccion explicita. La navegacion activa del mundo vive en botones laterales.
- 2026-05-21: No tocar `EchoPortal` ni estilos `.echo-*` para estos cambios de escenario/audio/Quest; quedaron fuera de alcance.
- 2026-05-21: Los MP3 principales se normalizaron en `public/assets/audio/music`; no mezclar con SFX (`click`, `hover`, `open`, `equip`).
- 2026-05-21: Las redes sociales y CV en Intro usan placeholders hasta recibir URLs/PDF finales.
- 2026-05-21: No restaurar autoplay de musica. El playlist puede cargar track aleatorio, pero debe quedar pausado hasta accion explicita del usuario.
- 2026-05-21: El piso panoramico `/assets/remote/002_p2lpvcp.jpeg` no debe volver a renderizarse como bloque visible de 300vw que cubre la escena. Debe permanecer como franja baja, desplazada hacia abajo y sin loader.
- 2026-05-21: Los imports prioritarios del Escritorio viven en `public/assets/portfolio/imports/` y deben aparecer destacados en Quest/Portfolio.
- 2026-05-21: Quest/Portfolio no debe cubrir por defecto la media principal con bloques grandes de texto. La ficha descriptiva debe abrirse bajo demanda (`INFO`) y el rail debe mantenerse compacto hasta que el usuario interactue.

## Como evitar el error "modificar la imagen equivocada"

1. Buscar por `alt=` y por la ruta del asset.
2. Confirmar el componente:
   - `EchoPortal.tsx`: avatar/vault hunter + stats HUD
   - `Portal.tsx`: QUEST GIVER (personaje interactivo del mundo)
3. Aplicar cambios solo en el componente correcto.
