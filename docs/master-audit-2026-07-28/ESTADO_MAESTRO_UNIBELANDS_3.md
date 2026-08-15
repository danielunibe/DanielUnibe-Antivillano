# Estado maestro de UnibeLands 3

Fecha de corte: 2026-07-28  
Tipo de trabajo: auditoría técnica, funcional, visual, UX, accesibilidad, rendimiento y preparación operativa  
Estado de la auditoría: **PARCIAL, con evidencia reproducible**  
Alcance de cambios: documentación y capturas; no se modificó el producto

Este documento reúne el contexto confirmado necesario para continuar el proyecto en otra conversación sin depender de explicaciones previas. Los hechos, inferencias y límites de verificación están diferenciados de forma explícita.

## 1. Identidad del proyecto

- Nombre observado: **UnibeLands 3**.
- Tipo: portafolio/CV web interactivo con estética de videojuego y mundo horizontal explorable.
- Implementación: SPA de React y TypeScript construida con Vite.
- Ejes de navegación: mundo principal, perfil, contacto, créditos, proyectos, stack, loot map y reproductor musical.
- Idioma dominante de interfaz: inglés; los contenidos de proyectos mezclan inglés y español.
- Plataforma verificada: navegador Chromium local en Windows 11.

## 2. Propósito del producto

### Confirmado por código y ejecución

- Presentar la identidad profesional de Daniel como diseñador/desarrollador.
- Mostrar 34 proyectos organizados en cuatro categorías.
- Exponer stack de software y una representación lúdica de habilidades.
- Ofrecer contacto mediante cinco destinos externos y copia de correo.
- Construir una experiencia audiovisual con cielo WebGL, música, parallax, overlays y modelos/escenas 3D.

### Inferido

- Servir como pieza de marca personal y diferenciación profesional, más cercana a un juego que a un CV convencional.
- Priorizar impacto visual y exploración por encima de indexación, lectura lineal o accesibilidad estricta.

### No determinado

- Público primario definitivo, objetivo de conversión medible y criterios de lanzamiento.
- Hosting, dominio, analítica, política de privacidad, licencias de assets y estrategia SEO final.

## 3. Ubicación auditada

```text
C:\Desarrollos DEV daniel\Desarrollo CV borderlands3
└── UnibeLands-3
    └── unibelands3
        └── unibelands-3   ← raíz real de la aplicación
```

La raíz superior contiene otros materiales y no debe confundirse con la raíz del paquete. Todas las órdenes técnicas se ejecutaron en `UnibeLands-3\unibelands3\unibelands-3`.

## 4. Estado Git auditado

- Rama: `main`.
- Commit: `61fdf5c90f82afd9148061471830633b816cab8e`.
- Historial visible: un único commit inicial, fechado 2026-07-14.
- Remoto: GitHub configurado como `origin`.
- Tags: ninguno.
- Ramas locales visibles: solo `main`.
- Árbol previo no limpio: existían cambios no rastreados antes de esta auditoría, incluidos `package-lock.json`, `docs/master-audit/` y elementos fuera de la raíz real de la app.
- Esta auditoría preservó esos elementos y añadió únicamente `docs/master-audit-2026-07-28/`.
- No se hizo `add`, commit, push, reset, stash, restore ni cambio de rama.

## 5. Stack y versiones observadas

| Área | Tecnología / versión instalada |
|---|---|
| Runtime local | Node.js 24.18.0 |
| Gestor declarado | pnpm 10.14.0 |
| npm disponible | 11.16.0 |
| UI | React 19.2.8, React DOM 19.2.8 |
| Lenguaje | TypeScript 5.8.3 |
| Build/dev | Vite 6.4.3, `@vitejs/plugin-react` 5.2.0 |
| 3D | Three.js 0.182.0 |
| Audio | Howler 2.2.4 |
| Estilos | Tailwind CSS 3.4.19, PostCSS 8.5.23, Autoprefixer 10.5.4 |
| Datos instalados | TanStack React Query 5.101.4, sin imports runtime localizados |
| Tipografía | paquetes Fontsource 5.3.0 |
| Git | 2.55.0.windows.3 |

