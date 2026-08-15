import assert from 'node:assert/strict';
import test from 'node:test';
import handler from './linkedin.ts';

test('owner OAuth entrypoint accepts POST only and rejects requests without the owner secret', async () => {
    const previous = process.env.UNIBELANDS_OWNER_CONNECT_SECRET;
    process.env.UNIBELANDS_OWNER_CONNECT_SECRET = 'owner-secret';

    try {
        const getResponse = await handler(new Request('https://portfolio.example/api/auth/linkedin'));
        const unauthorized = await handler(new Request('https://portfolio.example/api/auth/linkedin', { method: 'POST' }));
        const wrongSecret = await handler(new Request('https://portfolio.example/api/auth/linkedin', {
            method: 'POST',
            headers: { authorization: 'Bearer wrong-secret' },
        }));

        assert.equal(getResponse.status, 405);
        assert.equal(unauthorized.status, 401);
        assert.equal(wrongSecret.status, 401);
    } finally {
        if (previous === undefined) delete process.env.UNIBELANDS_OWNER_CONNECT_SECRET;
        else process.env.UNIBELANDS_OWNER_CONNECT_SECRET = previous;
    }
});

test('owner OAuth entrypoint returns a one-time PKCE authorization URL only after authorization', async () => {
    const envKeys = [
        'UNIBELANDS_OWNER_CONNECT_SECRET',
        'LINKEDIN_CLIENT_ID',
        'LINKEDIN_CLIENT_SECRET',
        'LINKEDIN_REDIRECT_URI',
        'LINKEDIN_API_VERSION',
        'UNIBELANDS_TOKEN_ENCRYPTION_KEY',
        'LINKEDIN_STATE_SECRET',
        'UPSTASH_REDIS_REST_URL',
        'UPSTASH_REDIS_REST_TOKEN',
    ] as const;
    const previous = new Map(envKeys.map(key => [key, process.env[key]]));
    const originalFetch = globalThis.fetch;

    Object.assign(process.env, {
        UNIBELANDS_OWNER_CONNECT_SECRET: 'owner-secret',
        LINKEDIN_CLIENT_ID: 'client-id',
        LINKEDIN_CLIENT_SECRET: 'client-secret',
        LINKEDIN_REDIRECT_URI: 'https://portfolio.example/api/auth/linkedin/callback',
        LINKEDIN_API_VERSION: '202510.03',
        UNIBELANDS_TOKEN_ENCRYPTION_KEY: 'encryption-secret',
        LINKEDIN_STATE_SECRET: 'state-secret',
        UPSTASH_REDIS_REST_URL: 'https://redis.example',
        UPSTASH_REDIS_REST_TOKEN: 'redis-token',
    });
    globalThis.fetch = async () => new Response(JSON.stringify([{ result: 'OK' }]), { headers: { 'content-type': 'application/json' } });

    try {
        const response = await handler(new Request('https://portfolio.example/api/auth/linkedin', {
            method: 'POST',
            headers: { authorization: 'Bearer owner-secret' },
        }));
        const payload = await response.json() as { authorizationUrl?: string };

        assert.equal(response.status, 200);
        assert.match(payload.authorizationUrl ?? '', /^https:\/\/www\.linkedin\.com\/oauth\/v2\/authorization\?/);
        assert.match(payload.authorizationUrl ?? '', /code_challenge=/);
        assert.doesNotMatch(JSON.stringify(payload), /owner-secret|client-secret|redis-token/);
    } finally {
        globalThis.fetch = originalFetch;
        for (const key of envKeys) {
            const value = previous.get(key);
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    }
});
