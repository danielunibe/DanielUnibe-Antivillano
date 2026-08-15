# ANTI-VILLANO — DESIGN SYSTEM v1.0

### Visual Language · Comic Onomatopoeia · Industrial Noir · Cel-Shading Interface

> **Premisa de diseño:** No es un videoclip decorado. Es una escena donde el personaje convierte el escenario en un juicio contra su propia identidad. Cada frame es una viñeta. Cada golpe sonoro es un efecto visual. La música reescribe la realidad.

---

## 0. FILOSOFÍA CENTRAL

```
BORDERLANDS 3 + BLACK SHEEP + ANTI-VILLANO =
  [Cel-shading industrial] + [Performance como narrativa] + [Tinta viva como poder]
```

### El triángulo de inspiración

| Fuente                          | Lo que aporta                                                                                          | Lo que NO se copia                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| **Borderlands 3**               | Outlines cel-shading, paleta pop-agresiva, tipografía brutal, íconos de cómic, onomatopeyas diegéticas | El humor amarillo desenfadado, el cartoon caricaturesco |
| **Black Sheep (Scott Pilgrim)** | Performance como boss fight, montaje=viñeta, luces como poder, onomatopeya integrada al mundo          | La estética pop indie 2010, el glamour adolescente      |
| **Anti-villano (canción)**      | Tinta viva, engranes/guion/expediente, conflicto identitario, industrial noir, ambigüedad moral        | —                                                       |

### Resultado: lo que SÍ somos

```
INDUSTRIAL NOIR CEL-SHADED
  └─ Mundo real deformado por emoción
  └─ Personaje más grande que el escenario
  └─ La música como escritura del destino
  └─ Onomatopeyas que nacen del entorno, no flotan
  └─ La tinta como lenguaje, no decoración
```

---

## 1. PALETA DE COLOR

### 1.1 Colores primarios — "El expediente"

```css
:root {
  /* ─── NEGROS ─── */
  --ink-absolute: #0a0806; /* Negro tinta, más caliente que puro */
  --ink-deep: #100d0a; /* Fondo principal */
  --ink-panel: #1a1510; /* Paneles de viñeta */
  --ink-outline: #0d0a07; /* Outlines cel-shading */

  /* ─── BLANCOS / PAPELES ─── */
  --paper-raw: #f5edd8; /* Papel sin blanquear */
  --paper-aged: #ddd0b0; /* Pergamino viejo */
  --paper-flash: #fffbf0; /* Flash de impacto */
  --paper-burn: #c4a97a; /* Quemado, degradado */

  /* ─── MAGENTAS — el acento de amenaza ─── */
  --threat-hot: #e8006a; /* Magenta puro — impacto máximo */
  --threat-deep: #a8004d; /* Magenta oscuro — sombra activa */
  --threat-glow: #ff1a7a; /* Glow, neon, hover state */
  --threat-muted: #7a0038; /* Magenta apagado — background accent */

  /* ─── INDUSTRIALES ─── */
  --metal-cold: #2a3a4a; /* Azul acero frío */
  --metal-rust: #5c3a1e; /* Oxidado, orgánico */
  --metal-chrome: #8a9aa8; /* Cromado reflejo */
  --cable-live: #1a2a1a; /* Negro verde eléctrico vivo */

  /* ─── ONOMATOPEYA / EFECTOS ─── */
  --fx-yellow: #ffd700; /* Solo para onomatopeyas de impacto */
  --fx-cyan: #00e5ff; /* Glitch, error de sistema */
  --fx-red-error: #ff2200; /* ERROR, fallo, ruptura */
  --fx-white-flash: #ffffff; /* Flash puro de golpe */

  /* ─── TINTA VIVA ─── */
  --ink-active: #1a0a2a; /* Tinta con matiz violeta oscuro */
  --ink-spread: rgba(10, 8, 6, 0.85); /* Mancha expandiéndose */
  --ink-drip: #0a0510; /* Gota cayendo */
}
```

### 1.2 Combinaciones de uso

| Contexto         | Fondo           | Texto            | Acento           |
| ---------------- | --------------- | ---------------- | ---------------- |
| Panel principal  | `--ink-deep`    | `--paper-raw`    | `--threat-hot`   |
| Viñeta flash     | `--paper-flash` | `--ink-absolute` | `--fx-red-error` |
| Onomatopeya      | `--fx-yellow`   | `--ink-outline`  | `--threat-hot`   |
| Error/glitch     | `--ink-deep`    | `--fx-cyan`      | `--fx-red-error` |
| Expediente       | `--paper-aged`  | `--ink-absolute` | `--threat-muted` |
| HUD de personaje | `--ink-panel`   | `--metal-chrome` | `--threat-glow`  |

