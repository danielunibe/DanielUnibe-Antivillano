# 01_COMPONENT_NAMING_MAP (REFAC.0)

Objetivo: proponer nombres semanticos sin aplicar cambios.

| nombre actual | ruta actual | responsabilidad real | problema de naming | nombre recomendado | prioridad |
|---|---|---|---|---|---|
| `Portal` | `src/components/environment/Portal.tsx` | Quest giver interactivo que dispara Projects/Quest | "Portal" es generico | `WorldQuestGiver` o `WorldQuestGiverPortal` | Alta |
| `EchoPortal` | `src/components/environment/EchoPortal.tsx` | Tarjeta identidad + stats (HUD) | "EchoPortal" no describe identidad/HUD | `HudIdentityEchoPortal` | Media |
| `Horizon` | `src/components/environment/Horizon.tsx` | Wrapper del mundo y zonas | "Horizon" ok pero no marca "World" | `WorldHorizon` | Baja |
| `WestZone` | `src/components/environment/zones/WestZone.tsx` | zona Oeste | naming ok pero inconsistente | `WorldZoneWest` | Baja |
| `NorthZone` | `src/components/environment/zones/NorthZone.tsx` | zona Norte | idem | `WorldZoneNorth` | Baja |
| `EastZone` | `src/components/environment/zones/EastZone.tsx` | zona Este | idem | `WorldZoneEast` | Baja |
| `StackScreen` (feature) | `src/features/StackScreen/index.tsx` | modal/pantalla stack | choca con `components/ui/StackScreen.tsx` | `StackModal` | Alta |
| `StackScreen` (UI) | `src/components/ui/StackScreen.tsx` | wrapper UI usado por App | naming confuso | `StackModalShell` o consolidar en futuro | Alta |
| `ProjectsScreen` | `src/features/ProjectsScreen/index.tsx` | modal de proyectos | "Screen" ok | `ProjectsModal` | Media |
| `LootMapScreen` | `src/features/LootMapScreen/index.tsx` | modal loot map | "Screen" ok | `LootMapModal` | Media |
| `ContactScreen` | `src/features/ContactScreen/index.tsx` | modal contacto | "Screen" ok | `ContactModal` | Media |
| `.world-nav-*` | `src/App.tsx` + `index.css` | HUD nav lateral | sustituye nav inferior retirada | mantener lateral | Baja |
| `InteractionSystem` | `src/features/InteractionSystem.tsx` | HUD hover/copy/toast + hook | "System" ok, pero no expresa HUD | `InteractionHudSystem` | Media |
| `SoundManager` | `src/utils/SoundManager.ts` | SFX player | ok | `SfxManager` | Baja |

Reglas propuestas (solo guia futura):
- Pantallas/modales: preferir `*Modal` cuando es overlay full-screen.
- Entorno/mundo: prefijo `World*` o `Environment*`.
- HUD: prefijo `Hud*`.
