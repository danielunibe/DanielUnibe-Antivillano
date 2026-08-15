# 06_INTERACTION_SYSTEM

Archivo:
- `src/features/InteractionSystem.tsx`

## Que hace

- Provee `useImageInteraction(name, src?)` para registrar hover sobre elementos.
- Renderiza un HUD global:
  - preview superior ("TARGET LOCKED")
  - tooltip al presionar Control
  - copy al hacer Shift+Click
  - toast "DATA ACQUIRED"

## Mecanismo

- Usa `CustomEvent` global:
  - dispatch: `window.dispatchEvent(new CustomEvent('interaction-hover', { detail }))`
  - listen: `window.addEventListener('interaction-hover', ...)`

## Sonido

- Usa `sfx.play('CLICK'|'HOVER'|'EQUIP'|...)` desde `src/utils/SoundManager.ts`
- Los mp3 viven en `public/assets/audio/*`

## Riesgos al modificar

- Es un sistema transversal: un cambio puede afectar multiples pantallas.
- El copy/clipboard depende de contexto de gesto del navegador (Shift+Click).