---

## 2. TIPOGRAFÍA

### 2.1 Stack de fuentes

```css
/* ─── DISPLAY — Para títulos, nombres, impacto ─── */
@import url("https://fonts.googleapis.com/css2?family=Bangers&display=swap");
/* Bangers: el ADN visual de cómic americano. Mayúsculas, pesado, ligero-espaciado */

/* ─── ONOMATOPEYA — Solo para efectos de sonido visuales ─── */
@import url("https://fonts.googleapis.com/css2?family=Boogaloo&display=swap");
/* Boogaloo: divertido pero con peso. Para POW, CLANK, ERROR */

/* ─── NARRATIVO — Cuerpo de expediente, párrafos ─── */
@import url("https://fonts.googleapis.com/css2?family=Special+Elite&display=swap");
/* Special Elite: máquina de escribir golpeada. Imperfecta y dramática */

/* ─── SISTEMA / HUD — Datos, stats, códigos ─── */
@import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap");
/* Share Tech Mono: monospace industrial. Para coordenadas, errores, código */

/* ─── ALTERNATIVA DISPLAY B — Títulos secundarios ─── */
@import url("https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap");
/* Permanent Marker: marcador sobre papel. Para anotaciones manuales sobre el expediente */
```

### 2.2 Escala tipográfica

```css
:root {
  /* DISPLAY */
  --type-hero: clamp(72px, 12vw, 144px); /* Nombre del personaje / título */
  --type-impact: clamp(48px, 8vw, 96px); /* Onomatopeya principal */
  --type-title: clamp(32px, 5vw, 64px); /* Título de sección/viñeta */

  /* NARRATIVO */
  --type-body: clamp(14px, 2vw, 18px); /* Texto de expediente */
  --type-caption: clamp(11px, 1.5vw, 14px); /* Pie de viñeta */
  --type-annotation: clamp(12px, 1.8vw, 16px); /* Anotación de marcador */

  /* HUD */
  --type-hud: clamp(10px, 1.2vw, 13px); /* Stats, coords */
  --type-error: clamp(12px, 1.5vw, 14px); /* Mensajes de error */

  /* ESPACIADO */
  --letter-impact: 0.08em; /* Bangers en hero */
  --letter-mono: 0.05em; /* Share Tech en HUD */
  --letter-body: 0.02em; /* Special Elite en cuerpo */
}
```

### 2.3 Reglas tipográficas estrictas

```
Bangers       → SOLO mayúsculas. NUNCA minúsculas. Siempre con outline negro.
Boogaloo      → Solo en onomatopeyas. NUNCA en cuerpo de texto.
Special Elite → Solo en texto narrativo. Nunca en títulos.
Share Tech    → Solo en HUD, coordenadas, error codes.
Permanent     → Solo en anotaciones "a mano" sobre expedientes/papel.

NUNCA mezclar más de 2 familias en un mismo panel.
```

### 2.4 Regla de outline tipográfico (ADN Borderlands)

```css
/* Borderlands-style text stroke — obligatorio en títulos */
.text-bangers-hero {
  font-family: "Bangers", cursive;
  color: var(--paper-raw);
  -webkit-text-stroke: 3px var(--ink-outline);
  text-shadow:
    4px 4px 0px var(--ink-outline),
    6px 6px 0px var(--threat-deep);
  letter-spacing: var(--letter-impact);
}

/* Onomatopeya con outline amarillo */
.text-onomatopoeia {
  font-family: "Boogaloo", cursive;
  color: var(--fx-yellow);
  -webkit-text-stroke: 3px var(--ink-outline);
  text-shadow:
    3px 3px 0px var(--ink-outline),
    0px 0px 12px var(--threat-hot);
}
```

---

## 3. SISTEMA DE OUTLINES — CEL-SHADING

### 3.1 El principio fundamental

> En Borderlands, el outline no es decoración. Es la separación entre el personaje y el mundo. Es la línea que dice: "esto existe, esto es real dentro de sus reglas".
> En Anti-villano, el outline es la línea del guion que el personaje no eligió.

### 3.2 Grosor de outlines por elemento

```css
:root {
  --outline-hero: 4px; /* Personaje principal */
  --outline-object: 3px; /* Objetos importantes (micrófono, pluma, tintero) */
  --outline-panel: 6px; /* Bordes de viñeta */
  --outline-text: 3px; /* Títulos y onomatopeyas */
  --outline-detail: 2px; /* Detalles ambientales */
  --outline-ghost: 1px; /* Elementos de fondo, decorativos */
}

/* Aplicación universal */
.cel-shaded {
  filter: drop-shadow(
      var(--outline-object) var(--outline-object) 0 var(--ink-outline)
    )
    drop-shadow(calc(-1 * var(--outline-object)) 0 0 var(--ink-outline))
    drop-shadow(0 calc(-1 * var(--outline-object)) 0 var(--ink-outline));
}
```

