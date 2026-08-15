# North Screen Element Map (NORTH pane / activeIndex = 1)

This document tells you exactly "what is what" on the NORTH screen, with the
component/file that renders it and the image asset it uses (when applicable).

Scope: the world pane NORTH (not the Stack/Projects/Contact/LootMap modals).

## How To Identify An Element On Screen (fast workflow)

1. Right-click the element in the browser and choose "Inspect".
2. Look for the nearest `<img>` tag (or a wrapper `div`) in the Elements panel.
3. Check:
   - `src="..."`
   - `alt="..."`
   - `class="..."`
4. Then search in code by `src` or `alt`:
   - search for the `src` string (example: `/assets/remote/041_ulhz9on.png`)
   - or search for the `alt` (example: `QUEST GIVER`)

## Layer/Component Overview (what composes the screen)

The NORTH world view is composed by these main components:

- `ThreeSky` (background sky + clouds): `src/components/environment/ThreeSky.tsx`
- `Horizon` (the 3-pane world strip): `src/components/environment/Horizon.tsx`
  - `WestZone`: `src/components/environment/zones/WestZone.tsx`
  - `NorthZone`: `src/components/environment/zones/NorthZone.tsx`
  - `EastZone`: `src/components/environment/zones/EastZone.tsx`
- `Floor` (ground): `src/components/environment/Floor.tsx`
- Navegacion lateral del mundo (OESTE / ESTE): `src/App.tsx` + `.world-nav-*` en `index.css`

## NORTH Zone: Exact Elements

All these are rendered by:

- `src/components/environment/zones/NorthZone.tsx`

### 1) "Stone Mounds" (rocks / ruins layer)

- What you see: big rocks/ruins silhouette behind the portal area.
- Rendered by: `NorthZone.tsx`
- Asset: `ASSETS.STRUCTURES.STONE_MOUNDS`
- Asset path: `/assets/remote/009_epbzi5m.png`
- `<img alt>`: `"Stone Mounds"`
- Notes: This element is positioned via inline `transform: translateX(...) translateY(...)`.

### 2) EchoPortal (identity HUD card)

- What you see: the holographic card with `UI/UX`, `GAME DESIGNER`, stats grid, avatar.
- Rendered by: `NorthZone.tsx` mounts `<EchoPortal />`
- Component: `src/components/environment/EchoPortal.tsx`

Inside EchoPortal, the key visual asset is:

- Asset: hardcoded `src="/assets/remote/041_ulhz9on.png"`
- `<img alt>`: `"Avatar Vault Hunter"`

The rest (UI/UX, GAME DESIGNER, INTELLIGENCE SYSTEMS, stats) are text + CSS:

- CSS block: `index.css` (selectors start with `.echo-...`)

### 3) CONTACT box (green square)

- What you see: green translucent square with text `CONTACT`
- Rendered by: `NorthZone.tsx`
- Asset: none (pure HTML/CSS)
- Notes: It is clickable and calls `onContactClick`.

### 4) Portal (Quest Giver prop in front)

- What you see: the character/prop in front of the portal (clickable for Projects).
- Rendered by: `NorthZone.tsx` mounts `<Portal />`
- Component: `src/components/environment/Portal.tsx`

Main image:

- Asset key: `ASSETS.PROPS.PROPP`
- Asset path: `/assets/remote/011_rlzvshi.png`
- `<img alt>`: `"QUEST GIVER"`

### 5) Transition background (gateway)

- What you see: big transition structure that bridges NORTH -> EAST.
- Rendered by: `NorthZone.tsx`
- Asset key: `ASSETS.BG.TRANSITION`
- Asset path: `/assets/remote/003_kawdfih.png`
- `<img alt>`: `"Estructura Transición"`

### 6) Transition base (foundation)

- What you see: base/foundation element under the transition structure.
- Rendered by: `NorthZone.tsx`
- Asset key: `ASSETS.STRUCTURES.TRANSITION_BASE`
- Asset path: `/assets/remote/009_epbzi5m.png`
- `<img alt>`: `"Estructura Base Norte-Este"`

## Quick Search Keys (copy/paste)

If you want to locate any element quickly in code, search for one of these:

- `Stone Mounds`
- `/assets/remote/009_epbzi5m.png`
- `/assets/remote/011_rlzvshi.png`
- `/assets/remote/041_ulhz9on.png`
- `Estructura Transición`
- `Estructura Base Norte-Este`
- `UI/UX`
- `GAME DESIGNER`
