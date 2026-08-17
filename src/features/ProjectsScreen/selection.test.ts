import assert from 'node:assert/strict';
import test from 'node:test';
import { PROJECTS } from './data.ts';
import { countProjects, filterProjects } from './selection.ts';

test('featured projects represent current curated selection', () => {
    const featured = filterProjects(PROJECTS, 'DESTACADOS');
    assert.deepEqual(featured.map(project => project.id), [4]);
    assert.equal(featured.every(project => project.category !== 'ARCHIVE'), true);
});

test('imported unclassified media and retired versions remain preserved in archive', () => {
    const archive = filterProjects(PROJECTS, 'ARCHIVE');
    assert.equal(archive.length, 10);
    assert.deepEqual(archive.map(project => project.id), [301, 201, 202, 203, 204, 205, 206, 207, 208, 209]);
});

test('category counts use the same selection authority and include all 6 canonical categories', () => {
    assert.equal(countProjects(PROJECTS, 'TODOS'), PROJECTS.length);
    assert.equal(countProjects(PROJECTS, 'DESTACADOS'), 1);
    assert.ok(countProjects(PROJECTS, 'UX_PRODUCT') > 0);
    assert.ok(countProjects(PROJECTS, 'GAME_UI_3D') > 0);
    assert.ok(countProjects(PROJECTS, 'SYSTEMS_AI') > 0);
    assert.equal(countProjects(PROJECTS, 'ARCHIVE'), 10);
});

test('NODIA is registered and scoped strictly to TODOS and SYSTEMS_AI', () => {
    const nodia = PROJECTS.find(p => p.id === 501 || p.launchId === 'nodia');
    assert.ok(nodia, 'NODIA must exist in PROJECTS');
    assert.equal(nodia?.title, 'NODIA');
    assert.equal(nodia?.status, 'DEV');
    assert.equal(nodia?.launchApp, 'browser');

    const inTodos = filterProjects(PROJECTS, 'TODOS').some(p => p.id === 501);
    const inSystemsAi = filterProjects(PROJECTS, 'SYSTEMS_AI').some(p => p.id === 501);
    const inFeatured = filterProjects(PROJECTS, 'DESTACADOS').some(p => p.id === 501);
    const inUx = filterProjects(PROJECTS, 'UX_PRODUCT').some(p => p.id === 501);
    const inGameUi3d = filterProjects(PROJECTS, 'GAME_UI_3D').some(p => p.id === 501);
    const inArchive = filterProjects(PROJECTS, 'ARCHIVE').some(p => p.id === 501);

    assert.equal(inTodos, true, 'NODIA must appear in TODOS');
    assert.equal(inSystemsAi, true, 'NODIA must appear in SYSTEMS_AI');
    assert.equal(inFeatured, false, 'NODIA must not appear in DESTACADOS');
    assert.equal(inUx, false, 'NODIA must not appear in UX_PRODUCT');
    assert.equal(inGameUi3d, false, 'NODIA must not appear in GAME_UI_3D');
    assert.equal(inArchive, false, 'NODIA must not appear in ARCHIVE');
});