### 3.3 Comportamiento de outlines en estados

| Estado              | Outline color      | Grosor         | Efecto extra          |
| ------------------- | ------------------ | -------------- | --------------------- |
| Default             | `--ink-outline`    | Normal         | —                     |
| Hover / Activado    | `--threat-hot`     | +1px           | Glow magenta exterior |
| Glitch / Error      | `--fx-cyan`        | Irregular      | Desalineación         |
| Daño / Impacto      | `--fx-white-flash` | Temporal flash | Scale brief           |
| Inactivo / Fantasma | `--metal-cold`     | -1px           | Opacity 60%           |

---

## 4. SISTEMA DE VIÑETAS — PANEL LAYOUT

### 4.1 Filosofía de panel

```
La interfaz es un cómic.
Cada sección de la UI es un panel.
La transición entre secciones es un corte de viñeta.
El tiempo se controla con el panel, no con el scroll suave.
```

### 4.2 Tipos de panel

```css
/* ─── PANEL ESTÁNDAR — 4:3 apaisado ─── */
.panel-standard {
  border: var(--outline-panel) solid var(--ink-outline);
  background: var(--ink-panel);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  position: relative;
}

/* ─── PANEL DIAGONAL — entrada dinámica ─── */
.panel-slash {
  clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%);
  border: var(--outline-panel) solid var(--ink-outline);
}

/* ─── PANEL EXPLOSION — impacto central ─── */
.panel-burst {
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
}

/* ─── PANEL PAPER — expediente ─── */
.panel-paper {
  background: var(--paper-aged);
  border: 2px solid var(--paper-burn);
  box-shadow:
    4px 4px 0px var(--ink-outline),
    inset 0 0 30px rgba(10, 8, 6, 0.15);
  /* Textura grain vía pseudo-element */
}

/* ─── PANEL GLITCH — sistema en fallo ─── */
.panel-glitch {
  position: relative;
  overflow: hidden;
  /* Canales RGB desalineados */
  filter: url(#glitch-filter);
}
```

### 4.3 Grid de layout para videoclip

```css
/* Layout principal tipo cómic */
.comic-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto;
  gap: 6px; /* El gap ES el canaletto del cómic */
  background: var(--ink-outline); /* El background del grid ES el outline */
  padding: 6px;
}

/* Panel hero (ocupa 8 columnas) */
.panel-hero {
  grid-column: span 8;
  grid-row: span 2;
}
/* Panel lateral alto */
.panel-tall {
  grid-column: span 4;
  grid-row: span 3;
}
/* Panel largo horizontal */
.panel-wide {
  grid-column: span 12;
}
/* Panel pequeño detalle */
.panel-detail {
  grid-column: span 4;
}
/* Panel onomatopeya */
.panel-sfx {
  grid-column: span 3;
  aspect-ratio: 1;
}
```

---

## 5. SISTEMA DE ONOMATOPEYAS VISUALES

### 5.1 Principio narrativo

> Las onomatopeyas NO son decoración tipográfica.  
> Son eventos narrativos. Son el momento en que el sonido se vuelve materia.  
> En Black Sheep: "DING DONG!" y "One! Two! Three! Four!" nacen del mundo.  
> En Anti-villano: nacen del personaje, de la tinta, del engrane que falla.

### 5.2 Catálogo de onomatopeyas por tipo de evento sonoro

```
═══ EVENTOS MUSICALES ═══════════════════════════════════

BAJO FUZZ (golpe grave):
  → "THUNK"   → "KRRNN"   → "CLNK"   → "BZZZT"

HI-HAT MECÁNICO (pulso):
  → "TCHT"    → "TSK"     → "KLIC"   → "TICK"

DROP / CORO (explosión de energía):
  → "BOOM"    → "KRASH"   → "SLAAAAM" → "WHHUMP"

VOZ BARÍTONO (presencia):
  → "GRRR"    → "HMPH"    → "..." (silencio visual)

TINTA EXPANDIÉNDOSE:
  → "SSPLT"   → "BLRP"    → "DRIP"

GLITCH / ERROR:
  → "ERR"     → "BZZZT"   → "///////" → "[NULL]"

ENGRANE/METAL:
  → "CLANK"   → "GRRNND"  → "SKREECH"

PAUSA / VACÍO:
  → "..."     → "—"        → "[SILENCIO]"  → "◾"

═══════════════════════════════════════════════════════
```

