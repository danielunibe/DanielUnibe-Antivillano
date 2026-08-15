export type ExperienceMode = 'EXPLORATION' | 'QUICK';
export type SectorId = 'WEST' | 'NORTH' | 'EAST';
export type ObjectiveId = 'IDENTITY' | 'STACK' | 'PROJECTS' | 'PROCESS' | 'CONTACT';
export type WorldTargetId = ObjectiveId | 'LOOT_MAP' | 'RECRUITER';
export type TargetVisualState = 'available' | 'suggested' | 'selected' | 'resolved';

export type WorldTargetLabelKey = 'identity' | 'capabilities' | 'project' | 'process' | 'contact' | 'lootMap' | 'recruiter';

export interface WorldTargetDefinition {
    id: WorldTargetId;
    sector: SectorId;
    labelKey: WorldTargetLabelKey;
    priority: number;
    objectiveId?: ObjectiveId;
}

export interface ExperienceState {
    mode: ExperienceMode;
    completedObjectives: ObjectiveId[];
    visitedSectors: SectorId[];
    missionMinimized: boolean;
}
