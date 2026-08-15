import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { PROFILE_DATA, createPublicProfileSnapshot } from '../../src/features/profile/data.ts';
import type { Locale, PublicProfileSnapshot } from '../../src/features/profile/types.ts';
import { getJson, releaseLock, remove, setIfAbsent, setJson } from './redis.ts';

const OAUTH_STATE_TTL_SECONDS = 10 * 60;
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 50;
const SNAPSHOT_TTL_SECONDS = 60 * 60 * 24 * 35;
const PENDING_REFRESH_TTL_SECONDS = 60 * 60 * 24 * 2;
const REFRESH_LOCK_TTL_SECONDS = 60;
const STATE_PREFIX = 'linkedin:oauth-state:';
const TOKEN_KEY = 'linkedin:owner-token';
const SNAPSHOT_KEY = 'linkedin:profile-cache';
const PENDING_REFRESH_KEY = 'linkedin:refresh-pending';
const REFRESH_LOCK_KEY = 'linkedin:refresh-lock';

type ProviderLocalizedValue = {
    localized?: Record<string, string>;
    preferredLocale?: { language?: string; country?: string };
};

export interface LinkedInToken {
    accessToken: string;
    expiresAt: number;
    refreshToken?: string;
    refreshExpiresAt?: number;
}

export interface LinkedInIdentity {
    lastRefreshedAt?: number;
    basicInfo?: {
        firstName?: ProviderLocalizedValue;
        lastName?: ProviderLocalizedValue;
        profileUrl?: string;
        primaryEmailAddress?: string;
    };
    primaryCurrentPosition?: {
        title?: ProviderLocalizedValue;
    };
}

interface LinkedInProfileCache {
    firstName?: ProviderLocalizedValue;
    lastName?: ProviderLocalizedValue;
    primaryCurrentTitle?: ProviderLocalizedValue;
    refreshedAt: string;
}

export interface OAuthTransaction {
    state: string;
    verifier: string;
    challenge: string;
}

type WebhookPayload = {
    eventId?: unknown;
    id?: unknown;
    isAccessRevoked?: unknown;
    profileInformationStatus?: unknown;
    verificationStatus?: unknown;
};

const toBase64Url = (value: Buffer) => value.toString('base64url');
const fromBase64Url = (value: string) => Buffer.from(value, 'base64url');
const hash = (value: string) => createHash('sha256').update(value).digest();
const secureEqual = (left: string, right: string) => {
    const leftBuffer = Buffer.from(left, 'utf8');
    const rightBuffer = Buffer.from(right, 'utf8');
    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

export const requiredLinkedInEnvironment = () => [
    'LINKEDIN_CLIENT_ID',
    'LINKEDIN_CLIENT_SECRET',
    'LINKEDIN_REDIRECT_URI',
    'LINKEDIN_API_VERSION',
    'UNIBELANDS_TOKEN_ENCRYPTION_KEY',
    'LINKEDIN_STATE_SECRET',
] as const;

export const missingLinkedInEnvironment = () => requiredLinkedInEnvironment().filter(key => !process.env[key]);

const signState = (nonce: string, expiresAt: number, secret: string) => toBase64Url(
    createHmac('sha256', secret).update(`${nonce}.${expiresAt}`).digest(),
);

export const createOAuthTransaction = (stateSecret: string, now = Date.now()): OAuthTransaction => {
    const nonce = toBase64Url(randomBytes(24));
    const verifier = toBase64Url(randomBytes(48));
    const expiresAt = now + OAUTH_STATE_TTL_SECONDS * 1000;
    const state = `v1.${nonce}.${expiresAt}.${signState(nonce, expiresAt, stateSecret)}`;
    return { state, verifier, challenge: toBase64Url(hash(verifier)) };
};

export const validateOAuthState = (state: string | null, stateSecret: string, now = Date.now()): string | null => {
    try {
        if (!state) return null;
        const [version, nonce, rawExpiresAt, signature] = state.split('.');
        const expiresAt = Number(rawExpiresAt);
        if (version !== 'v1' || !nonce || !signature || !Number.isFinite(expiresAt) || expiresAt < now) return null;
        const expected = signState(nonce, expiresAt, stateSecret);
        return secureEqual(toBase64Url(fromBase64Url(signature)), expected) ? nonce : null;
    } catch {
        return null;
    }
};

export const buildAuthorizationUrl = (transaction: OAuthTransaction) => {
    const authorizationUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authorizationUrl.search = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.LINKEDIN_CLIENT_ID ?? '',
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI ?? '',
        state: transaction.state,
        code_challenge: transaction.challenge,
        code_challenge_method: 'S256',
        scope: process.env.LINKEDIN_SCOPES ?? 'r_profile_basicinfo r_verify',
    }).toString();
    return authorizationUrl;
};

export const storeOAuthTransaction = async (transaction: OAuthTransaction) => {
    const nonce = validateOAuthState(transaction.state, process.env.LINKEDIN_STATE_SECRET ?? '');
    if (!nonce) throw new Error('INVALID_GENERATED_OAUTH_STATE');
    await setJson(`${STATE_PREFIX}${nonce}`, { verifier: transaction.verifier }, OAUTH_STATE_TTL_SECONDS);
};