### 5.3 Estilos CSS por categoría

```css
/* ─── IMPACTO — el golpe que sacude el frame ─── */
.sfx-impact {
  font-family: "Bangers", cursive;
  font-size: var(--type-impact);
  color: var(--fx-yellow);
  -webkit-text-stroke: 4px var(--ink-outline);
  transform: rotate(-5deg) scale(1.1);
  animation: sfx-slam 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  text-shadow:
    4px 4px 0 var(--ink-outline),
    0 0 20px var(--threat-hot),
    0 0 40px var(--threat-hot);
}

/* ─── MECÁNICO — el engrane que trabaja ─── */
.sfx-mechanical {
  font-family: "Share Tech Mono", monospace;
  font-size: var(--type-title);
  color: var(--metal-chrome);
  -webkit-text-stroke: 2px var(--ink-outline);
  letter-spacing: 0.2em;
  animation: sfx-type 0.08s steps(1) both;
}

/* ─── TINTA — materia líquida ─── */
.sfx-ink {
  font-family: "Permanent Marker", cursive;
  font-size: var(--type-title);
  color: var(--ink-drip);
  -webkit-text-stroke: 1px var(--ink-panel);
  transform: rotate(3deg);
  filter: blur(0.5px);
  animation: sfx-drip 0.3s ease-out both;
}

/* ─── ERROR — el sistema que falla ─── */
.sfx-error {
  font-family: "Share Tech Mono", monospace;
  font-size: var(--type-title);
  color: var(--fx-cyan);
  -webkit-text-stroke: 1px var(--fx-red-error);
  animation: sfx-glitch 0.2s steps(3) infinite;
  mix-blend-mode: screen;
}

/* ─── SILENCIO — el vacío que pesa ─── */
.sfx-silence {
  font-family: "Special Elite", cursive;
  font-size: var(--type-body);
  color: var(--paper-burn);
  letter-spacing: 0.5em;
  opacity: 0.6;
  animation: sfx-fade-in 0.5s ease-out both;
}
```

### 5.4 Posicionamiento de onomatopeyas

```
REGLA: Las onomatopeyas siempre se posicionan cerca del origen del sonido.

  Si el bajo golpea → onomatopeya cerca del suelo del panel
  Si la voz habla   → cerca del rostro / boca
  Si la tinta cae   → desde arriba, con path de caída
  Si hay glitch     → en esquinas, como si el sistema se rompe por los bordes

REGLA: Siempre rotadas entre -12° y +12°
REGLA: Nunca perfectamente alineadas con el grid
REGLA: Tamaño relativo al impacto (más ruido = más grande)
```

---

## 6. EFECTOS VISUALES Y ANIMACIONES

### 6.1 Biblioteca de animaciones

