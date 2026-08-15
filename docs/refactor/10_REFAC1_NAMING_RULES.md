# REFAC.1 Naming Rules (Internal-Only)

Scope of this document: internal naming only (variables, local constants, handler functions, state variables, refs).

Hard rules for REFAC.1:
- Do not change visible UI strings.
- Do not change CSS selectors or `index.css`.
- Do not rename files/folders.
- Do not rename assets or asset paths.
- Do not change public exports used across modules unless the rename is strictly local and proven safe.

## General Conventions

- Functions:
  - Event handlers: `handleX` (preferred) or `onX` when it is a prop callback.
  - Async actions: `fetchX`, `loadX`, `startX`, `stopX` where applicable.
  - Predicates: `isX`, `hasX`, `canX`, `shouldX`.

- Booleans:
  - Use `is/has/can/should` prefixes.
  - Avoid generic names like `flag`, `toggle`, `active` without context.

- React state:
  - `[value, setValue]` pairs should read naturally: `isOpen`/`setIsOpen`, `activeIndex`/`setActiveIndex`.

- Refs:
  - Suffix with `Ref`: `statsRef`, `laserRef`, `containerRef`.

- Collections:
  - Arrays should be plural: `items`, `metricRows`.
  - Maps/dicts: `byId`, `assetByKey`, `screenByName`.

## Semantics For Ambiguous Concepts (Internal Guidance)

This is guidance only for REFAC.1. It does not rename components/files yet.

- "Portal" (environment component):
  - Prefer internal names that indicate its role: `questGiverPortal`, `questGiverInteraction`, `questGiverAsset`.
  - Avoid `propsPropp` / `propp` as mental model names, unless you are inside `ASSETS.PROPS`.

- "EchoPortal" (identity HUD):
  - Prefer internal names that indicate intent: `identityHud`, `identityStats`, `identityTitles`, `identityBanner`.
  - Avoid generic `titles`, `paragraph`, `stats` without a prefix when there are multiple sections.

- "UI/UX" duplicates:
  - Do not rename any visible labels yet.
  - Prefer a local constant for reuse when the same literal appears multiple times in the same file:
    - `const LABEL_UI_UX = "UI/UX";` (only local, only if it reduces duplication).

## Change Hygiene

- Make one rename group per file, keep diffs small.
- After each set of renames: run `pnpm -s build`.
- If anything feels ambiguous (multiple "StackScreen", multiple "Portal" references), stop and document instead of renaming.

