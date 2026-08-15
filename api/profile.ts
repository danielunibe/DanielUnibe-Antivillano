import { PROFILE_DATA, createPublicProfileSnapshot } from '../src/features/profile/data.ts';
import type { PublicProfileSnapshot } from '../src/features/profile/types.ts';
import { getLocaleFromRequest, json } from './_lib/http.ts';
import { getLinkedInSnapshot } from './_lib/linkedin.ts';
import { hasRedisConfiguration } from './_lib/redis.ts';

export default async function handler(request: Request) {
    const locale = getLocaleFromRequest(request);
    const localSnapshot = createPublicProfileSnapshot(PROFILE_DATA, locale);
    let snapshot: PublicProfileSnapshot = localSnapshot;

    if (hasRedisConfiguration()) {
        try {
            const linkedInSnapshot = await getLinkedInSnapshot(locale);
            if (linkedInSnapshot) snapshot = linkedInSnapshot;
        } catch {
            // Public delivery remains local-first when Redis is temporarily unavailable.
        }
    }

    return json(snapshot, { headers: { 'cache-control': 'public, max-age=300, s-maxage=300' } });
}