```css
/* ══════════════════════════════════════════════
   A. SLAM — Entrada de impacto (golpe de bajo)
   ══════════════════════════════════════════════ */
@keyframes sfx-slam {
  0% {
    transform: scale(2.5) rotate(-8deg);
    opacity: 0;
  }
  60% {
    transform: scale(0.95) rotate(-5deg);
    opacity: 1;
  }
  80% {
    transform: scale(1.05) rotate(-5deg);
  }
  100% {
    transform: scale(1) rotate(-5deg);
    opacity: 1;
  }
}

/* ══════════════════════════════════════════════
   B. GLITCH — Canal RGB desalineado
   ══════════════════════════════════════════════ */
@keyframes sfx-glitch {
  0% {
    clip-path: inset(40% 0 61% 0);
    transform: translate(-4px, 0);
  }
  20% {
    clip-path: inset(92% 0 1% 0);
    transform: translate(4px, 0);
  }
  40% {
    clip-path: inset(43% 0 1% 0);
    transform: translate(-4px, 0);
    color: var(--fx-red-error);
  }
  60% {
    clip-path: inset(25% 0 58% 0);
    transform: translate(4px, 0);
    color: var(--fx-cyan);
  }
  80% {
    clip-path: inset(54% 0 7% 0);
    transform: translate(-4px, 0);
  }
  100% {
    clip-path: inset(58% 0 43% 0);
    transform: translate(0, 0);
  }
}

@keyframes glitch-rgb-r {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(3px, -2px);
  }
  50% {
    transform: translate(-2px, 3px);
  }
  75% {
    transform: translate(2px, 1px);
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes glitch-rgb-b {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-3px, 2px);
  }
  50% {
    transform: translate(2px, -3px);
  }
  75% {
    transform: translate(-2px, -1px);
  }
  100% {
    transform: translate(0, 0);
  }
}

/* ══════════════════════════════════════════════
   C. INK SPREAD — Tinta que se expande
   ══════════════════════════════════════════════ */
@keyframes ink-expand {
  0% {
    clip-path: circle(0% at 50% 50%);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    clip-path: circle(150% at 50% 50%);
    opacity: 1;
  }
}

@keyframes ink-drip {
  0% {
    transform: scaleY(0);
    transform-origin: top;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: scaleY(1);
    transform-origin: top;
    opacity: 1;
  }
}

/* ══════════════════════════════════════════════
   D. PANEL WIPE — Transición de viñeta
   ══════════════════════════════════════════════ */
@keyframes panel-wipe-right {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  100% {
    clip-path: inset(0 0% 0 0);
  }
}

@keyframes panel-wipe-diagonal {
  0% {
    clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}

/* ══════════════════════════════════════════════
   E. HALFTONE PULSE — Dots estilo Borderlands
   ══════════════════════════════════════════════ */
@keyframes halftone-pulse {
  0%,
  100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.35;
  }
}

/* ══════════════════════════════════════════════
   F. OUTLINE FLICKER — Cel-shading que tiembla
   ══════════════════════════════════════════════ */
@keyframes outline-flicker {
  0%,
  100% {
    filter: drop-shadow(3px 3px 0 var(--ink-outline));
  }
  33% {
    filter: drop-shadow(4px 3px 0 var(--threat-hot));
  }
  66% {
    filter: drop-shadow(3px 4px 0 var(--ink-outline));
  }
}

/* ══════════════════════════════════════════════
   G. MECHANICAL TICK — Pulso de reloj industrial
   ══════════════════════════════════════════════ */
@keyframes mechanical-tick {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(6deg);
  }
  20% {
    transform: rotate(0deg);
  }
  /* Pausa */
  80% {
    transform: rotate(0deg);
  }
  90% {
    transform: rotate(6deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

/* ══════════════════════════════════════════════
   H. CHARACTER REVEAL — Aparición del personaje
   ══════════════════════════════════════════════ */
@keyframes char-reveal {
  0% {
    opacity: 0;
    filter: brightness(4) contrast(0) blur(2px);
    transform: scaleX(0.95);
  }
  20% {
    opacity: 1;
    filter: brightness(2) contrast(0.5);
  }
  60% {
    filter: brightness(1.2) contrast(1);
    transform: scaleX(1);
  }
  100% {
    filter: brightness(1) contrast(1);
  }
}

/* ══════════════════════════════════════════════
   I. SPEED LINES — Líneas de velocidad cómic
   ══════════════════════════════════════════════ */
@keyframes speed-lines {
  0% {
    transform: scaleX(0);
    opacity: 1;
  }
  70% {
    transform: scaleX(1);
    opacity: 0.8;
  }
  100% {
    transform: scaleX(1.2);
    opacity: 0;
  }
}

/* ══════════════════════════════════════════════
   J. TYPE WRITER — Máquina golpeada de Special Elite
   ══════════════════════════════════════════════ */
@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes cursor-blink {
  0%,
  100% {
    border-right-color: var(--threat-hot);
  }
  50% {
    border-right-color: transparent;
  }
}
```

### 6.2 Efectos de fondo (atmosféricos)

```css
/* ─── HALFTONE DOTS — Borderlands signature ─── */
.bg-halftone {
  background-image: radial-gradient(
    circle,
    var(--ink-outline) 1px,
    transparent 1px
  );
  background-size: 8px 8px;
  opacity: 0.15;
  animation: halftone-pulse 4s ease-in-out infinite;
}

/* ─── PAPER GRAIN — Textura de pergamino ─── */
.bg-paper-grain {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

/* ─── SPEED LINES radiales ─── */
.bg-speed-radial {
  background: repeating-conic-gradient(
    from 0deg at 50% 50%,
    transparent 0deg,
    var(--ink-panel) 0.5deg,
    transparent 1deg
  );
  opacity: 0.3;
}

/* ─── VIGNETTE INDUSTRIAL ─── */
.bg-vignette {
  background: radial-gradient(
    ellipse at center,
    transparent 40%,
    rgba(10, 8, 6, 0.7) 100%
  );
}

/* ─── INK BORDER — bordes que sangran tinta ─── */
.ink-border {
  box-shadow:
    0 0 0 6px var(--ink-outline),
    inset 0 0 20px rgba(10, 8, 6, 0.4),
    0 0 30px rgba(232, 0, 106, 0.15);
}
```

---

## 7. EL SISTEMA DE TINTA VIVA

### 7.1 Concepto