export const consumeOAuthVerifier = async (nonce: string) => {
    const key = `${STATE_PREFIX}${nonce}`;
    const transaction = await getJson<{ verifier?: string }>(key);
    await remove(key);
    return transaction?.verifier ?? null;
};

const encryptionKey = () => hash(process.env.UNIBELANDS_TOKEN_ENCRYPTION_KEY ?? '');

export const encryptToken = (token: LinkedInToken): string => {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(token), 'utf8'), cipher.final()]);
    return [toBase64Url(iv), toBase64Url(cipher.getAuthTag()), toBase64Url(encrypted)].join('.');
};

export const decryptToken = (ciphertext: string): LinkedInToken | null => {
    try {
        const [ivPart, tagPart, dataPart] = ciphertext.split('.');
        if (!ivPart || !tagPart || !dataPart) return null;
        const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), fromBase64Url(ivPart));
        decipher.setAuthTag(fromBase64Url(tagPart));
        const plaintext = Buffer.concat([decipher.update(fromBase64Url(dataPart)), decipher.final()]).toString('utf8');
        const parsed = JSON.parse(plaintext) as Partial<LinkedInToken>;
        return typeof parsed.accessToken === 'string' && typeof parsed.expiresAt === 'number' ? parsed as LinkedInToken : null;
    } catch {
        return null;
    }
};

const localize = (value: ProviderLocalizedValue | undefined, locale: Locale) => {
    const localized = value?.localized;
    if (!localized) return undefined;
    const preferred = value?.preferredLocale;
    const preferredKey = preferred?.language && preferred.country ? `${preferred.language}_${preferred.country}` : undefined;
    const localeEntry = Object.entries(localized).find(([key]) => key.toLowerCase().startsWith(`${locale}_`));
    return (localeEntry?.[1]) ?? (preferredKey && localized[preferredKey]) ?? Object.values(localized)[0];
};

const cacheIdentity = (identity: LinkedInIdentity, now = new Date()): LinkedInProfileCache => ({
    firstName: identity.basicInfo?.firstName,
    lastName: identity.basicInfo?.lastName,
    primaryCurrentTitle: identity.primaryCurrentPosition?.title,
    refreshedAt: new Date(identity.lastRefreshedAt ?? now.getTime()).toISOString(),
});

const publicSnapshotFromCache = (cache: LinkedInProfileCache, locale: Locale, now = new Date()): PublicProfileSnapshot => {
    const local = createPublicProfileSnapshot(PROFILE_DATA, locale, now);
    const firstName = localize(cache.firstName, locale);
    const lastName = localize(cache.lastName, locale);
    return {
        ...local,
        name: [firstName, lastName].filter(Boolean).join(' ').trim() || local.name,
        title: localize(cache.primaryCurrentTitle, locale) || local.title,
        source: 'linkedin',
        syncStatus: 'fresh',
        updatedAt: cache.refreshedAt,
    };
};

export const normalizeLinkedInIdentity = (identity: LinkedInIdentity, locale: Locale = 'es', now = new Date()): PublicProfileSnapshot => (
    publicSnapshotFromCache(cacheIdentity(identity, now), locale, now)
);

export const shouldWithdrawLinkedInSnapshot = (status: number) => status === 401 || status === 403 || status === 429 || status >= 500;
const shouldRemoveConnection = (status: number) => status === 401 || status === 403;

export const getLinkedInIdentity = async (accessToken: string): Promise<LinkedInIdentity> => {
    const response = await fetch('https://api.linkedin.com/rest/identityMe', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'LinkedIn-Version': process.env.LINKEDIN_API_VERSION ?? '',
        },
    });
    if (!response.ok) throw new LinkedInApiError(response.status);
    return response.json() as Promise<LinkedInIdentity>;
};

export class LinkedInApiError extends Error {
    public readonly status: number;

    constructor(status: number) {
        super(`LINKEDIN_API_${status}`);
        this.status = status;
    }
}

const tokenFromResponse = (result: { access_token?: string; expires_in?: number; refresh_token?: string; refresh_token_expires_in?: number }, previous?: LinkedInToken): LinkedInToken => {
    if (!result.access_token || !result.expires_in) throw new Error('INVALID_LINKEDIN_TOKEN_RESPONSE');
    const now = Date.now();
    return {
        accessToken: result.access_token,
        expiresAt: now + result.expires_in * 1000,
        refreshToken: result.refresh_token ?? previous?.refreshToken,
        refreshExpiresAt: result.refresh_token_expires_in
            ? now + result.refresh_token_expires_in * 1000
            : previous?.refreshExpiresAt,
    };
};

export const exchangeAuthorizationCode = async (code: string, verifier: string): Promise<LinkedInToken> => {
    const payload = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI ?? '',
        client_id: process.env.LINKEDIN_CLIENT_ID ?? '',
        client_secret: process.env.LINKEDIN_CLIENT_SECRET ?? '',
        code_verifier: verifier,
    });
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: payload,
    });
    if (!response.ok) throw new LinkedInApiError(response.status);
    return tokenFromResponse(await response.json() as { access_token?: string; expires_in?: number; refresh_token?: string; refresh_token_expires_in?: number });
};

