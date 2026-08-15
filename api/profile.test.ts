import assert from 'node:assert/strict';
import test from 'node:test';
import handler from './profile.ts';

test('GET /api/profile returns the normalized local fallback without private contact data', async () => {
    const response = await handler(new Request('https://portfolio.example/api/profile?locale=en'));
    const profile = await response.json() as { title: string; source: string; specialties: string[]; [key: string]: unknown };

    assert.equal(response.status, 200);
    assert.equal(profile.source, 'local');
    assert.equal(profile.title, 'UI/UX designer, creative technologist and 3D artist');
    assert.equal(Array.isArray(profile.specialties), true);
    assert.equal('publicEmail' in profile, false);
    assert.equal(JSON.stringify(profile).includes('contact@unibelands.com'), false);
});

test('GET /api/profile localizes local fallback snapshots per requested locale', async () => {
    const esResponse = await handler(new Request('https://portfolio.example/api/profile?locale=es'));
    const enResponse = await handler(new Request('https://portfolio.example/api/profile?locale=en'));
    const esProfile = await esResponse.json() as { title: string };
    const enProfile = await enResponse.json() as { title: string };

    assert.equal(esProfile.title, 'Diseñador UI/UX, creative technologist y artista 3D');
    assert.equal(enProfile.title, 'UI/UX designer, creative technologist and 3D artist');
});
