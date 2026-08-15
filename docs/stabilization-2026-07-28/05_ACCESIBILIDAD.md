# Accesibilidad

## Aplicado

- Wrapper común de overlays con `role="dialog"`, `aria-modal="true"` y nombre accesible.
- Foco inicial en el primer botón disponible y retorno al activador cuando es enfocables.
- Escape cierra los overlays gestionados por `activeInterface`.
- Fondo marcado `inert` y `aria-hidden` mientras un overlay está abierto; Settings se oculta durante el modal.
- Notch móvil: controles táctiles principales de 44×44 px.
- `prefers-reduced-motion: reduce`: minimiza animaciones y transiciones a solicitud del usuario.
- Iframe CodePen sin permisos explícitos de dispositivo o pago.

## Límites

No se ejecutaron lector de pantalla, recorrido completo por teclado, auditoría de contraste, WCAG formal ni validación visual post-cambio. La trampa de foco no se implementó porque requeriría una primitiva más amplia y pruebas dedicadas; es P1 pendiente.
