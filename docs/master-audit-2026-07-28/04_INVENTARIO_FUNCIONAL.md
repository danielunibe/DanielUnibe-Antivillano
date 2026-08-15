# 04 — Inventario funcional

## Intro

- **Ruta:** `src/components/ui/IntroScreen.tsx`.
- **Propósito/flujo:** precarga manifiesto, muestra progreso y `INITIALIZE SYSTEM`; fade de 800 ms.
- **Estados:** loading, ready, fading.
- **Datos/assets:** `getPreloadList()`.
- **Responsive:** botón y título adaptan por breakpoint.
- **Accesibilidad:** botón semántico; progreso no usa `progress`, `role` ni anuncio live.
- **Errores:** `onerror` incrementa progreso igual que `onload`; oculta assets rotos.
- **Estado:** **Funcional con deuda**.
- **Finalización:** distinguir error/carga, timeout, reintento y resumen de fallos sin bloquear entrada.

## Mundo horizontal (Oeste/Norte/Este)

- **Ruta:** `App.tsx`, `Horizon.tsx`, `zones/*`, `useParallaxScroll.ts`.
- **Propósito:** navegación espacial de tres sectores.
- **Interacciones:** scroll/snap y botones Go Left/Right.
- **Estados:** índice 0–2.
- **Responsive:** arranca centrado en cada viewport; en resize durante sesión no se realinea.
- **Accesibilidad:** botones laterales semánticos; props centrales no siempre lo son.
- **Estado:** **Funcional / Refinamiento**.
- **Finalización:** resize robusto, teclado completo, nombres coherentes OESTE/NORTE/ESTE y pruebas visuales.

## Norte / identidad

- **Rutas:** `NorthZone.tsx`, `EchoPortal.tsx`, `Portal.tsx`, `.echo-*`.
- **Propósito:** perfil UI/UX/Game Designer, estadísticas y accesos principales.
- **Datos:** 08+ años, 50+ proyectos, 20+ cursos, 05+ premios; procedencia factual `NO VERIFICADO`.
- **Interacciones:** Credits (button), Contact (contenedor), Projects (imagen/contenedor).
- **Estado:** **Refinamiento**.
- **Problemas:** Contact/Quest no son botones; móvil muestra recortes deliberados/agresivos de la composición.

## Stack / Skills / Weapons

- **Ruta:** `src/features/StackScreen/*`.
- **Propósito:** inventario de software y arsenal metafórico.
- **Estados:** modo, categoría, item seleccionado/preview, cierre, animación.
- **Datos:** `STACK_DATABASE`, `WEAPONS_DATABASE`.
- **3D:** viewers diferidos 650 ms y feature flag.
- **Responsive:** desktop usa dos columnas; móvil apila, no se verificó cada item en todos los tamaños.
- **Accesibilidad:** controles principales semánticos, sin modal/foco/Escape.
- **Error confirmado:** weapon image `019_w1a2bcg.png` rota.
- **Estado:** **En desarrollo**.
- **Finalización:** asset/fallback, semántica modal, QA de todas categorías y 3D flag off.

## Loot Map

- **Ruta:** `src/features/LootMapScreen/index.tsx`.
- **Propósito:** mapa táctico con GITHUB/LINKEDIN/ARTSTATION/EMAIL.
- **Estados:** nodo activo.
- **Datos:** inline y aparentemente ficticios (`coords`, estados).
- **Interacción:** seleccionar nodos; no abre enlaces ni expone URLs.
- **Accesibilidad:** nodos son `div` clicables, no teclado/roles.
- **Estado:** **Base creada**.
- **Finalización:** decidir si es navegación real o decorativa; implementar acciones y semántica según decisión.

## Projects / Quest Log

- **Ruta:** `src/features/ProjectsScreen/*`.
- **Propósito:** 34 proyectos en FEATURED/UI_UX/3D/CODE.
- **Estados:** categoría, selección, INFO, cierre.
- **Media:** imagen, video, iframe CodePen.
- **Validado:** 9 featured; MP4 H.264 1584×1070, 78.14 s, readyState 4; iframe monta.
- **Errores/riesgos:** descripciones y estados no verificados como contenido definitivo; iframe concede permisos amplios; enlaces externos no fueron abiertos.
- **Accesibilidad:** controles principales semánticos; overlay sin contrato modal.
- **Estado:** **Funcional / Refinamiento**.
- **Finalización:** contenido real, licencias, política iframe, fallbacks de red/media y QA móvil.

## Contact

- **Ruta:** `src/features/ContactScreen/index.tsx`.
- **Propósito:** email y cinco redes.
- **Datos:** `contact@unibelands.com`; CodePen/Instagram/Facebook/LinkedIn/Dribbble.
- **Interacciones:** links abren HTML offline local; copy email.
- **Validado:** pantalla abre/cierra y links tienen `noopener noreferrer`.
- **No verificado:** la dirección y usuarios son definitivos; lectura de clipboard no confirmó el valor en el navegador de auditoría.
- **Problemas:** copy no muestra éxito/error y no espera/rechaza la Promise.
- **Estado:** **En desarrollo**.
- **Finalización:** URLs definitivas, CV real, feedback de copia y fallback.

## Credits

- **Ruta:** `src/features/CreditsScreen/index.tsx`.
- **Propósito:** making-of, stack y créditos en roll cinematográfico.
- **Interacciones:** salir, Play theme, hover pausa roll.
- **Audio:** al abrir selecciona y reproduce `patio-de-chatarra` u otra prioridad.
- **Problema:** autoplay por navegación contradice guardrail.
- **Contenido:** mezcla evidencia técnica, declaraciones creativas y recomendaciones de deploy; requiere revisión editorial.
- **Estado:** **Funcional con conflicto de requisito**.

## Settings

- **Ruta:** bloque local en `App.tsx`, portal a `document.body`.
- **Interacciones:** cerrar, centrar mundo, abrir Credits; Escape validado.
- **Accesibilidad:** labels/expanded/controls presentes; sin gestión inicial/restauración de foco.
- **Estado:** **Funcional / Refinamiento**.

## Música y SFX

- **Rutas:** `MusicPlayerContext.tsx`, `NotchMusicPlayer.tsx`, `SoundManager.ts`.
- **Funciones:** load, random initial track paused, play/pause, prev/next, seek API, volume, playlist loop, search, ducking; SFX con cooldown/rate variance.
- **Validado:** playlist 7 pistas, existencia 7/7, controles runtime, pausa manual.
- **Problemas:** seek no tiene control visible; volumen no persiste; no mute; mobile recorta controles; Credits fuerza reproducción.
- **Estado:** **Funcional / Refinamiento**.

## Tooltips, preview y toast

- **Ruta:** `InteractionSystem.tsx`.
- **Flujo:** hover registra item; Ctrl muestra tooltip; Shift+Click copia nombre y dispara toast.
- **Problemas:** patrón dependiente de mouse/modificadores, difícil de descubrir; sin equivalente táctil/teclado completo.
- **Estado:** **Funcional en desktop / Parcial en touch y accesibilidad**.

