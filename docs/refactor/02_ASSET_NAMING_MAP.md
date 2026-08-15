# 02_ASSET_NAMING_MAP (REFAC.0)

Regla: NO renombrar assets en esta fase.

| asset actual | ruta | usado por | descripcion visual | nombre semantico recomendado | riesgo de renombrado |
|---|---|---|---|---|---|
| `ASSETS.PROPS.PROPP` | `/assets/remote/011_rlzvshi.png` | `src/components/environment/Portal.tsx` | quest giver (props/character) | `quest-giver.png` | Alto (rutas absolutas + referencias config) |
| `Avatar Vault Hunter` | `/assets/remote/041_ulhz9on.png` | `src/components/environment/EchoPortal.tsx` | personaje/identidad | `identity-avatar-vault-hunter.png` | Medio |
| `ASSETS.BG.EAST` | `/assets/remote/001_wcba3zt.png` | `EastZone` | fondo Este | `bg-east.png` | Medio |
| `ASSETS.BG.FLOOR` | `/assets/remote/002_p2lpvcp.jpeg` | Floor | suelo | `bg-floor.jpeg` | Medio |
| `ASSETS.BG.TRANSITION` | `/assets/remote/003_kawdfih.png` | NorthZone | transicion | `bg-transition.png` | Medio |
| `ASSETS.BG.HORIZON_MASK` | `/assets/remote/004_qjjdskj.png` | Horizon | mascara | `bg-horizon-mask.png` | Medio |
| `SFX click` | `/assets/audio/click.mp3` | `SoundManager` | click | `sfx-click.mp3` | Bajo |

Notas:
- Los assets viven en `public/assets/remote/*` con nombres no semanticos.
- Se cargan por rutas absolutas (prefijo `/assets/...`).
- Renombrar requiere un manifest/indice + busqueda global + verificacion visual.

