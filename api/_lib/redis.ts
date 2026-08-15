type UpstashResult = { result?: unknown; error?: string };

const getConfig = () => ({
    url: process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, ''),
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const hasRedisConfiguration = () => {
    const { url, token } = getConfig();
    return Boolean(url && token);
};

const command = async (parts: (string | number)[]): Promise<unknown> => {
    const { url, token } = getConfig();
    if (!url || !token) throw new Error('UPSTASH_REDIS_NOT_CONFIGURED');

    const response = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/json',
        },
        body: JSON.stringify([parts]),
    });
    if (!response.ok) throw new Error(`UPSTASH_REDIS_${response.status}`);
    const payload = (await response.json()) as UpstashResult[];
    const result = payload[0];
    if (result?.error) throw new Error(`UPSTASH_REDIS_${result.error}`);
    return result?.result;
};

export const getJson = async <T>(key: string): Promise<T | null> => {
    const value = await command(['GET', key]);
    if (typeof value !== 'string') return null;
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
};

export const setJson = async (key: string, value: unknown, ttlSeconds: number) => {
    await command(['SET', key, JSON.stringify(value), 'EX', ttlSeconds]);
};

export const setIfAbsent = async (key: string, value: string, ttlSeconds: number): Promise<boolean> => {
    const result = await command(['SET', key, value, 'NX', 'EX', ttlSeconds]);
    return result === 'OK';
};

export const releaseLock = async (key: string, value: string) => {
    await command([
        'EVAL',
        "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) else return 0 end",
        1,
        key,
        value,
    ]);
};

export const remove = async (key: string) => {
    await command(['DEL', key]);
};
