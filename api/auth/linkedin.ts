import { buildAuthorizationUrl, createOAuthTransaction, missingLinkedInEnvironment, storeOAuthTransaction } from '../_lib/linkedin.ts';
import { hasBearerToken, json, missingConfiguration } from '../_lib/http.ts';
import { hasRedisConfiguration } from '../_lib/redis.ts';

export default async function handler(request: Request) {
    if (request.method !== 'POST') return json({ error: 'METHOD_NOT_ALLOWED' }, { status: 405 });
    if (!process.env.UNIBELANDS_OWNER_CONNECT_SECRET) return missingConfiguration(['UNIBELANDS_OWNER_CONNECT_SECRET']);
    if (!hasBearerToken(request, process.env.UNIBELANDS_OWNER_CONNECT_SECRET)) {
        return json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const missing = missingLinkedInEnvironment();
    if (missing.length) return missingConfiguration([...missing]);
    if (!hasRedisConfiguration()) return missingConfiguration(['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']);

    const transaction = createOAuthTransaction(process.env.LINKEDIN_STATE_SECRET!);
    await storeOAuthTransaction(transaction);
    return json({ authorizationUrl: buildAuthorizationUrl(transaction) });
}
