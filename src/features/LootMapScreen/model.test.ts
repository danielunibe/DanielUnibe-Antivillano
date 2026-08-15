import assert from 'node:assert/strict';
import test from 'node:test';
import {
    CAREER_MILESTONES,
    getAdjacentCareerMilestone,
    getCareerMapVisualState,
    getSortedCareerMilestones,
    isCareerMapCoordinate,
} from './model.ts';

test('career milestones follow a chronological route through the hero journey', () => {
    const milestones = getSortedCareerMilestones();
    assert.equal(milestones[0]?.id, 'morelia-2013');
    assert.equal(milestones.at(-1)?.id, 'excellence-2025');
    assert.ok(milestones.every((milestone, index) => index === 0 || milestones[index - 1].startYear <= milestone.startYear));
    assert.equal(getAdjacentCareerMilestone('uniat-2019', 1).id, 'independent-lab-2020');
    assert.equal(getAdjacentCareerMilestone('morelia-2013', -1).id, 'morelia-2013');
});

test('every public point is corroborated, reachable, and inside the map', () => {
    const validActions = new Set(['STACK', 'PROJECTS', null]);
    for (const milestone of CAREER_MILESTONES) {
        assert.equal(milestone.evidenceState, 'verified');
        assert.ok(milestone.sourceDocumentCount >= 2, `${milestone.id} needs corroboration`);
        assert.ok(validActions.has(milestone.action));
        assert.ok(isCareerMapCoordinate(milestone.x));
        assert.ok(isCareerMapCoordinate(milestone.y));
        for (const localizedField of [milestone.date, milestone.title, milestone.evidence]) {
            assert.ok(localizedField.es.length > 0, `${milestone.id} needs Spanish content`);
            assert.ok(localizedField.en.length > 0, `${milestone.id} needs English content`);
        }
    }
});

test('the public trajectory covers education, experience, and recognition without fake progress', () => {
    const types = new Set(CAREER_MILESTONES.map(milestone => milestone.type));
    assert.ok(types.has('education'));
    assert.ok(types.has('experience'));
    assert.ok(types.has('recognition'));
    assert.equal(CAREER_MILESTONES.some(milestone => getCareerMapVisualState(milestone, milestone.id) !== 'selected'), false);
    assert.equal(getCareerMapVisualState(CAREER_MILESTONES[0], 'not-a-milestone'), 'verified');
});
