# 04_COMPONENT_MAP

Tabla de componentes clave (no exhaustiva).

| Componente | Ruta | Responsabilidad | Props/Inputs | Riesgo |
|---|---|---|---|---|
| App | `src/App.tsx` | Orquestador: capas + modales + flags + navegacion lateral | state local, `RUNTIME_FLAGS`, hook de scroll | Alto |
| Horizon | `src/components/environment/Horizon.tsx` | Zonas del mundo (Oeste/Norte/Este) + triggers | callbacks `onOpen*`, `activeIndex` | Medio |
| Portal | `src/components/environment/Portal.tsx` | "Quest giver" interactivo en el mundo | `onQuestClick`, `activeIndex`, `shouldPulse` | Medio |
| EchoPortal | `src/components/environment/EchoPortal.tsx` | Tarjeta/portal con identidad + stats | `trigger?` | Alto (depende de CSS global) |
| InteractionSystem | `src/features/InteractionSystem.tsx` | hover/copy/toast global + hooks | eventos globales | Alto |
| ProjectsScreen | `src/features/ProjectsScreen/index.tsx` | Portfolio/Quest fullscreen con rail lateral y media destacada | `onClose` | Medio |
| LootMapScreen | `src/features/LootMapScreen/index.tsx` | Modal mapa/nodos | `onClose` | Bajo-Medio |
| ContactScreen | `src/features/ContactScreen/index.tsx` | Modal social/email | `onClose` | Medio |
| SoundManager | `src/utils/SoundManager.ts` | FX sonido (click/hover/equip/open) | `sfx.play()` | Medio |
| MusicPlayerProvider | `src/features/music/MusicPlayerContext.tsx` | Playlist principal, track inicial aleatorio sin autoplay y ducking de volumen en modales | `enabled`, `ducked` | Medio |
