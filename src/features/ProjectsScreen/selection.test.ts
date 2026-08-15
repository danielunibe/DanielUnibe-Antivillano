import assert from 'node:assert/strict';
import test from 'node:test';
import { PROJECTS } from './data.ts';
import { countProjects, filterProjects } from './selection.ts';

test('featured projects are curated independently of discipline', () => {
    const featured = filterProjects(PROJECTS, 'FEATURED');
    assert.deepEqual(featured.map(project => project.id), [301, 14, 18, 4]);
    assert.equal(featured.every(project => project.category !== 'ARCHIVE'), true);
});

test('imported unclassified media remains preserved in archive', () => {
    const archive = filterProjects(PROJECTS, 'ARCHIVE');
    assert.equal(archive.length, 9);
    assert.deepEqual(archive.map(project => project.id), [201, 202, 203, 204, 205, 206, 207, 208, 209]);
});

test('category counts use the same selection authority', () => {
    assert.equal(countProjects(PROJECTS, 'ALL'), PROJECTS.length);
    assert.equal(countProjects(PROJECTS, 'FEATURED'), 4);
});
