import {
    consumeOAuthVerifier,
    exchangeAuthorizationCode,
    getLinkedInIdentity,
    LinkedInApiError,
    missingLinkedInEnvironment,
    saveLinkedInConnection,
    shouldWithdrawLinkedInSnapshot,
    validateOAuthState,
    withdrawLinkedInSnapshot,
} from '../../_lib/linkedin.ts';
import { json, missingConfiguration } from '../../_lib/http.ts';
import { hasRedisConfiguration } from '../../_lib/redis.ts';

const redirectToSite = (request: Request, status: 'connected' | 'failed') => {
    const target = new URL('/', request.url);
    target.searchParams.set('linkedin', status);
    return Response.redirect(target, 302);
};

export default async function handler(request: Request) {
    const missing = missingLinkedInEnvironment();
    if (missing.length) return missingConfiguration([...missing]);
    if (!hasRedisConfiguration()) return missingConfiguration(['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']);

    const url = new URL(request.url);
    const providerError = url.searchParams.get('error');
    const code = url.searchParams.get('code');
    const nonce = validateOAuthState(url.searchParams.get('state'), process.env.LINKEDIN_STATE_SECRET!);
    if (providerError || !code || !nonce) return json({ error: 'INVALID_OAUTH_CALLBACK' }, { status: 400 });

    const verifier = await consumeOAuthVerifier(nonce);
    if (!verifier) return json({ error: 'EXPIRED_OR_REPLAYED_OAUTH_STATE' }, { status: 400 });

    try {
        const token = await exchangeAuthorizationCode(code, verifier);
        const identity = await getLinkedInIdentity(token.accessToken);
        await saveLinkedInConnection(token, identity);
        return redirectToSite(request, 'connected');
    } catch (error) {
        if (error instanceof LinkedInApiError && shouldWithdrawLinkedInSnapshot(error.status)) {
            await withdrawLinkedInSnapshot();
        }
        return redirectToSite(request, 'failed');
    }
}
