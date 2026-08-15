# Cambios realizados

| Archivo | Cambio | Motivo |
| --- | --- | --- |
| `src/config/assets.ts` | Reemplazó las tres referencias Weapons de 019 por el render local 024. | 019 no existe; 024 existe y ya representa una pistola sci-fi del portfolio. |
| `src/hooks/useParallaxScroll.ts` | Guardó el sector activo en ref y lo reaplica en `resize`. | `scrollLeft` se mide en píxeles del viewport anterior. |
| `index.css` | Layout móvil de notch, targets 44 px y `prefers-reduced-motion`. | Evitar clipping en anchos 360–390 px y reducir movimiento a demanda. |
| `src/features/CreditsScreen/index.tsx` | Retiró el efecto de autoplay al montar. | Credits no debe alterar audio sin interacción explícita. |
| `src/App.tsx` | Wrapper modal compartido con dialog, Escape, foco, restauración e inert. | Mejora transversal sin reescribir cinco pantallas. |
| `src/features/ProjectsScreen/index.tsx` | Retiró `allow` amplio del iframe CodePen. | Elimina cámara, micrófono, geolocalización, payment y otras capabilities no justificadas. |

No se añadieron dependencias, scripts, lockfiles, refactors globales ni cambios de media.
