# 00_ELEMENT_INVENTORY (REFAC.0)

Fecha/Hora: 2026-05-20 (America/Mexico_City)

Objetivo: inventario semantico (sin renombrar, sin mover, sin refactor).

| elemento visible | nombre actual | archivo/componente | tipo | funcion | riesgo | nombre recomendado |
|---|---|---|---|---|---|---|
| UI/UX (titulo grande) | `UI/UX` | `src/components/environment/EchoPortal.tsx` + `index.css` (`.echo-line-uiux`) | HUD label | identidad/rol | Alto (CSS sensible `.echo-*`) | `HudIdentityTitleUiUx` |
| UI/UX (tab Stack) | `UI/UX` | `src/features/StackScreen/components/InventoryGrid.tsx` (CategoryTab) | Hud tab | filtrar inventario | Medio | `StackCategoryTabUiUx` |
| UI / UX (tab Projects) | `UI / UX` | `src/features/ProjectsScreen/index.tsx` | Hud tab | filtrar proyectos | Medio | `ProjectsCategoryTabUiUx` |
| GAME DESIGNER | `GAME DESIGNER` | `src/components/environment/EchoPortal.tsx` + `index.css` (`.echo-line-designer`) | HUD label | rol | Alto (CSS sensible) | `HudIdentitySubtitleGameDesigner` |
| YEARS/PROJECTS/COURSES/AWARDS | `.echo-stats-grid` + `.echo-stat-*` | `src/components/environment/EchoPortal.tsx` + `index.css` | Hud stat grid | stats de perfil | Alto (CSS sensible) | `HudStatGridIdentity` |
| Quest Giver (personaje) | `QUEST GIVER` + `ASSETS.PROPS.PROPP` | `src/components/environment/Portal.tsx` | World interactive | abre Projects/Quest log | Medio | `WorldQuestGiver` / `WorldQuestGiverProp` |
| Avatar/Vault Hunter (EchoPortal) | `041_ulhz9on.png` | `src/components/environment/EchoPortal.tsx` | Hud image | personaje/identidad | Medio | `HudIdentityAvatar` |
| Horizon wrapper | `Horizon` | `src/components/environment/Horizon.tsx` | World layer | coordina zonas | Medio | `WorldHorizon` |
| West zone | `WestZone` | `src/components/environment/zones/WestZone.tsx` | World zone | area Oeste | Medio | `WorldZoneWest` |
| North zone | `NorthZone` | `src/components/environment/zones/NorthZone.tsx` | World zone | area Norte | Medio | `WorldZoneNorth` |
| East zone | `EastZone` | `src/components/environment/zones/EastZone.tsx` | World zone | area Este | Medio | `WorldZoneEast` |
| Stack modal | `StackScreen` | `src/features/StackScreen/index.tsx` (y tambien `src/components/ui/StackScreen.tsx` existe) | Modal/Screen | inventario/stack | Alto (naming duplicado) | `StackModal` (y resolver duplicado) |
| Projects modal | `ProjectsScreen` | `src/features/ProjectsScreen/index.tsx` | Screen | quest log/proyectos | Medio | `ProjectsModal` |
| LootMap modal | `LootMapScreen` | `src/features/LootMapScreen/index.tsx` | Screen | mapa/nodos | Medio | `LootMapModal` |
| Contact modal | `ContactScreen` | `src/features/ContactScreen/index.tsx` | Screen | contacto/redes | Medio | `ContactModal` |
| World side navigation | `.world-nav-*` | `src/App.tsx` + `index.css` | HUD | flechas laterales O/E | Bajo-Medio | mantener lateral |
| Interaction system | `InteractionSystem` | `src/features/InteractionSystem.tsx` | System | hover/copy/toast | Alto (cross-cutting) | `InteractionHudSystem` |
| Sound manager | `SoundManager` / `sfx` | `src/utils/SoundManager.ts` | Utility | SFX | Medio | `SfxManager` |
| runtime flags | `RUNTIME_FLAGS` | `src/config/runtimeFlags.ts` | Config | toggles runtime | Bajo | `RuntimeFlags` |
| assets principales (Portal/EchoPortal) | `ASSETS.*` | `src/config/assets.ts` | Config | rutas public/ | Medio | `AssetManifest` |

Notas de ambiguedad detectada:
- `StackScreen` existe como feature (`src/features/StackScreen/index.tsx`) y como componente UI (`src/components/ui/StackScreen.tsx`). Esto es un riesgo alto para renombrados.
