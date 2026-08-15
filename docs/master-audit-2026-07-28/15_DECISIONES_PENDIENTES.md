# 15 — Decisiones pendientes

| Decisión | Por qué cambia desarrollo | Opciones reales | Riesgo de posponer | Recomendación provisional |
| --- | --- | --- | --- | --- |
| Hosting root o subpath | define todas las URLs públicas | dominio raíz; Vercel/Netlify root; GitHub subpath | alto | root mientras no se adapte manifest |
| Soporte móvil | el Norte es compositivo y notch se recorta | experiencia completa; versión simplificada; desktop-only explícito | alto | mantener acceso funcional móvil y aprobar composición simplificada |
| Navegadores mínimos | WebGL/audio/blur varían | evergreen Chromium; +Firefox; +Safari/iOS | medio | Chrome/Edge/Firefox + Safari si habrá móvil iOS |
| Contenido final | stats/proyectos/contacto no están validados | publicar actual; curar subset; marcar WIP | alto | curar subset con links verificables |
| Función Loot Map | hoy es decorativo | hub de links; selector informativo; eliminar CTA | medio | hub accesible si reemplaza navegación social |
| Política de música | Credits contradice no-autoplay | siempre manual; opt-in global; autoplay tras consentimiento | medio | siempre manual |
| Objetivo de accesibilidad | determina alcance/aceptación | buenas prácticas; WCAG 2.2 AA | alto | WCAG 2.2 AA como objetivo, sin afirmar cumplimiento hasta auditar |
| Licencias | puede bloquear publicación | assets propios; licenciados; reemplazar | crítico | inventario antes de deploy |
| Analítica/privacidad | no existe actualmente | ninguna; privacy-first; proveedor | bajo ahora | no agregar hasta requisito explícito |
| SEO/PWA | define metadata/caché | SPA básica; SEO completo; PWA | medio | SPA pública con metadata; no PWA hasta necesidad |
| Identidad visual aprobada | evita rediseño accidental | preservar HUD; ajustes; nueva dirección | alto | preservar contrato DESIGN.md |
| Dependencias sin uso | React Query y archivos muertos | conservar; retirar tras prueba | bajo | confirmar y retirar en tarea separada |
| Propiedad del email/dominio | contacto puede fallar | validar; cambiar; ocultar | alto | no publicar hasta verificar |

No se incluyen preguntas que el código ya resuelve, como stack, entrypoint, puerto actual o estructura de pantallas.

