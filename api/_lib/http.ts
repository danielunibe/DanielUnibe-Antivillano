export const json = (body: unknown, init: ResponseInit = {}) => {
    const headers = new Headers(init.headers);
    headers.set('content-type', 'application/json; charset=utf-8');
    if (!headers.has('cache-control')) headers.set('cache-control', 'no-store');
    return new Response(JSON.stringify(body), { ...init, headers });
};

export const getLocaleFromRequest = (request: Request): 'es' | 'en' => {
    const locale = new URL(request.url).searchParams.get('locale');
    return locale === 'en' ? 'en' : 'es';
};

export const missingConfiguration = (keys: string[]) => json({
    error: 'SERVICE_NOT_CONFIGURED',
    missing: keys,
}, { status: 503 });

export const hasBearerToken = (request: Request, expected: string | undefined) => {
    if (!expected) return false;
    const received = request.headers.get('authorization');
    const expectedHeader = `Bearer ${expected}`;
    if (!received || received.length !== expectedHeader.length) return false;
    return timingSafeEqual(Buffer.from(received), Buffer.from(expectedHeader));
};
import { timingSafeEqual } from 'node:crypto';
