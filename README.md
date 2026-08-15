# DanielUnibe - Anti-Villano (UNIBELANDS)

Portafolio interactivo tipo videojuego AAA / Borderlands UI, integrando diseño UI/UX, animaciones interactivas, audio ambiental, perfil de reclutador y soporte para sincronización en servidor.

## Desarrollo local

Requiere Node.js 22+ y pnpm 10.

```powershell
pnpm install
pnpm build
pnpm dev
```

La aplicación funciona de forma autónoma sin servicios externos: el perfil público usa datos locales verificados cuando Redis o LinkedIn no están configurados.

## Variables de servidor

Duplica `.env.example` como `.env.local` solamente para desarrollo. Ninguna variable de este proyecto debe empezar por `VITE_`: las credenciales se usan exclusivamente en Vercel Functions.

- `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_REDIRECT_URI` y `LINKEDIN_API_VERSION`: aplicación LinkedIn aprobada.
- `LINKEDIN_STATE_SECRET` y `UNIBELANDS_TOKEN_ENCRYPTION_KEY`: secretos aleatorios independientes.
- `UNIBELANDS_OWNER_CONNECT_SECRET`: habilita el inicio privado de OAuth; no es una contraseña de visitante.
- `CRON_SECRET`: Vercel lo entrega como Bearer al cron.
- `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`: almacenamiento cifrado del token y caché profesional saneada.

## Conectar LinkedIn como propietario

No existe botón público de conexión. Tras definir las variables de producción, inicia el consentimiento desde una terminal controlada:

```powershell
$env:PORTFOLIO_ORIGIN = 'https://tu-dominio.example'
$env:UNIBELANDS_OWNER_CONNECT_SECRET = 'tu-secreto-de-conexion'
pnpm run connect:linkedin
```

El comando imprime una URL de autorización de un solo uso. Ábrela en el navegador que tenga la cuenta propietaria. El callback valida PKCE y el estado antes de guardar un token cifrado; nunca devuelve el secreto ni el token al navegador.

## Despliegue en Vercel

1. Importa el repositorio en Vercel (Root Directory: `./`).
2. Añade las variables de `.env.example` en Production. No las incluyas en Git ni en Preview salvo que uses credenciales de desarrollo aisladas.
3. Conecta una base Upstash Redis y realiza un despliegue de producción.
4. Registra `https://tu-dominio.example/api/auth/linkedin/callback` como Redirect URL de LinkedIn.
5. Cuando LinkedIn Plus apruebe el caso de uso, registra `https://tu-dominio.example/api/linkedin/webhook`. LinkedIn validará la URL con `challengeCode`; el endpoint responde automáticamente.
6. Confirma en Vercel que el cron `/api/cron/linkedin` se ejecute diariamente a las 06:00 UTC. El cron solo se programa en producción.

Antes de declarar la sincronización real como lista, valida `GET /api/profile?locale=es`, `GET /api/profile?locale=en`, el consentimiento de propietario, el callback y una notificación de prueba desde LinkedIn. Si un proveedor no está disponible, la interfaz debe seguir mostrando “Datos locales verificados”.
