import assert from 'node:assert/strict';
import test from 'node:test';
import {
    completeObjective,
    parseExperienceState,
    resetExperienceState,
    startExperienceState,
    visitSector,
} from './model.ts';
import {
    getPrimaryTargetForSector,
    getSuggestedTarget,
    getWorldTargetStates,
    MISSION_TARGETS,
} from './targets.ts';

test('progress and visited sectors are idempotent', () => {
    const initial = resetExperienceState();
    const withObjective = completeObjective(completeObjective(initial, 'STACK'), 'STACK');
    const withSector = visitSector(visitSector(withObjective, 'EAST'), 'EAST');
    assert.deepEqual(withSector.completedObjectives, ['STACK']);
    assert.deepEqual(withSector.visitedSectors, ['EAST']);
});

test('every entry mode starts with the signal strip compact', () => {
    const initial = resetExperienceState();
    assert.equal(startExperienceState(initial, 'QUICK', false).missionMinimized, true);
    assert.equal(startExperienceState(initial, 'EXPLORATION', true).missionMinimized, true);
    assert.equal(startExperienceState(initial, 'EXPLORATION', false).missionMinimized, true);
});

test('stored state is sanitized and invalid JSON resets safely', () => {
    const parsed = parseExperienceState(JSON.stringify({
        mode: 'QUICK',
        completedObjectives: ['STACK', 'NOT_REAL'],
        visitedSectors: ['WEST', 'VOID'],
        missionMinimized: true,
    }));
    assert.deepEqual(parsed.completedObjectives, ['STACK']);
    assert.deepEqual(parsed.visitedSectors, ['WEST']);
    assert.equal(parsed.mode, 'QUICK');
    assert.deepEqual(parseExperienceState('{broken'), resetExperienceState());
});

test('reset returns fresh empty collections', () => {
    const first = resetExperienceState();
    const second = resetExperienceState();
    assert.notEqual(first.completedObjectives, second.completedObjectives);
    assert.notEqual(first.visitedSectors, second.visitedSectors);
});

test('the world suggests one unresolved target without locking optional access', () => {
    assert.equal(getSuggestedTarget([])?.id, 'IDENTITY');
    assert.equal(getSuggestedTarget(['IDENTITY'])?.id, 'STACK');
    assert.equal(getSuggestedTarget(['IDENTITY'], 'NORTH')?.id, 'PROJECTS');
    assert.equal(MISSION_TARGETS.some(target => target.id === 'LOOT_MAP' || target.id === 'RECRUITER'), false);

    const states = getWorldTargetStates([], null, 'NORTH');
    assert.equal(states.IDENTITY, 'suggested');
    assert.equal(states.LOOT_MAP, 'available');
    assert.equal(states.RECRUITER, 'available');
    assert.equal(getPrimaryTargetForSector('NORTH', states), 'IDENTITY');
});

test('resolved signals retain their original destination and do not create new progress', () => {
    const states = getWorldTargetStates(['IDENTITY'], 'IDENTITY', 'NORTH');
    assert.equal(states.IDENTITY, 'resolved');
    assert.equal(states.PROJECTS, 'suggested');
    assert.equal(getPrimaryTargetForSector('EAST', states), 'STACK');
});
