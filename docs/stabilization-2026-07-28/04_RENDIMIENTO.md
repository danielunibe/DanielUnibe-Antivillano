# Rendimiento

## Medición

| Métrica | Antes | Después |
| --- | ---: | ---: |
| `public` | 143.39 MiB | 143.39 MiB |
| `dist` | 145.34 MiB | 145.35 MiB |
| chunk Three | 557.27 kB minificado / 146.67 kB gzip | Igual advertencia de build |

## Media dominante

- `public/assets/portfolio/imports/featured-recording.mp4`: 59.76 MiB.
- Las pistas de música mayores miden 6.49, 6.23, 5.79, 4.84 y 4.43 MiB.

## Decisión

No se recomprimió ni eliminó media: no hay comparación visual, codec/bitrate objetivo ni permiso para sustituir originales. Tampoco se añadió lazy loading: los chunks manuales actuales no prueban beneficio de carga inicial por sí solos. Estas acciones siguen pendientes de una fase medida.
