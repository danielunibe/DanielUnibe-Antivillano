# Validaciones

## Línea base

| Comprobación | Resultado |
| --- | --- |
| HEAD | `61fdf5c90f82afd9148061471830633b816cab8e` |
| Node / pnpm | `v24.18.0` / `10.14.0` |
| `pnpm exec tsc --noEmit` | Exit 0 antes y después de cada bloque |
| `pnpm -s build` | Exit 0 antes y después de cada bloque |
| Servidor Vite | HTTP 200 antes de las correcciones |
| `git diff --check` | Sin errores de whitespace; Git informa conversión LF→CRLF al tocar los archivos en Windows |

## Runtime

- Inicio de la aplicación y carga de playlist: observado.
- Asset Weapons 024: HTTP local y `naturalWidth=1920`: observado.
- Consola final, navegación completa, overlays, iframe, resize y viewports: **NO VERIFICADO** tras el bloqueo de política del navegador local.

## Viewports pendientes

No se deben presentar como repetidos tras el cambio: 3440×1440, 2560×1440, 1920×1080, 1600×900, 1366×768, 1280×720, 1024×768, 768×1024, 390×844 y 360×800.