> La tinta no es un efecto decorativo.  
> Es el poder del anti-villano manifestado en materia.  
> Cuando la música golpea → la tinta reacciona.  
> Cuando el personaje canta → la tinta escribe o borra el guion.

### 7.2 Comportamientos de la tinta

```
ESTADO DORMIDO:
  → Mancha estática, ligeramente pulsando
  → Bordes borrosos, como si respirara
  → Color: --ink-drip

ESTADO ACTIVO (beat musical):
  → Se expande desde el centro
  → Bordes nítidos por fracción de segundo
  → Flash de --ink-outline y vuelve a --ink-drip

ESTADO ESCRITURA:
  → Aparecen caracteres tipo máquina de escribir
  → La tinta "dibuja" los versos en el espacio
  → Color: --ink-absolute con leve glow --threat-muted

ESTADO EXPLOSIÓN (drop/coro):
  → ink-expand animation
  → Cubre el panel completamente
  → Luego se retrae dejando una forma/silueta

ESTADO ERROR:
  → La tinta se fragmenta
  → Glitch de canales
  → Aparece --fx-cyan entre las grietas
```

### 7.3 SVG Filters para tinta

```html
<svg style="display:none">
  <defs>
    <!-- Filtro de tinta líquida -->
    <filter id="ink-liquid">
      <feTurbulence
        type="turbulence"
        baseFrequency="0.02 0.04"
        numOctaves="3"
        seed="2"
        result="noise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale="8"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>

    <!-- Filtro de glitch industrial -->
    <filter id="glitch-industrial">
      <feColorMatrix type="saturate" values="2" />
      <feComponentTransfer>
        <feFuncR type="discrete" tableValues="0 0 1 1" />
        <feFuncG type="discrete" tableValues="0 1 0 1" />
        <feFuncB type="discrete" tableValues="1 0 0 1" />
      </feComponentTransfer>
    </filter>

    <!-- Filtro cel-shading (posterize) -->
    <filter id="cel-shade">
      <feComponentTransfer>
        <feFuncR type="discrete" tableValues="0 0.25 0.5 0.75 1" />
        <feFuncG type="discrete" tableValues="0 0.25 0.5 0.75 1" />
        <feFuncB type="discrete" tableValues="0 0.25 0.5 0.75 1" />
      </feComponentTransfer>
    </filter>
  </defs>
</svg>
```

---

## 8. COMPONENTES DE INTERFAZ

### 8.1 Character Card — El expediente del personaje

```css
.character-card {
  /* Frame tipo expediente judicial */
  background: var(--paper-aged);
  border: 3px solid var(--ink-outline);
  box-shadow:
    6px 6px 0px var(--ink-outline),
    inset 0 0 40px rgba(10, 8, 6, 0.1);

  /* Esquinas tipo clip de oficina */
  position: relative;
  padding: 24px;

  /* Grain de papel */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml...") repeat;
    opacity: 0.06;
    mix-blend-mode: multiply;
  }

  /* Sello de clasificación */
  &::after {
    content: "CLASIFICADO";
    font-family: "Bangers", cursive;
    font-size: 14px;
    color: var(--fx-red-error);
    border: 2px solid var(--fx-red-error);
    padding: 2px 8px;
    transform: rotate(-15deg);
    position: absolute;
    top: 16px;
    right: 16px;
    opacity: 0.8;
    letter-spacing: 0.15em;
  }
}
```

### 8.2 HUD Stats Bar — La ficha del personaje

```css
/* Inspired en el HUD de Borderlands pero industrial noir */
.hud-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Share Tech Mono", monospace;
  font-size: var(--type-hud);
  color: var(--metal-chrome);

  &__label {
    color: var(--threat-hot);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  &__track {
    height: 8px;
    background: var(--ink-panel);
    border: 1px solid var(--ink-outline);
    flex: 1;
    position: relative;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--progress, 70%);
      background: linear-gradient(90deg, var(--threat-deep), var(--threat-hot));
      box-shadow: 0 0 8px var(--threat-glow);
      transition: width 0.3s steps(10); /* Steps para sensación de contador */
    }
  }

  &__value {
    color: var(--paper-raw);
    min-width: 4ch;
    text-align: right;
  }
}
```

### 8.3 Botones — El guion que puede romperse