El lockfile autoritativo declarado y rastreado es `pnpm-lock.yaml`. El `package-lock.json` no rastreado ya estaba presente y no fue modificado.

## 6. Arquitectura real

```text
index.html
└── src/index.tsx
    └── App
        ├── InteractionProvider
        ├── MusicProvider
        ├── IntroOverlay
        ├── ThreeSky + fallback CSS
        ├── World horizontal con parallax
        │   ├── HorizonWest
        │   ├── HorizonNorth
        │   └── HorizonEast
        ├── FogOverlay / ParticleOverlay
        ├── BottomNav
        ├── MusicNotch
        └── Overlays de pantalla completa
            ├── Projects
            ├── Stack / Weapons
            ├── LootMap
            ├── Contact
            └── Credits
```

- La aplicación no usa router: `App` administra la pantalla activa con estado local.
- `InteractionProvider` coordina la introducción y la habilitación de interacción.
- `MusicProvider` centraliza playlist, reproducción, pista, volumen y estado.
- El mundo combina DOM absoluto, Tailwind, CSS global y múltiples superficies canvas/WebGL.
- Las pantallas se importan estáticamente. Los chunks manuales del build no constituyen lazy loading por ruta.
- `ThreeSky` usa un ticker global, limita DPR a 1.25 y libera listeners/recursos observados al desmontar.
- Los visores 3D y partículas usan ciclos de animación propios con limpieza observada. No se confirmó una fuga, aunque la coexistencia de varios ciclos es un riesgo de coste.

## 7. Mapa de módulos y responsabilidades

| Módulo | Responsabilidad | Estado observado |
|---|---|---|
| `App` | composición global, navegación y overlays | funcional |
| `InteractionContext` | intro y disponibilidad de interacción | funcional |
| `MusicContext` | playlist, Howler, volumen y controles | funcional con riesgo de autoplay |
| `useParallaxScroll` | posición horizontal y parallax | defecto confirmado al redimensionar |
| `ThreeSky` | fondo WebGL | funcional en navegador probado |
| `Flag` / visores 3D | elementos 3D decorativos | funcionales en prueba local |
| `ProjectsScreen` | galería de 34 proyectos | funcional; video e iframe cargaron |
| `StackScreen` | software y weapons | software funcional; asset de weapons roto |
| `LootMapScreen` | mapa gamificado | visual; acciones reales no determinadas |
| `ContactScreen` | enlaces y copia de email | visible; portapapeles extremo a extremo no verificado |
| `CreditsScreen` | créditos y música temática | funcional; inicia reproducción automáticamente |
| `BottomNav` | acceso primario a secciones | funcional, semántica limitada |
| `MusicNotch` | control musical permanente | funcional; targets pequeños y clipping móvil |

## 8. Datos y contenido

- Los proyectos se definen localmente; se contaron **34**.
- Distribución observada: 9 `featured`, 8 `UI_UX`, 8 `3D` y 9 `CODE`.
- La playlist contiene 7 pistas; las 7 rutas de audio y sus 7 portadas existen.
- Contacto expone cinco destinos externos y una acción de copia.
- No se observó backend, API propia, base de datos, autenticación ni persistencia de usuario.
- No se localizaron formularios que envíen datos.
- No se encontró un secreto real en los archivos inspeccionados. La mención `GEMINI_API_KEY` pertenece a documentación histórica/placeholder.
- No existe `.env` o `.env.local` actual en la raíz auditada.

## 9. Errores confirmados

### E-01 — imagen rota en Weapons

- Ruta declarada: `/assets/remote/019_w1a2bcg.png`.
- Uso: todas las tarjetas weapons observadas.
- Evidencia de navegador: el elemento terminó de cargar, pero `naturalWidth=0`.
- Evidencia de filesystem: el archivo no existe en `public`.
- Impacto: contenido visual roto en una sección principal.

