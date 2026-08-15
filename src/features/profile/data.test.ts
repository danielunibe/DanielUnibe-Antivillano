import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateFullVerifiedYears, createPublicProfileSnapshot, PROFILE_DATA } from './data.ts';

test('calculates five conservative full years from the documented 2020-present period', () => {
    assert.equal(calculateFullVerifiedYears(PROFILE_DATA.workPeriods, new Date('2026-08-09T00:00:00.000Z')), 5);
});

test('public profile snapshot excludes contact data and uses localized content', () => {
    const snapshot = createPublicProfileSnapshot(PROFILE_DATA, 'en', new Date('2026-08-09T00:00:00.000Z'));
    assert.equal(snapshot.title, 'UI/UX designer, creative technologist and 3D artist');
    assert.equal('publicEmail' in snapshot, false);
    assert.equal(JSON.stringify(snapshot).includes(PROFILE_DATA.publicEmail), false);
});
