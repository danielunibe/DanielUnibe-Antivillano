# 05 — Flujos de usuario

## Flujo principal ideal

```text
Carga → Intro 100% → Initialize → Norte
  ├── Quest Giver → Projects → categoría → proyecto → Info/Abrir → Salir
  ├── Contact → red offline o copiar email → Salir
  ├── Credits → lectura/tema → Salir
  ├── Oeste → Tactical Map → seleccionar nodo → Salir
  └── Este → Arsenal → Software/Armas → item → Salir
```

## Flujos comprobados

- Intro llega a 100%, habilita botón e inicia.
- Botones laterales mueven 0↔1↔2 y se deshabilitan en extremos.
- Settings abre, Escape cierra, reset vuelve a 0 y Credits abre desde el panel.
- Projects filtra categorías, cambia proyecto, muestra INFO, imagen/video/iframe y cierra.
- Contact abre/cierra; links apuntan a HTML offline.
- Credits abre/cierra; inicia música y puede pausarse.
- Stack cambia Software/Armas y presenta inspector.
- Loot Map abre y cambia selección visual.

## Flujos alternativos

- Scroll horizontal o gesto en lugar de flechas.
- Abrir Credits desde terminal Norte o desde Settings.
- Playlist: siguiente/anterior, selección desde panel hover, búsqueda y volumen.
- Projects: `ABRIR` abre media local o URL externa en nueva pestaña.
- Interacción global: Ctrl+hover y Shift+Click.

## Puntos muertos

- Los nodos Loot Map no conducen a GitHub/LinkedIn/ArtStation/email.
- Barrel debug registra `SYSTEM: DEBUG MODE ACCESS DENIED. (Placeholder)` y particles están off.
- Contact usa sustitutos offline, no perfiles reales.
- `public/cv/README.md` existe, pero no hay PDF de CV expuesto.

## Fricción y abandono

- La propuesta profesional tarda detrás de una Intro artificial y animaciones.
- En móvil, el mundo recorta parte de la identidad y prioriza Credits/Contact; descubrir Projects/Stack requiere navegación espacial.
- El lenguaje gaming no explica de inmediato qué prop abre cada módulo.
- Objetivos de 24–28 px en música son difíciles en touch.
- El patrón hover para playlist no existe naturalmente en touch.
- Las interfaces no cierran con Escape, salvo Settings.
- Un visitante puede interpretar contenido metafórico/placeholder como datos finales.

## Recuperación ante errores

- WebGL: `ErrorBoundary` ofrece gradiente si el render lanza error.
- Assets de Intro: el flujo continúa silenciosamente.
- Playlist: expone estados `PLAYLIST_LOAD_FAILED`/`AUDIO_LOAD_FAILED`, pero feedback visible es mínimo.
- Imágenes Projects/Weapons: no hay fallback general confirmado en los componentes activos.
- Iframe/red: no hay UI de error/reintento.