```css
/* Botón primario — Industrial Cel-Shaded */
.btn-antihero {
  font-family: "Bangers", cursive;
  font-size: 24px;
  letter-spacing: 0.08em;
  color: var(--paper-raw);
  background: var(--threat-deep);
  border: 3px solid var(--ink-outline);
  padding: 12px 32px;

  /* Sombra sólida tipo cómic */
  box-shadow: 4px 4px 0px var(--ink-outline);

  /* Sin border-radius. El anti-villano no tiene curvas amigables. */
  border-radius: 0;
  cursor: pointer;
  transition:
    transform 0.05s,
    box-shadow 0.05s;
  text-transform: uppercase;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px var(--ink-outline);
    color: var(--threat-glow);
  }

  &:active {
    transform: translate(4px, 4px);
    box-shadow: 0px 0px 0px var(--ink-outline);
  }
}

/* Botón secundario — Expediente paper */
.btn-document {
  font-family: "Special Elite", cursive;
  color: var(--ink-absolute);
  background: var(--paper-aged);
  border: 2px solid var(--ink-outline);
  box-shadow: 3px 3px 0 var(--paper-burn);

  &:hover {
    background: var(--paper-raw);
  }
}
```

### 8.4 Título de escena — La portada de la viñeta

```css
.scene-title {
  font-family: "Bangers", cursive;
  font-size: var(--type-hero);
  color: var(--paper-raw);
  -webkit-text-stroke: clamp(3px, 0.5vw, 5px) var(--ink-outline);

  text-shadow:
    5px 5px 0px var(--ink-outline),
    8px 8px 0px var(--threat-deep),
    0px 0px 30px rgba(232, 0, 106, 0.3);

  line-height: 0.9;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  /* El título se slam-revela */
  animation: sfx-slam 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-delay: 0.1s;
}
```

---

## 9. ESTRUCTURA VISUAL DEL VIDEOCLIP — ESCENA POR ESCENA

### 9.1 Mapa de animaciones por sección musical

```
INTRO (0:00 — 0:14)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layout:     Un panel negro total. Centro vacío.
Efecto:     Una gota de tinta cae. ink-drip animation.
Onomatopeya: "..." en blanco, muy pequeño, esquina inferior.
Texto:      Ninguno. El silencio tiene peso visual.
Transición: Panel-wipe-diagonal al verso 1.
Color:      SOLO --ink-deep y --ink-drip.

VERSO 1 (0:14 — 0:38)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layout:     Panel grande izquierda (personaje) + 3 paneles pequeños derecha.
Efecto:     char-reveal del personaje. Sombra duplicada con retraso.
Onomatopeya: "TICK" + "TCHT" en esquinas (pulso mecánico).
Texto:      Anotaciones en Permanent Marker: "¿HÉROE?" tachado.
Color:      --ink-panel, --paper-raw, --metal-chrome.
Luces:      Cenital. El personaje iluminado, fondo en sombra.

VERSO 2 (0:38 — 1:02)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layout:     Panel slash diagonal. Tensión creciente.
Efecto:     outline-flicker. Empieza a aparecer la tinta en bordes.
Onomatopeya: "KRRNN" (bajo fuzz dominando).
Texto:      Palabras del "guion del destino" aparecen en pared → se tachan.
Color:      Empieza a entrar --threat-muted en bordes.

BREAK / PRE-CORO (1:02 — 1:16)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layout:     5 paneles verticales rápidos. Cortes agresivos.
Efecto:     glitch-rgb-r + glitch-rgb-b. Desalineación de frame.
Onomatopeya: "ERR" + "[NULL]" + "///////"
Texto:      "CLASIFICADO" + "EXPEDIENTE ROTO" + "ERROR 404: GUION"
Color:      Flash de --fx-cyan + --fx-red-error intermitente.
Pausa:      Un frame en negro con "..." antes del DROP.

DROP / CORO (1:16 — 1:44)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layout:     Panel burst (explosion shape). Personaje en centro.
Efecto:     ink-expand desde el pecho del personaje. Cubre todo.
Onomatopeya: "BOOOM" en Bangers enorme, rotado, con glow magenta.
Texto:      Título de la canción: "ANTI-VILLANO" en hero display.
Color:      --threat-hot explota. Fondo se satura y se retrae a negro.
Luces:      Flash blanco total (un frame) → regresa a industrial noir.
Velocidad:  Speed lines radiales durante 0.5s.

VERSO 3 (1:44 — 2:12)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layout:     Un solo panel. Más amplio. Más humano.
Efecto:     SIN efectos de glitch. Tinta quieta. El personaje respira.
Onomatopeya: Solo "..." en el panel. El silencio como peso.
Texto:      Versos en Special Elite typewriter sobre papel diegético.
Color:      Vuelve a --ink-panel + --paper-aged. Más vulnerabilidad.
Luces:      Menos luz. Baja intensidad. La sombra duplicada desaparece.

POST-CORO (2:12 — 2:36)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layout:     Paneles de detalle: manos, tinta, engrane, papel.
Efecto:     ink-drip en cada panel. La metáfora se hace concreta.
Onomatopeya: "DRIP" + "SSPLT" + "GRRNND"
Texto:      Fragmentos del expediente. La historia del personaje.
Color:      --ink-active + --paper-burn. Lo más oscuro y orgánico.

OUTRO (2:36 — 3:16)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Layout:     El escenario se vacía. Paneles desaparecen uno a uno.
Efecto:     panel-wipe-right inverso. Los paneles se borran como tinta seca.
Onomatopeya: El último "TICK" mecánico. Luego silencio visual.
Texto:      Una mancha de tinta. El símbolo del personaje. Nada más.
Color:      Solo --ink-deep. Todo regresa al origen.
Final:      Fade a negro. La máquina se apaga.
```

