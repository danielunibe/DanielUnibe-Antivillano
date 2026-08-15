import type {
    ObjectiveId,
    SectorId,
    TargetVisualState,
    WorldTargetDefinition,
    WorldTargetId,
} from './types.ts';

/**
 * The world remains fully open. This manifest only supplies visual priority
 * and shared semantics to the existing objects already placed in each sector.
 */
export const WORLD_TARGETS: readonly WorldTargetDefinition[] = [
    { id: 'IDENTITY', sector: 'NORTH', labelKey: 'identity', priority: 1, objectiveId: 'IDENTITY' },
    { id: 'STACK', sector: 'EAST', labelKey: 'capabilities', priority: 2, objectiveId: 'STACK' },
    { id: 'PROJECTS', sector: 'NORTH', labelKey: 'project', priority: 3, objectiveId: 'PROJECTS' },
    { id: 'PROCESS', sector: 'NORTH', labelKey: 'process', priority: 4, objectiveId: 'PROCESS' },
    { id: 'CONTACT', sector: 'NORTH', labelKey: 'contact', priority: 5, objectiveId: 'CONTACT' },
    { id: 'LOOT_MAP', sector: 'WEST', labelKey: 'lootMap', priority: 90 },
    { id: 'RECRUITER', sector: 'NORTH', labelKey: 'recruiter', priority: 91 },
] as const;

export const MISSION_TARGETS = WORLD_TARGETS.filter(
    (target): target is WorldTargetDefinition & { objectiveId: ObjectiveId } => target.objectiveId !== undefined,
);

export const getSuggestedTarget = (
    completedObjectives: readonly ObjectiveId[],
    sector?: SectorId,
): (WorldTargetDefinition & { objectiveId: ObjectiveId }) | undefined => {
    const unresolved = MISSION_TARGETS.filter(target => !completedObjectives.includes(target.objectiveId));
    return sector
        ? unresolved.find(target => target.sector === sector)
        : unresolved[0];
};

export const getWorldTargetStates = (
    completedObjectives: readonly ObjectiveId[],
    selectedTargetId: WorldTargetId | null,
    activeSector: SectorId,
): Record<WorldTargetId, TargetVisualState> => {
    const suggestedTargetId = getSuggestedTarget(completedObjectives, activeSector)?.id;

    return WORLD_TARGETS.reduce((states, target) => {
        if (target.objectiveId && completedObjectives.includes(target.objectiveId)) {
            states[target.id] = 'resolved';
        } else if (target.id === selectedTargetId) {
            states[target.id] = 'selected';
        } else if (target.id === suggestedTargetId) {
            states[target.id] = 'suggested';
        } else {
            states[target.id] = 'available';
        }
        return states;
    }, {} as Record<WorldTargetId, TargetVisualState>);
};

export const getPrimaryTargetForSector = (
    sector: SectorId,
    states: Readonly<Record<WorldTargetId, TargetVisualState>>,
): WorldTargetId => {
    const sectorTargets = WORLD_TARGETS
        .filter(target => target.sector === sector)
        .sort((left, right) => left.priority - right.priority);

    return sectorTargets.find(target => states[target.id] === 'suggested')?.id
        ?? sectorTargets.find(target => states[target.id] === 'available' && target.objectiveId)?.id
        ?? sectorTargets.find(target => states[target.id] === 'available')?.id
        ?? sectorTargets[0].id;
};
