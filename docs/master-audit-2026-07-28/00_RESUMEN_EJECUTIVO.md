# 00 — Resumen ejecutivo

Auditoría realizada el `2026-07-28 04:40:11 -06:00` sobre `main` / `61fdf5c90f82afd9148061471830633b816cab8e`.

## Dictamen

**Estado de la auditoría: parcial.** Se inspeccionaron código, configuración, datos, assets, documentación e historial; pasaron build y TypeScript; se ejecutó la app y se recorrieron sus módulos; se generaron capturas en los diez viewports pedidos. No se ejecutaron Lighthouse, lector de pantalla, auditoría WCAG formal, pruebas en dispositivo físico, matriz completa de navegadores ni prueba de hosting real.

**Estado del producto: funcional con bloqueos de publicación y deuda de accesibilidad/QA.** La experiencia ofrece Intro, mundo Oeste/Norte/Este, Stack/Weapons, Loot Map, Projects, Contact, Credits, Settings, música, SFX e interacción global. No debe etiquetarse como terminada.

## Hallazgos que requieren atención

1. `P1 / Alta`: Weapons referencia `/assets/remote/019_w1a2bcg.png`, inexistente. Se reprodujo `naturalWidth: 0` en `FRONTEND BLASTER`.
2. `P1 / Alta`: no existen scripts de lint, test, typecheck ni format; el chequeo TypeScript solo se pudo ejecutar manualmente.
3. `P1 / Alta`: overlays fullscreen no usan `role="dialog"`, `aria-modal`, `inert`, trampa/restauración de foco ni cierre con Escape; el mundo subyacente sigue en el árbol interactivo.
4. `P1 / Alta`: rutas absolutas `/assets`, `/offline-links` y `/playlist.json` bloquean un deploy en subpath sin estrategia de `base`.
5. `P2 / Media`: Credits inicia una pista al abrirse (`autoplay: true`), contradiciendo la decisión protegida de no restaurar autoplay.
6. `P2 / Media`: a 390×844 se recorta `volume up`; a 360×800 se recortan ambos controles laterales de volumen. Los cinco botones del notch miden 24–28 px, por debajo de un objetivo táctil de 44 px.
7. `P2 / Media`: Loot Map muestra nodos clicables como `div`, sin semántica ni acción externa real; funciona como selector visual, no como mapa de enlaces.
8. `P2 / Media`: el build pasa, pero `three` produce 557.27 kB minificados; `dist` pesa 145.34 MiB por assets públicos, incluido un video de 59.76 MiB.

## Evidencia positiva

- `pnpm -s build`: salida 0, 8.90 s.
- `pnpm exec tsc --noEmit`: salida 0, 5.45 s.
- Servidor Vite `127.0.0.1:5173`: HTTP 200.
- Playlist: 7/7 audios y 7/7 portadas presentes.
- Projects: 34 entradas; imagen, video H.264 y preview CodePen montan.
- No se detectaron `.env` actuales ni asignaciones de secretos reales en el alcance inspeccionado.

## Próxima acción recomendada

Corregir en una tarea quirúrgica el asset roto de Weapons (`019_w1a2bcg.png`) con fallback visible y una prueba automatizada de integridad de rutas públicas, sin tocar el diseño del Stack.

