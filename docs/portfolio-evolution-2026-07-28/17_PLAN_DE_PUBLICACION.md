# Plan de publicación

Estado actual: **CANDIDATO A QA**.

## Puerta editorial

- CV final aprobado.
- correo probado de extremo a extremo;
- URLs sociales confirmadas;
- roles/resultados de destacados documentados;
- derechos de música, imágenes y marcas revisados.

## Puerta técnica

- `pnpm run verify` en verde desde árbol final;
- smoke de `dist` en servidor estático;
- recorrido completo y rápido en staging;
- reduced motion emulado;
- lector de pantalla y zoom 200 %;
- Android/iOS físico y desktop;
- red externa/CSP para embeds;
- medición Lighthouse/Core Web Vitals;
- revisar warning de Three.js.

## Publicación

1. Congelar contenido verificado.
2. Generar build trazable.
3. Desplegar a staging.
4. Ejecutar QA editorial, funcional, accesible y de rendimiento.
5. Corregir P1/P2 con evidencia.
6. Aprobar rollback y dominio.
7. Promover a producción.

No se desplegó ni se configuró hosting en esta ejecución.
