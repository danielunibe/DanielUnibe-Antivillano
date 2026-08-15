import { json, missingConfiguration } from '../_lib/http.ts';
import {
    createWebhookChallengeResponse,
    isLinkedInAccessRevoked,
    isValidLinkedInWebhookSignature,
    markLinkedInRefreshPending,
    missingLinkedInEnvironment,
    refreshLinkedInSnapshot,
    shouldRefreshForLinkedInWebhook,
    webhookEventKey,
    withdrawLinkedInSnapshot,
} from '../_lib/linkedin.ts';
import { hasRedisConfiguration, setIfAbsent } from '../_lib/redis.ts';

export default async function handler(request: Request) {
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (request.method === 'GET') {
        const challengeCode = new URL(request.url).searchParams.get('challengeCode');
        if (!challengeCode) return json({ error: 'MISSING_CHALLENGE_CODE' }, { status: 400 });
        if (!clientSecret) return missingConfiguration(['LINKEDIN_CLIENT_SECRET']);
        return json({
            challengeCode,
            challengeResponse: createWebhookChallengeResponse(challengeCode, clientSecret),
        });
    }

    if (request.method !== 'POST') return json({ error: 'METHOD_NOT_ALLOWED' }, { status: 405 });
    const missing = missingLinkedInEnvironment();
    if (missing.length) return missingConfiguration(missing);
    if (!hasRedisConfiguration()) return missingConfiguration(['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']);

    const rawBody = await request.text();
    if (!isValidLinkedInWebhookSignature(rawBody, request.headers.get('x-li-signature'), clientSecret!)) {
        return json({ error: 'INVALID_WEBHOOK_SIGNATURE' }, { status: 401 });
    }

    let payload: unknown;
    try {
        payload = JSON.parse(rawBody);
    } catch {
        return json({ error: 'INVALID_WEBHOOK_PAYLOAD' }, { status: 400 });
    }

    const eventKey = webhookEventKey(payload);
    if (!eventKey) return json({ error: 'MISSING_WEBHOOK_EVENT_ID' }, { status: 400 });
    if (!await setIfAbsent(`linkedin:webhook:${eventKey}`, '1', 60 * 60 * 24)) return new Response(null, { status: 204 });

    if (isLinkedInAccessRevoked(payload)) {
        await withdrawLinkedInSnapshot();
        return new Response(null, { status: 204 });
    }

    if (shouldRefreshForLinkedInWebhook(payload)) {
        try {
            const refreshed = await refreshLinkedInSnapshot();
            if (!refreshed) await markLinkedInRefreshPending();
        } catch {
            await markLinkedInRefreshPending();
        }
    }

    return new Response(null, { status: 204 });
}
