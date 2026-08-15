# Misión y progreso

## Autoridad

`src/features/experience/ExperienceContext.tsx` es la autoridad de sesión. `model.ts` contiene las operaciones puras y `types.ts` limita modos, sectores y objetivos.

## Misión

`PORTFOLIO TRACE` registra cinco señales:

1. Identidad: visitar Norte.
2. Capacidades: inspeccionar una herramienta o combinación en Stack/Weapons.
3. Proyecto: seleccionar o abrir la información de una quest.
4. Proceso: abrir Créditos.
5. Contacto: abrir la estación de contacto.

No hay contenido bloqueado. El widget puede minimizarse, inicia compacto en móvil y desaparece mientras un modal está abierto para evitar solapamientos.

## Persistencia y reset

- Persistencia elegida: `sessionStorage`, clave `unibelands3.experience.v1`.
- Se guardan modo, objetivos completados, sectores visitados y estado minimizado.
- El parser descarta IDs desconocidos y recupera estado seguro ante JSON inválido.
- Las acciones son idempotentes; una visita o evidencia no suma dos veces.
- Reiniciar borra la sesión y centra el mundo en Norte; el sector visible vuelve a registrarse como contexto actual.

## Pruebas

Cuatro pruebas cubren idempotencia, modo compacto, sanitización/persistencia y colecciones nuevas al reset. El flujo de navegador verificó persistencia tras recarga y reset desde Créditos.
