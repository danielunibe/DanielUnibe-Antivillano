import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';
import {
    createWebhookChallengeResponse,
    createOAuthTransaction,
    isLinkedInAccessRevoked,
    isValidLinkedInWebhookSignature,
    normalizeLinkedInIdentity,
    shouldWithdrawLinkedInSnapshot,
    shouldRefreshForLinkedInWebhook,
    validateOAuthState,
    webhookEventKey,
} from './linkedin.ts';

test('OAuth state uses PKCE and rejects tampered or expired callbacks', () => {
    const now = 1_700_000_000_000;
    const transaction = createOAuthTransaction('test-state-secret', now);

    assert.match(transaction.challenge, /^[A-Za-z0-9_-]+$/);
    assert.ok(validateOAuthState(transaction.state, 'test-state-secret', now + 1));
    assert.equal(validateOAuthState(`${transaction.state}tampered`, 'test-state-secret', now + 1), null);
    assert.equal(validateOAuthState(transaction.state, 'test-state-secret', now + 10 * 60 * 1000 + 1), null);
});

test('LinkedIn normalization excludes email and internal member ids from the public snapshot', () => {
    const snapshot = normalizeLinkedInIdentity({
        lastRefreshedAt: 1_700_000_000_000,
        basicInfo: {
            firstName: { localized: { es_MX: 'Daniel' }, preferredLocale: { language: 'es', country: 'MX' } },
            lastName: { localized: { es_MX: 'Unibe' }, preferredLocale: { language: 'es', country: 'MX' } },
            primaryEmailAddress: 'private@example.test',
        },
        primaryCurrentPosition: {
            title: { localized: { es_MX: 'Diseñador de producto' }, preferredLocale: { language: 'es', country: 'MX' } },
        },
    }, 'es', new Date('2026-08-09T00:00:00.000Z'));

    assert.equal(snapshot.name, 'Daniel Unibe');
    assert.equal(snapshot.title, 'Diseñador de producto');
    assert.equal(JSON.stringify(snapshot).includes('private@example.test'), false);
    assert.equal('id' in snapshot, false);
});

test('webhook challenge and raw-body signature follow the LinkedIn HMAC contract', () => {
    const secret = 'webhook-client-secret';
    const body = '{"eventId":"profile-change-42","profileInformationStatus":"INVALID"}';
    const signature = createHmac('sha256', secret).update(`hmacsha256=${body}`).digest('hex');

    assert.equal(createWebhookChallengeResponse('challenge-123', secret), createHmac('sha256', secret).update('challenge-123').digest('hex'));
    assert.equal(isValidLinkedInWebhookSignature(body, signature, secret), true);
    assert.equal(isValidLinkedInWebhookSignature(body, `hmacsha256=${signature}`, secret), false);
    assert.equal(isLinkedInAccessRevoked({ isAccessRevoked: true }), true);
    assert.equal(shouldRefreshForLinkedInWebhook({ profileInformationStatus: 'INVALID' }), true);
    assert.equal(shouldRefreshForLinkedInWebhook({ profileInformationStatus: 'VALID' }), false);
});

test('webhook event ids are bounded and repeatable, and recoverable statuses withdraw snapshots', () => {
    assert.equal(webhookEventKey({ eventId: 'profile-change-42' }), 'profile-change-42');
    assert.equal(webhookEventKey({ eventId: '' }), null);
    assert.equal(webhookEventKey({}), null);
    assert.equal(shouldWithdrawLinkedInSnapshot(401), true);
    assert.equal(shouldWithdrawLinkedInSnapshot(403), true);
    assert.equal(shouldWithdrawLinkedInSnapshot(429), true);
    assert.equal(shouldWithdrawLinkedInSnapshot(500), true);
    assert.equal(shouldWithdrawLinkedInSnapshot(400), false);
});
