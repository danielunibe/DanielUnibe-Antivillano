# Inventario de hallazgos

| Prioridad | Hallazgo | Evidencia | Estado |
| --- | --- | --- | --- |
| P0 | Weapons apuntaba históricamente a `019_w1a2bcg.png`, inexistente | Config y decode runtime | CORREGIDO |
| P0 | Sector activo podía perderse al redimensionar | Matriz secuencial de resize | CORREGIDO |
| P0 | Notch móvil recortaba controles | Capturas 360/390 y DOM | CORREGIDO |
| P0 | Credits podía alterar música al abrir | Pista/status/volumen antes-después | CORREGIDO |
| P1 | Precarga recorría imágenes, audio y una ruta `014` inexistente; `onerror` contaba como éxito | Análisis estático | CORREGIDO |
| P1 | Mundo/WebGL/listeners activos bajo Intro | Arquitectura de montaje | CORREGIDO |
| P1 | Stack/Weapons y Contact recortados en móvil | Captura 390×844 | CORREGIDO |
| P1 | Interacciones centrales eran `div` clicables | DOM accesible y fuente | CORREGIDO |
| P1 | Modal sin trampa de foco; Escape inmediato ignorado | Fuente y prueba runtime | CORREGIDO |
| P1 | Playlist solo disponible por hover | DOM móvil y touch target | CORREGIDO |
| P1 | Reduced motion ocultaba Credits | CSS/scroll transcript | CORREGIDO |
| P1 | Estado React nuevo en cada `mousemove` oculto | Fuente | CORREGIDO |
| P1 | Cleanup/resize incompleto en iconos 3D | Fuente | CORREGIDO PARCIAL |
| P2 | Porcentajes y contadores profesionales no respaldados | UI/datos | VISIBILIDAD RETIRADA |
| P2 | Redes, email y CV final no verificados | Auditoría y `public/cv/README.md` | PENDIENTE EDITORIAL |
| P2 | Three.js >500 kB y multimedia pesada | Build/inventario | RIESGO ABIERTO |
| P2 | Hosting bajo subruta | Rutas absolutas y `base` no definido | NO VERIFICADO |

Los hallazgos se clasificaron como **CONFIRMADO**, **INFERIDO** o **NO VERIFICADO**; no se convirtió una inferencia en PASS.

