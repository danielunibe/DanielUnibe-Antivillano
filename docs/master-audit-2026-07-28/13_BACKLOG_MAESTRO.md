# 13 — Backlog maestro

## Errores

| ID | Nombre técnico | Explicación simple | Estado | Pri. | Dependencias/riesgo | Archivos probables | Aceptación y validación |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ERR-01 | RepairWeaponAsset | Las armas no tienen imagen | Confirmado | P1 | asset aprobado | assets.ts, data, inspector | 0 rutas rotas; build + smoke Weapons |
| ERR-02 | PreserveSectionOnResize | resize mueve el mundo | Confirmado | P2 | decisión sector | hook scroll | sector idéntico tras resize; E2E |
| ERR-03 | MobileNotchFit | volumen sale de pantalla | Confirmado | P2 | diseño notch | index.css, Notch | 360/390 sin clipping; targets aprobados |
| ERR-04 | CreditsNoAutoplay | Credits inicia música | Confirmado | P2 | guardrail | CreditsScreen | abre en PAUSED; Play theme reproduce |
| ERR-05 | PreloadIntegrity | Intro oculta errores | Confirmado | P2 | manifest | Intro/assets | diferencia success/failure; test rutas |

## Deuda técnica

| ID | Nombre | Explicación | Pri. | Criterios |
| --- | --- | --- | --- | --- |
| TECH-01 | QualityGateBaseline | Añadir lint/typecheck/test/format sin rediseño | P1 | scripts pasan; CI documentada |
| TECH-02 | AccessibleOverlayPrimitive | Un contrato común de modal | P1 | dialog, inert, focus, Escape, restore; tests |
| TECH-03 | AssetManifestValidation | Comprobar rutas en build | P1 | falla con archivo ausente, pasa con repo correcto |
| TECH-04 | ResolveLockfilePolicy | pnpm único o decisión explícita | P3 | package manager/lock documentados |
| TECH-05 | ConfirmUnusedCode | Confirmar archivos/dependencias sin uso | P3 | reporte por import graph; no borrar por intuición |

## Trabajo funcional pendiente

| ID | Nombre | Explicación | Pri. | Criterios |
| --- | --- | --- | --- | --- |
| FUNC-01 | LootMapActionContract | decidir/implementar acción de nodos | P2 | cada nodo tiene propósito y teclado |
| FUNC-02 | ContactLiveDestinations | sustituir offline por links finales | P2 | PO aprueba URLs; no placeholders |
| FUNC-03 | FinalCvAsset | añadir CV final | P2 | PDF accesible, tamaño/privacidad aprobados |
| FUNC-04 | AudioControlsComplete | mute/seek/persistencia según decisión | P3 | contrato UX y pruebas |
| FUNC-05 | RuntimeFallbacks | error de media/iframe/audio | P2 | mensaje + retry/alternate link |

## Trabajo visual

| ID | Nombre | Pri. | Criterios |
| --- | --- | --- | --- |
| VIS-01 | NorthResponsiveApproval | P2 | capturas 10 viewports aprobadas; no cambiar concepto EchoPortal |
| VIS-02 | FullscreenConsistency | P3 | headers/close/focus/spacing consistentes |
| VIS-03 | UltrawideComposition | P3 | decisión creativa sobre vacío y escala |
| VIS-04 | ReducedMotionPresentation | P2 | experiencia legible sin animación |

## Contenido

| ID | Nombre | Pri. | Criterios |
| --- | --- | --- | --- |
| CONT-01 | VerifyProfileStats | P2 | 08+/50+/20+/05+ confirmados o corregidos |
| CONT-02 | VerifyProjectClaims | P2 | links, status, descripciones y niveles revisados |
| CONT-03 | CreditsEditorialPass | P2 | separar hechos, declaraciones y recomendaciones |
| CONT-04 | CopyrightLicenseManifest | P1 | autor/origen/licencia por asset/audio/font |
| CONT-05 | RemoveMisleadingStatus | P2 | “Operational/Live” solo con evidencia |

## Accesibilidad

| ID | Nombre | Pri. | Criterios |
| --- | --- | --- | --- |
| A11Y-01 | SemanticWorldTargets | P1 | props/nodos son button/link con teclado |
| A11Y-02 | ModalFocusManagement | P1 | foco atrapado/restaurado, fondo inert |
| A11Y-03 | EscapeAllOverlays | P1 | Escape cierra cada screen sin cerrar app |
| A11Y-04 | FocusContrastAudit | P2 | foco visible y contraste medido |
| A11Y-05 | ScreenReaderPass | P2 | recorrido NVDA/VoiceOver documentado |

## Rendimiento y publicación

| ID | Nombre | Pri. | Criterios |
| --- | --- | --- | --- |
| PERF-01 | VideoWebDelivery | P2 | tamaño objetivo basado en calidad; poster; no regresión |
| PERF-02 | LazyFeatureLoading | P3 | carga inicial menor medida; modales siguen funcionales |
| PERF-03 | ThreeRuntimeProfile | P3 | FPS/memoria/contextos medidos en hardware objetivo |
| PUB-01 | DecideHostingPath | P1 | root/subpath y proveedor aprobados |
| PUB-02 | BasePathHardening | P1 | preview del subpath elegido sin 404 |
| PUB-03 | PublicMetadata | P2 | title/description/favicon/OG/robots/sitemap según alcance |
| PUB-04 | BrowserMatrix | P2 | Chrome/Edge/Firefox/Safari objetivo documentados |
| PUB-05 | ReleaseChecklist | P1 | build, tests, assets, links, license, QA y rollback |

