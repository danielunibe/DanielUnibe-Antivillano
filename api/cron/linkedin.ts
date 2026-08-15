import { json, missingConfiguration } from '../_lib/http.ts';
import { missingLinkedInEnvironment, refreshLinkedInSnapshot } from '../_lib/linkedin.ts';
import { hasRedisConfiguration } from '../_lib/redis.ts';

export default async function handler(request: Request) {
    if (!process.env.CRON_SECRET) return missingConfiguration(['CRON_SECRET']);
    if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }
    const missing = missingLinkedInEnvironment();
    if (missing.length) return missingConfiguration([...missing]);
    if (!hasRedisConfiguration()) return missingConfiguration(['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']);

    const refreshed = await refreshLinkedInSnapshot();
    return json({ refreshed, source: refreshed ? 'linkedin' : 'local' });
}