### E-02 — sector incorrecto tras resize sin recarga

- `useParallaxScroll` calcula la posición inicial desde `window.innerWidth` una sola vez.
- No registra una corrección de `scrollLeft` al cambiar el ancho.
- La prueba secuencial de viewports mostró que el mundo queda centrado en el sector equivocado tras redimensionar sin recargar.
- Impacto: navegación/orientación incorrecta al rotar, redimensionar o cambiar el espacio de ventana.

### E-03 — clipping de controles musicales en móvil

- A 390×844 se recortó el botón de subir volumen.
- A 360×800 se recortaron ambos controles laterales de volumen.
- Impacto: controles parcialmente inaccesibles en anchos móviles comunes.

### E-04 — reproducción automática desde Credits

- Abrir Credits inició automáticamente la pista `Patio de Chatarra` y el estado pasó a `PLAYING`.
- Impacto: contradice la expectativa de audio iniciado por decisión explícita y puede ser molesto o bloqueado según navegador.

## 10. Riesgos técnicos y de producto

- `public` pesa aproximadamente 143.39 MiB; `dist` construido pesa 145.34 MiB.
- Un video MP4 concentra aproximadamente 59.76 MiB, dura 78.14 s y mide 1584×1070 a 30 fps.
- El chunk Three.js quedó en 557.27 kB minificado (146.67 kB gzip) y generó advertencia de Vite.
- La carga inicial y el consumo gráfico pueden degradarse en hardware móvil o redes lentas.
- El iframe de CodePen solicita capacidades amplias, incluidas cámara, micrófono, geolocalización y payment; deben reducirse al mínimo necesario.
- Los overlays no implementan contrato modal completo: faltan `role="dialog"`, `aria-modal`, foco inicial, trampa/restauración de foco e inertización del fondo.
- Solo Settings respondió a Escape en el comportamiento inspeccionado.
- No se detectó soporte `prefers-reduced-motion`.
- No hay estrategia confirmada de fallback para dispositivos sin WebGL más allá del fondo CSS observado.
- La mezcla de inglés/español y el contenido todavía genérico reducen coherencia editorial.

## 11. Responsive y accesibilidad

Se recargó y ejercitó la aplicación en diez viewports:

`3440×1440`, `2560×1440`, `1920×1080`, `1600×900`, `1366×768`, `1280×720`, `1024×768`, `768×1024`, `390×844` y `360×800`.

Resultados:

- En las diez recargas, el documento coincidió con el viewport y no presentó overflow global medido.
- En ultrawide se conserva la composición, aunque la herramienta de captura limitó cada imagen simple a 1675 px; por ello se añadieron capturas izquierda/derecha.
- En móvil se pierde buena parte del contexto visual del mundo y dominan Contact/Credits.
- Cinco controles del reproductor están por debajo de 44×44 px: tres de 28×28 y dos de 24×28.
- Varios destinos son contenedores o imágenes clicables con semántica insuficiente.
- Los nodos de Loot Map son `div` genéricos sin destino confirmado.
- No se ejecutó una auditoría WCAG formal con lector de pantalla o navegación exhaustiva por teclado.

## 12. Rendimiento y build

Validaciones realizadas:

| Validación | Resultado |
|---|---|
| `pnpm -s build` | OK, exit 0; 8.90 s total, Vite 6.51 s |
| `pnpm exec tsc --noEmit` | OK, exit 0; 5.45 s |
| servidor Vite local | HTTP 200 en `127.0.0.1:5173` |
| consola tras recorrido final | sin warnings ni errores capturados |
| dimensiones/overflow en 10 viewports | sin overflow global medido |

No existen scripts declarados de test, lint, typecheck dedicado o format. El build exitoso no sustituye tests, Lighthouse, matriz de navegadores ni medición en dispositivo físico.

## 13. Deuda técnica priorizada

