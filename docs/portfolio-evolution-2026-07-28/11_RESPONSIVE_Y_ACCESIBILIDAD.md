# Responsive y accesibilidad

## Responsive

La matriz final de Intro + Recruiter cubrió 10 viewports entre 360×800 y 3440×1440. Resultado: controles presentes, overlay presente y `scrollWidth - innerWidth = 0` en todos.

En 390×844 se recorrieron Intro, mundo, misión, Stack, caso de estudio, mapa, Contact y Credits. Mission inicia compacto para no tapar el mundo. Stack/Contact usan scroll vertical; Projects combina panel de caso con rail inferior horizontal.

## Accesibilidad confirmada

- botones semánticos en mapas, tabs, proyectos y accesos del mundo;
- `role=dialog`, `aria-modal`, `inert` para el fondo;
- foco inicial después de lazy load;
- trampa de Tab y Shift+Tab;
- Escape inmediato y foco restaurado a Settings;
- `aria-pressed` para nodos/selecciones;
- progreso textual, no dependiente solo del color;
- estados `aria-live` para copia y errores;
- controles táctiles principales de 44 px;
- foco visible global y específico.

## No verificado

- lector de pantalla real;
- zoom 200 % completo;
- dispositivo físico táctil;
- recorrido runtime con reduced motion emulado.