---

## 10. REGLAS DE DISEÑO — MANIFESTO

```
╔═══════════════════════════════════════════════════════════╗
║           REGLAS DEL SISTEMA ANTI-VILLANO                 ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  1. EL OUTLINE ES OBLIGATORIO                             ║
║     Todo lo que importa tiene borde negro. Sin excepción. ║
║                                                           ║
║  2. LAS ONOMATOPEYAS NACEN DEL MUNDO                      ║
║     Nunca flotan sin origen. Siempre tienen fuente.       ║
║                                                           ║
║  3. LA TINTA ES EL PERSONAJE                              ║
║     No la decores. Déjala actuar.                         ║
║                                                           ║
║  4. EL PANEL ES UNA VIÑETA                                ║
║     Cada frame cuenta algo. Sin frames vacíos de sentido. ║
║                                                           ║
║  5. EL SILENCIO TIENE FORMA VISUAL                        ║
║     "..." y negro son elementos de diseño activos.        ║
║                                                           ║
║  6. LOS EFECTOS RESPONDEN AL AUDIO                        ║
║     Bajo = tierra/tinta. Hi-hat = tick/corte.             ║
║     Voz = presencia/frame estable.                        ║
║                                                           ║
║  7. MENOS EFECTOS, MÁS INTENCIÓN                          ║
║     Un glitch poderoso > diez glitches decorativos.       ║
║                                                           ║
║  8. EL PERSONAJE ES MÁS GRANDE QUE EL MUNDO              ║
║     La cámara/frame lo confirma. Siempre.                 ║
║                                                           ║
║  9. EL SISTEMA INTENTA CLASIFICARLO. FALLA.               ║
║     Los errores visuales no son bugs. Son narrativa.      ║
║                                                           ║
║  10. LA CANCIÓN REESCRIBE LA REALIDAD                     ║
║      Cada sección musical cambia el estado visual.        ║
║      La interfaz no es estática. Es viva.                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 11. CHECKLIST DE IMPLEMENTACIÓN

### Fase 1 — Fundación

- [ ] Importar las 5 familias tipográficas
- [ ] Definir las variables CSS completas del sistema de color
- [ ] Implementar los outlines cel-shading base
- [ ] Crear el grid de viñetas (comic-grid)
- [ ] Configurar los SVG filters (ink-liquid, glitch, cel-shade)

### Fase 2 — Componentes

- [ ] Character Card (expediente)
- [ ] HUD Stats Bar
- [ ] Botones anti-héroe
- [ ] Sistema de onomatopeyas (5 estilos)
- [ ] Scene Title
- [ ] Panel shapes (standard, slash, burst, paper, glitch)

### Fase 3 — Animaciones

- [ ] sfx-slam
- [ ] sfx-glitch + glitch-rgb
- [ ] ink-expand + ink-drip
- [ ] panel-wipe (right + diagonal)
- [ ] halftone-pulse
- [ ] outline-flicker
- [ ] mechanical-tick
- [ ] char-reveal
- [ ] speed-lines
- [ ] typewriter

### Fase 4 — Sincronización con audio

- [ ] Web Audio API para análisis de beat
- [ ] Trigger de onomatopeyas por frecuencia de bajo
- [ ] Sincronización de ink-expand con drops
- [ ] Cambio de paleta por sección temporal

### Fase 5 — Identidad IP

- [ ] Símbolo del anti-villano (mancha de tinta como logo)
- [ ] Color signature único que no exista en ninguna referencia directa
- [ ] Leitmotiv visual reconocible (el glitch-error como firma)

---

_ANTI-VILLANO DESIGN SYSTEM v1.0 — Unova Games Studio / Danny Aguilar_  
_Inspiración: Borderlands 3 · Scott Pilgrim · Industrial Noir · Tinta Viva_  
_Estado: ACTIVO — Lista para implementación_
