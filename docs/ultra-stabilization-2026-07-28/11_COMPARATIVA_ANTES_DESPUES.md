# Comparativa antes/después

| Área | Antes | Después |
| --- | --- | --- |
| Intro | Mundo y WebGL montados; HUD invisible focusable | Solo Intro; mundo tras gesto |
| Precarga | Todo `ASSETS`, audio y rutas rotas | Solo imágenes críticas existentes |
| Resize | Corrección parcial no verificada | 30 series sector/viewport con ratios exactos |
| Notch móvil | Clipping histórico; playlist hover | 44 px, tres filas, LIST, mute |
| Stack móvil | Contenido horizontal/vertical recortado | Flujo vertical desplazable |
| Credits | Autoplay parcial previo; roll inaccesible en reduced motion | Sin autoplay; transcript y pause |
| Modales | Sin trampa; Escape bloqueado 350 ms | Trap, Escape inmediato, restore |
| Interacciones | Divs mouse-only | Botones semánticos |
| Contenido | Porcentajes/contadores no respaldados visibles | Contexto/evidencia honesta sin porcentajes |
| Bundle inicial | Features/Three preloaded | Lazy chunks por interfaz |

Las capturas comparables están en `evidence-before/` y `evidence-after/`; el after fue inspeccionado en runtime, no inferido del exit code.

