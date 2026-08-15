# UNIBELANDS 4 — THE CREATIVE VAULT

Una experiencia audiovisual de inicio de sesión inspirada en la estética de videojuegos AAA, creada con Remotion

## 🎮 ¿Qué es esto?

Este proyecto muestra la pantalla de bienvenida interactiva de **Unibelands 4**, un videojuego ficticio. Presenta una secuencia de arranque original que se siente como una pantalla de título de videojuego AAA, con interfaz industrial, diseño de cel shading y estética de comic, pero **con identidad y recursos propios** (sin imitar Borderlands oficialmente).

## 🚀 Características

- ⏱️ **Cronometraje preciso** con determinismo Frame-by-Frame
- 🌐 **Bilingüe** (ES/EN) con interfaz localizable
- 🔊 **Soporte de audio** con controles de volumen y silencio
- 🎨 **Diseño visual único** sin neon, sin glassmorphism, con enfoque en comic/aceite
- 🎮 **Interacción tipo videojuego** con panel de estado y controles
- 📱 **Reordable y reutilizable** como componente de portafolio
- 📱 **Juega dentro del navegador** mediante Remotion Studio

## 📁 Estructura del Proyecto

```text
src/
└── unibelands4/
    ├── Unibelands4Boot.tsx          # Composición determinista
    ├── Unibelands4IntroPlayer.tsx    # Vista previa interactiva
    ├── unibelands4.css               # Estilos CSS (SCSS opcional)
    ├── config.ts                     # Configuración centralizada
    ├── timing.ts                     # Constantes de frames
    ├── copy.ts                       # Textos (ES/EN)
    ├── types.ts                      # Tipos estrictos
    └── utils/
        ├── animation.ts
        └── deterministic.ts
    └── components/
        ├── InkBackground.tsx
        ├── HalftoneLayer.tsx
        ├── ScanlineSystem.tsx
        ├── HazardBands.tsx
        ├── CornerTelemetry.tsx
        ├── UnibelandsLogo.tsx
        ├── CreativeProfile.tsx
        ├── AudioRecommendation.tsx
        ├── StartPrompt.tsx
        ├── ChromaticGlitch.tsx
        ├── InterfaceReticle.tsx
        └── ExitTransition.tsx

scripts/
└── generate-unibelands-sfx.mjs

public/
└── audio/
    ├── unibelands-boot.wav
    ├── unibelands-interface.wav
    └── unibelands-confirm.wav
```

## 🎯 Características Técnicas

### Timing Determinista
- **FPS:** 30
- **Frames:** 270
- **Fases:** Boot → Logo → Perfil → Audio → Listo → Salida

### Modo de Videojuego Original
- Negro de tinta con variaciones sutiles
- Amarillo industrial como color dominante
- Cian solo para estados activos y alertas
- Rojo solo para error o silencio
- Contornos nítidos, no neón
- Textura de impresión/aceite
- Tramas halftone
- Sin blur, sin neon, sin glassmorphism

### Controladores Web Reales
- Teclado: Enter, M, L, Escape
- Mouse: Click en CTA y controles
- Audio: Controles de encendido/apagado
- LocalStorage: Persiste visitas y idioma
- Foco accesible y etiquetado

### Recursos Independientes
- Logotipo, interfaz y secciones en español e inglés
- Sonidos generados localmente (sin clips oficiales)
- Todos los assets son originales, creados para este proyecto

## 🛠️ Construido con

- **Remotion** — renderizado programático y determinista
- **React + TypeScript** — frontend moderno y seguro
- **Tailwind CSS v4** — utilidades de estilo
- **@remotion/* packages** — transit, fonts, transitions, effects, player, etc.

## 🧪 Ejecución local

```bash
# Ejecutar el Remotion Studio
cd remotion-project
npm run dev

# Abrir el navegador en http://localhost:3000
# Ver la composición "Unibelands4Boot"
```

## 📊 Composiciones

### Unibelands4Boot
- **ID:** `Unibelands4Boot`
- **Props:** `language`, `muted`, `reducedMotion`, `visitorName`
- **Frames:** 270 (30 fps)
- **Default:** Español, audio encendido, sin modo de movimiento reducido

### Opciones de Props
- `language`: `es` | `en`
- `muted`: `true` | `false`
- `reducedMotion`: `true` | `false`
- `visitorName`: `string | undefined`

## 🎨 Personalización

### Modos de audio
- En `muted=true`, el audio se silencia, el icono cambia a rojo y muestra "AUDIO OFF"
- Al activar audio: color cian o amarillo, "AUDIO ON"

### Nombres de visitantes
- Pasar `visitorName` para personalizar la pantalla de bienvenida
- Se muestra como "DANIEL UNIBE" si no se proporciona

### Estados de movimiento reducido
- Reduced motion minimiza glitch, vibración y animaciones rápidas
- Mantiene la funcionalidad y la línea temporal visual

## 🎮 Controles de interacción

| Tecla | Acción |
|-------|--------|
| Enter / Space | Iniciar/suspender experiencia |
| M | Silenciar/Activar audio |
| L | Cambiar idioma (ES/EN) |
| Escape | Omitir introducción (salida rápida) |

## 🎯 Verificación rápida

```bash
# Instalar dependencias
npm install

# Validar tipos y lint
npm run lint

# Construir para producción
npm run build

# Verificar versiones de Remotion
npx remotion versions --log=verbose
```

## 🌟 Por qué esto es notable

- **Original:** No se inspira en imágenes oficiales o cachés de recursos
- **Funciona fuera de línea:** Todos los assets están embebidos, funciona sin internet
- **Determinista:** Reproducible en cualquier navegador, exacto frame a frame
- **Reutilizable:** Se monta fácilmente en otros portafolios web
- **Juega ahora:** No es necesario exportar a MP4, experimenta directamente

## 📈 Mantenimiento

El sistema está diseñado para ser modular y fácil de mantener:

1. **Configuración:** Centraliza todos los timing y estilos en `config.ts`
2. **Textos:** Los copiados están separados por idioma
3. **Componentes:** Reutilizables y con props estrictos
4. **Pruebas:** Lint, TypeScript y bundle checks automáticos

## 🚨 ¡Importante!

- **Sin imágenes externas:** Todos los SVG/texturas creados localmente
- **Sin clips oficiales:** Música y sonidos originales únicamente
- **Sin dependencias de CDN:** Solo Tailwind CSS embebido
- **Sin estado global:** Solo React + props deterministas

## 📄 Licencia

UNLICENSED - Proyecto personal para demostración

## 🔗 Enlaces útiles

- **Documentación de Remotion:** https://remotion.dev/docs
- **API de Studio:** https://remotion.dev/docs/studio
- **Documentación de Player:** https://remotion.dev/docs/player

---

*Hecho con ❤️ y energía de videojuego por Daniel Unibe*.
