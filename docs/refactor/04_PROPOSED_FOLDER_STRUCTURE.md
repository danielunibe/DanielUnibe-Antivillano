# 04_PROPOSED_FOLDER_STRUCTURE (REFAC.0)

Propuesta futura (NO aplicar ahora).

```txt
src/
├─ app/                       # entry/runtime (App, boot helpers)
├─ components/
│  ├─ hud/                    # Navigation, overlays, identity HUD
│  ├─ world/                  # Horizon + zones + quest giver
│  ├─ environment/            # sky, floor, particles
│  ├─ interaction/            # InteractionSystem + cursor + tooltip
│  └─ shared/                 # small reusable UI components
├─ features/
│  ├─ stack/                  # Stack modal/screen
│  ├─ projects/               # Projects modal/screen
│  ├─ loot-map/               # LootMap modal/screen
│  └─ contact/                # Contact modal/screen
├─ config/
├─ hooks/
├─ styles/
├─ utils/
└─ types/
```

Que mover en fases futuras:
- `components/environment/*` y `components/environment/zones/*` -> `components/world/` + `components/environment/`
- `EchoPortal` -> `components/hud/identity/` o `components/hud/`
- `InteractionSystem` -> `components/interaction/`

Que NO mover todavia:
- Nada en REFAC.0. Solo documentacion.

Riesgos al mover:
- imports cruzados
- rutas absolutas de assets
- CSS sensible en `index.css`

