import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import handler from './webhook.ts';

test('LinkedIn webhook answers the GET ownership challenge with client-secret HMAC', async () => {
    const previous = process.env.LINKEDIN_CLIENT_SECRET;
    process.env.LINKEDIN_CLIENT_SECRET = 'client-secret';
    try {
        const response = await handler(new Request('https://portfolio.example/api/linkedin/webhook?challengeCode=challenge-42'));
        const body = await response.json() as { challengeCode: string; challengeResponse: string };

        assert.equal(response.status, 200);
        assert.equal(body.challengeCode, 'challenge-42');
        assert.equal(body.challengeResponse, createHmac('sha256', 'client-secret').update('challenge-42').digest('hex'));
    } finally {
        if (previous === undefined) delete process.env.LINKEDIN_CLIENT_SECRET;
        else process.env.LINKEDIN_CLIENT_SECRET = previous;
    }
});
