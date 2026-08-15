# Rendimiento

## Antes

- JS precargado observado: 974,154 B minificado / 277,188 B gzip.
- Entry principal: 68.43 kB minificado.
- Precarga: 29 `Image` para 25 rutas, incluyendo 4 MP3 y una imagen inexistente; imágenes existentes ~19.9 MB.

## Después

- Entry de arranque: `index-BNOLMTrM.js`, 9,929 B (nombre hash del build documentado).
- Shell principal diferido: 60,266 B; Stack 78,549 B; Projects 18,190 B; Contact 12,888 B; Loot 5,724 B; ThreeSky 4,212 B.
- Three.js sigue separado: 557,274 B / 146.67 kB gzip, con warning >500 kB.
- Intro no monta mundo/WebGL/listeners y la precarga excluye audio/features.
- `dist`: 162 archivos, 152,415,892 B. La huella sigue dominada por multimedia, no por JS inicial.

## Límite

No se ejecutó Lighthouse ni profiling de FPS/GPU/memoria. La mejora de carga es confirmada por grafo/build; la mejora perceptual cuantitativa permanece **NO VERIFICADA**.

