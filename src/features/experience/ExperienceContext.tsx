import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    completeObjective,
    EXPERIENCE_STORAGE_KEY,
    parseExperienceState,
    resetExperienceState,
    startExperienceState,
    visitSector,
} from './model';
import { ExperienceMode, ExperienceState, ObjectiveId, SectorId } from './types';

interface ExperienceContextValue extends ExperienceState {
    startExperience: (mode: ExperienceMode) => void;
    markObjective: (objective: ObjectiveId) => void;
    markSector: (sector: SectorId) => void;
    setMissionMinimized: (minimized: boolean) => void;
    resetProgress: () => void;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

const readStoredState = (): ExperienceState => {
    return parseExperienceState(window.sessionStorage.getItem(EXPERIENCE_STORAGE_KEY));
};

export const ExperienceProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [state, setState] = useState<ExperienceState>(readStoredState);

    useEffect(() => {
        window.sessionStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const startExperience = useCallback((mode: ExperienceMode) => {
        const compactViewport = window.matchMedia('(max-width: 640px)').matches;
        setState(current => startExperienceState(current, mode, compactViewport));
    }, []);

    const markObjective = useCallback((objective: ObjectiveId) => {
        setState(current => completeObjective(current, objective));
    }, []);

    const markSector = useCallback((sector: SectorId) => {
        setState(current => visitSector(current, sector));
    }, []);

    const setMissionMinimized = useCallback((missionMinimized: boolean) => {
        setState(current => ({ ...current, missionMinimized }));
    }, []);

    const resetProgress = useCallback(() => setState(resetExperienceState()), []);

    const value = useMemo(() => ({
        ...state,
        startExperience,
        markObjective,
        markSector,
        setMissionMinimized,
        resetProgress,
    }), [state, startExperience, markObjective, markSector, setMissionMinimized, resetProgress]);

    return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
};

export const useExperience = () => {
    const value = useContext(ExperienceContext);
    if (!value) throw new Error('useExperience must be used inside ExperienceProvider');
    return value;
};
