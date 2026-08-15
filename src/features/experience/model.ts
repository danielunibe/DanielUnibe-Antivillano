import type { ExperienceMode, ExperienceState, ObjectiveId, SectorId } from './types.ts';
import { MISSION_TARGETS } from './targets.ts';

export const EXPERIENCE_STORAGE_KEY = 'unibelands3.experience.v1';

export const DEFAULT_EXPERIENCE_STATE: ExperienceState = {
    mode: 'EXPLORATION',
    completedObjectives: [],
    visitedSectors: [],
    missionMinimized: true,
};

export const MISSION_OBJECTIVES = MISSION_TARGETS;

export const SECTOR_BY_INDEX: Record<number, SectorId> = {
    0: 'WEST',
    1: 'NORTH',
    2: 'EAST',
};

const OBJECTIVE_IDS = new Set<ObjectiveId>(MISSION_OBJECTIVES.map(objective => objective.objectiveId));
const SECTOR_IDS = new Set<SectorId>(['WEST', 'NORTH', 'EAST']);

export const parseExperienceState = (raw: string | null): ExperienceState => {
    if (!raw) return { ...DEFAULT_EXPERIENCE_STATE };
    try {
        const parsed = JSON.parse(raw) as Partial<ExperienceState>;
        return {
            mode: parsed.mode === 'QUICK' ? 'QUICK' : 'EXPLORATION',
            completedObjectives: Array.isArray(parsed.completedObjectives)
                ? parsed.completedObjectives.filter((value): value is ObjectiveId => OBJECTIVE_IDS.has(value as ObjectiveId))
                : [],
            visitedSectors: Array.isArray(parsed.visitedSectors)
                ? parsed.visitedSectors.filter((value): value is SectorId => SECTOR_IDS.has(value as SectorId))
                : [],
            missionMinimized: Boolean(parsed.missionMinimized),
        };
    } catch {
        return { ...DEFAULT_EXPERIENCE_STATE };
    }
};

export const startExperienceState = (state: ExperienceState, mode: ExperienceMode, compactViewport: boolean): ExperienceState => ({
    ...state,
    mode,
    // The signal strip starts compact on every device; expansion is always an explicit choice.
    missionMinimized: true,
});

export const completeObjective = (state: ExperienceState, objective: ObjectiveId): ExperienceState => state.completedObjectives.includes(objective)
    ? state
    : { ...state, completedObjectives: [...state.completedObjectives, objective] };

export const visitSector = (state: ExperienceState, sector: SectorId): ExperienceState => state.visitedSectors.includes(sector)
    ? state
    : { ...state, visitedSectors: [...state.visitedSectors, sector] };

export const resetExperienceState = (): ExperienceState => ({
    ...DEFAULT_EXPERIENCE_STATE,
    completedObjectives: [],
    visitedSectors: [],
});