### P0 — antes de declarar release

1. Restaurar o sustituir `019_w1a2bcg.png` y validar Weapons visualmente.
2. Corregir el resize del mundo sin alterar el sector elegido por el usuario.
3. Evitar clipping del notch musical en 360–390 px.
4. Definir y aplicar una política explícita de autoplay.

### P1 — estabilización

1. Convertir overlays en diálogos accesibles y unificar cierre por Escape.
2. Aumentar targets táctiles a al menos 44×44 px.
3. Añadir reduced motion y revisar teclado/foco/contraste.
4. Comprimir o servir adaptativamente el video y audios pesados.
5. Reducir permisos del iframe de CodePen.
6. Añadir scripts y baseline de test, lint y typecheck.

### P2 — maduración

1. Definir lazy loading real por sección y carga diferida de 3D/media.
2. Revisar componentes aparentemente no usados antes de eliminar nada.
3. Unificar idioma y completar contenido editorial.
4. Documentar licencias y procedencia de assets/audio.
5. Definir SEO, analítica respetuosa, hosting y observabilidad.

## 14. Decisiones pendientes

- ¿Qué viewport/dispositivo es el objetivo primario?
- ¿Credits debe reproducir música automáticamente o solo preparar la pista?
- ¿Loot Map es navegación real, demostración visual o funcionalidad futura?
- ¿La aplicación será bilingüe o tendrá un idioma editorial único?
- ¿Se conservará CodePen embebido y qué permisos requiere realmente?
- ¿Qué assets y audios tienen licencia demostrable para publicación?
- ¿Cuál es el presupuesto máximo de carga inicial y media?
- ¿Qué navegadores, hardware y nivel WCAG forman el criterio de aceptación?
- ¿Cuál será el dominio, hosting, analítica y política de privacidad?

## 15. Roadmap recomendado

### Fase 1 — integridad visual mínima

Resolver únicamente los cuatro defectos P0 y repetir build, TypeScript y las diez capturas. No combinar con rediseño.

### Fase 2 — contrato de interacción

Normalizar overlays, foco, Escape, targets táctiles, autoplay y reduced motion. Validar teclado y lector de pantalla.

### Fase 3 — rendimiento

Medir Lighthouse y Web Vitals en build de producción, optimizar media, diferir pantallas/3D y probar hardware móvil real.

### Fase 4 — contenido y publicación

Cerrar idioma, copy, enlaces, licencias, SEO, hosting, privacidad y analítica. Ejecutar matriz de navegadores y regresión visual.

## 16. Archivos y contratos protegidos

- Preservar el CSS global y las clases `.echo-*` hasta contar con regresión visual reproducible.
- No eliminar `CustomCursor`, `GameImage`, `ModeTab`, `StatRow` o `ThreeIconViewer` solo por parecer no usados; confirmar importación dinámica, intención y cobertura primero.
- No reemplazar la arquitectura de mundo/parallax, providers de interacción/música o Three.js dentro de una corrección puntual.
- No regenerar lockfiles ni mezclar npm/pnpm sin una decisión explícita.
- No modificar, limpiar o incorporar los archivos no rastreados previos a esta auditoría.

## 17. Contrato para agentes futuros

1. Trabajar desde la raíz real de la aplicación.
2. Leer este documento y el anexo específico del área antes de editar.
3. Separar hechos, inferencias y `NO VERIFICADO`.
4. Ejecutar una sola tarea acotada por bloque; no convertir una corrección en auditoría/rediseño global.
5. Preservar el árbol mixto: sin reset, stash, restore, limpieza amplia, commit o push salvo autorización expresa.
6. Antes de editar, registrar `git status --short` y limitar el diff a los archivos necesarios.
7. Después de editar, ejecutar como mínimo build y TypeScript; añadir runtime/capturas cuando el cambio sea visual o interactivo.
8. No declarar hardware físico, navegador o accesibilidad como validados sin evidencia directa.
9. No eliminar componentes/assets por heurística.
10. Actualizar la documentación solo con evidencia nueva y fechar el corte.

