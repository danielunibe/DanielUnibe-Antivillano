# 07 — Datos y contenido

## Fuentes

| Conjunto | Archivo | Estructura | Estado |
| --- | --- | --- | --- |
| Stack | `features/StackScreen/data.ts` | `StackItem[]`, `WeaponConfig[]` | completo estructuralmente; veracidad no validada |
| Projects | `features/ProjectsScreen/data.ts` | 34 `Project` | mezcla real/provisional |
| Assets | `config/assets.ts` | objeto `ASSETS` | parcial y con rutas rotas |
| Música | `public/playlist.json` | `{tracks: Track[]}` | consistente, 7/7 archivos |
| Contact | `ContactScreen/index.tsx` | 5 links + email inline | provisional/offline |
| Credits | `CreditsScreen/index.tsx` | bloques inline | vigente técnicamente, editorialmente mixto |
| Loot Map | `LootMapScreen/index.tsx` | 4 nodos inline | decorativo/provisional |
| Perfil | `EchoPortal.tsx` | texto y stats inline | visible; fuente no documentada |
| Flags | `runtimeFlags.ts` | cuatro booleanos env | vigente |

## Contenido definitivo o estable por evidencia

- Nombre del producto y concepto de portfolio interactivo.
- Stack técnico realmente importado: React, TS, Vite, Tailwind/PostCSS, Three, Howler y fuentes.
- Nombres y archivos de las siete pistas locales.
- Ocho capturas featured y un video presentes.
- Decisiones visuales de `DESIGN.md`/guardrails.

## Provisional / placeholder / no verificable

- Redes y CV: HTML offline; falta PDF final.
- Email `contact@unibelands.com`: existencia/propiedad no comprobada.
- Stats 08+/50+/20+/05+: fuente no documentada.
- Estados `LIVE`, `COMPLETE`, `ACTIVE`, niveles y descripciones de proyectos: no validados contra repositorios/publicaciones.
- Nodos Loot Map, coordenadas y `SYSTEM ONLINE`.
- Footer corporativo 2024.
- Barrel debug placeholder.
- Credits menciona plataformas de deploy recomendadas como si fueran decisión de producto; no hay proveedor elegido.

## Duplicación e inconsistencias

- `UI/UX` aparece en identidad, categoría Stack y categoría Projects.
- Dos `StackScreen`: feature real y re-export UI.
- Cinco CodePens comparten thumbnail `039_nfzxv8g.png` de 161×81 / 503 bytes.
- Armas BLASTER/RIFLE/SNIPER comparten la misma ruta inexistente.
- `STONE_MOUNDS` y `TRANSITION_BASE` comparten asset 009.
- Títulos repetidos en variantes de pistas, distinguidos solo por id/archivo.
- README oficial habla de Gemini/npm y no del runtime actual.

## URLs y privacidad

- Externas: cinco CodePen pen/embed URLs y el remoto GitHub en Git, no en runtime de usuario.
- Locales: links sociales/3D remiten a `public/offline-links/*.html`.
- Datos personales públicos: nombre Daniel Unibe, handles y email de contacto.
- No se encontraron secretos activos. Los prompts migrados son material legado y pueden contener contexto personal; revisar antes de publicación aunque no se detectaron asignaciones de credenciales.

## Centralización propuesta

Sin implementarla todavía:

1. `profile.ts` para identidad/stats/contact.
2. `links.ts` para redes con estado `offline|live`.
3. manifiesto de assets validable en build.
4. schema runtime para playlist/projects.
5. distinguir `verified`, `draft`, `placeholder` en contenido.