export const refreshAccessToken = async (token: LinkedInToken): Promise<LinkedInToken | null> => {
    if (!token.refreshToken || (token.refreshExpiresAt && token.refreshExpiresAt <= Date.now())) return null;
    const payload = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
        client_id: process.env.LINKEDIN_CLIENT_ID ?? '',
        client_secret: process.env.LINKEDIN_CLIENT_SECRET ?? '',
    });
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: payload,
    });
    if (!response.ok) throw new LinkedInApiError(response.status);
    return tokenFromResponse(await response.json() as { access_token?: string; expires_in?: number; refresh_token?: string; refresh_token_expires_in?: number }, token);
};

export const saveLinkedInConnection = async (token: LinkedInToken, identity: LinkedInIdentity) => {
    await setJson(TOKEN_KEY, { ciphertext: encryptToken(token) }, TOKEN_TTL_SECONDS);
    await setJson(SNAPSHOT_KEY, cacheIdentity(identity), SNAPSHOT_TTL_SECONDS);
    await remove(PENDING_REFRESH_KEY);
};

export const getLinkedInSnapshot = async (locale: Locale): Promise<PublicProfileSnapshot | null> => {
    const cached = await getJson<LinkedInProfileCache>(SNAPSHOT_KEY);
    return cached ? publicSnapshotFromCache(cached, locale) : null;
};

export const getStoredToken = async () => {
    const stored = await getJson<{ ciphertext?: string }>(TOKEN_KEY);
    return stored?.ciphertext ? decryptToken(stored.ciphertext) : null;
};

const withdrawPublicSnapshot = async () => {
    await remove(SNAPSHOT_KEY);
};

export const withdrawLinkedInSnapshot = async () => {
    await Promise.all([remove(SNAPSHOT_KEY), remove(TOKEN_KEY), remove(PENDING_REFRESH_KEY)]);
};

export const markLinkedInRefreshPending = async () => {
    await setJson(PENDING_REFRESH_KEY, { requestedAt: new Date().toISOString() }, PENDING_REFRESH_TTL_SECONDS);
};

export const createWebhookChallengeResponse = (challengeCode: string, clientSecret: string) => (
    createHmac('sha256', clientSecret).update(challengeCode).digest('hex')
);

export const isValidLinkedInWebhookSignature = (rawBody: string, receivedSignature: string | null, clientSecret: string) => {
    if (!receivedSignature) return false;
    const expected = createHmac('sha256', clientSecret).update(`hmacsha256=${rawBody}`).digest('hex');
    return secureEqual(receivedSignature, expected);
};

export const webhookEventKey = (payload: unknown) => {
    if (!payload || typeof payload !== 'object') return null;
    const record = payload as WebhookPayload;
    const id = record.eventId ?? record.id;
    return typeof id === 'string' && id.length > 0 && id.length < 200 ? id : null;
};

export const isLinkedInAccessRevoked = (payload: unknown) => Boolean(
    payload && typeof payload === 'object' && (payload as WebhookPayload).isAccessRevoked === true,
);

export const shouldRefreshForLinkedInWebhook = (payload: unknown) => {
    if (!payload || typeof payload !== 'object') return false;
    const status = (payload as WebhookPayload).profileInformationStatus;
    return status === 'INVALID' || status === 'VALID_WITH_UPDATES';
};

export const refreshLinkedInSnapshot = async (): Promise<boolean> => {
    const lockValue = toBase64Url(randomBytes(18));
    if (!await setIfAbsent(REFRESH_LOCK_KEY, lockValue, REFRESH_LOCK_TTL_SECONDS)) return false;

    try {
        let token = await getStoredToken();
        if (!token) {
            await withdrawLinkedInSnapshot();
            return false;
        }
        if (token.expiresAt <= Date.now()) {
            try {
                token = await refreshAccessToken(token);
            } catch (error) {
                if (error instanceof LinkedInApiError && shouldRemoveConnection(error.status)) await withdrawLinkedInSnapshot();
                else {
                    await withdrawPublicSnapshot();
                    await markLinkedInRefreshPending();
                }
                return false;
            }
            if (!token) {
                await withdrawLinkedInSnapshot();
                return false;
            }
        }

        try {
            const identity = await getLinkedInIdentity(token.accessToken);
            await saveLinkedInConnection(token, identity);
            return true;
        } catch (error) {
            if (error instanceof LinkedInApiError && shouldWithdrawLinkedInSnapshot(error.status)) {
                if (shouldRemoveConnection(error.status)) await withdrawLinkedInSnapshot();
                else {
                    await withdrawPublicSnapshot();
                    await markLinkedInRefreshPending();
                }
                return false;
            }
            throw error;
        }
    } finally {
        await releaseLock(REFRESH_LOCK_KEY, lockValue);
    }
};