## 18. Siguiente tarea única recomendada

**Recuperar o sustituir `/assets/remote/019_w1a2bcg.png` y validar exclusivamente la pantalla Stack → Weapons en 1366×768, 390×844 y 360×800.**

Criterios de cierre:

- el recurso responde y `naturalWidth > 0`;
- ninguna tarjeta muestra imagen rota;
- no aparece error nuevo en consola;
- `pnpm -s build` y `pnpm exec tsc --noEmit` siguen en exit 0;
- se conservan todos los cambios preexistentes y no se toca otro subsistema.

## 19. Evidencia disponible

- [Resumen ejecutivo](./00_RESUMEN_EJECUTIVO.md)
- [Estado técnico](./01_ESTADO_TECNICO.md)
- [Arquitectura real](./02_ARQUITECTURA_REAL.md)
- [Mapa de componentes](./03_MAPA_COMPONENTES.md)
- [Inventario funcional](./04_INVENTARIO_FUNCIONAL.md)
- [Flujos de usuario](./05_FLUJOS_USUARIO.md)
- [Estado visual y UX](./06_ESTADO_VISUAL_UX.md)
- [Datos y contenido](./07_DATOS_Y_CONTENIDO.md)
- [Assets y audio](./08_ASSETS_Y_AUDIO.md)
- [Responsive y accesibilidad](./09_RESPONSIVE_ACCESIBILIDAD.md)
- [Rendimiento](./10_RENDIMIENTO.md)
- [Errores y riesgos](./11_ERRORES_Y_RIESGOS.md)
- [Deuda técnica](./12_DEUDA_TECNICA.md)
- [Backlog maestro](./13_BACKLOG_MAESTRO.md)
- [Plan de ejecución](./14_PLAN_EJECUCION.md)
- [Decisiones pendientes](./15_DECISIONES_PENDIENTES.md)
- [Contrato para agentes](./16_CONTRATO_AGENTES.md)
- [Evidencia de validaciones](./17_EVIDENCIA_VALIDACIONES.md)

Capturas reproducibles en `evidence/`:

- mundo en diez viewports;
- mosaicos laterales adicionales para 1920, 2560 y 3440 px;
- Projects, Stack/Weapons y Loot Map a 1366×768.

## 20. NO VERIFICADO

Los siguientes puntos no deben presentarse como aprobados:

- despliegue real, dominio, CDN, headers y comportamiento de producción;
- Lighthouse, Core Web Vitals, presupuesto de red o profiling sostenido de GPU/CPU/memoria;
- Safari, Firefox, Edge independiente y matriz de versiones;
- dispositivos físicos, orientación real, touch, teclado móvil o redes lentas;
- lector de pantalla, zoom, alto contraste y conformidad WCAG formal;
- accesibilidad y éxito real de los cinco destinos externos;
- escritura del portapapeles extremo a extremo fuera de la superficie automatizada;
- envíos de formularios, porque no se observaron formularios de envío;
- SEO, metadatos sociales, analítica, consentimiento y privacidad;
- licencias y derechos de todas las imágenes, tipografías, modelos, videos y audios;
- auditoría de vulnerabilidades online y estado actual de advisories de dependencias;
- compatibilidad en equipos sin WebGL o con GPU limitada;
- intención final del contenido, público, conversión y criterio de lanzamiento.

## Conclusión

UnibeLands 3 **compila, tipa y funciona localmente como una experiencia navegable**, con una identidad visual fuerte y un inventario considerable de contenido. No está demostrada su preparación para producción: hay cuatro defectos reproducibles, una carga multimedia elevada y vacíos relevantes de accesibilidad, rendimiento medido, licencias y despliegue. La continuación más segura es quirúrgica: corregir primero el asset roto, aportar evidencia visual y avanzar por bloques sin rediseñar subsistemas adyacentes.
