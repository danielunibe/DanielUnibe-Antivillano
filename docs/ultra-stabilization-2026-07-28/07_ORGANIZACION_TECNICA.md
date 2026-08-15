# Organización técnica

- `App.tsx` conserva la orquestación, pero pantallas y ThreeSky usan `React.lazy`/`Suspense`.
- No se añadió router, backend, base de datos ni dependencia.
- `getPreloadList` dejó de recorrer arbitrariamente todo `ASSETS`.
- `useParallaxScroll` concentra navegación/resize y respeta reduced motion.
- `GlobalTicker` se pausa al ocultar la pestaña.
- `GenericIcon3D` observa resize y libera geometrías/materiales del árbol.
- `InteractionSystem` evita rerender cuando el tooltip ya está oculto.
- Se añadieron scripts `typecheck` y `verify`.

No se realizó una migración global de CSS, providers o arquitectura horizontal.

