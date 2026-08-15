import React from 'react';
import { MISSION_OBJECTIVES } from './model';
import { useExperience } from './ExperienceContext';
import { useLocale } from '../profile/useLocale';

export const MissionTracker: React.FC = () => {
    const { t } = useLocale();
    const {
        completedObjectives,
        missionMinimized,
        setMissionMinimized,
        resetProgress,
    } = useExperience();
    const complete = completedObjectives.length;
    const total = MISSION_OBJECTIVES.length;
    const progressLabel = `${complete}/${total} ${t('verifiedSignals')}`;

    const signalStrip = (
        <ol className="flex items-center gap-1.5" aria-hidden="true">
            {MISSION_OBJECTIVES.map(objective => {
                const isComplete = completedObjectives.includes(objective.id);
                return (
                    <li
                        key={objective.id}
                        className={`h-2.5 w-2.5 rotate-45 border transition-colors duration-300 ${isComplete
                            ? 'border-[#00F0FF] bg-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.78)]'
                            : 'border-[#F2D019]/65 bg-black/40'}`}
                    />
                );
            })}
        </ol>
    );

    if (missionMinimized) {
        return (
            <button
                type="button"
                onClick={() => setMissionMinimized(false)}
                className="fixed bottom-4 left-4 z-[11000] flex min-h-11 items-center gap-3 border border-[#F2D019]/55 bg-black/85 px-3 py-2 text-[#F2D019] backdrop-blur transition hover:border-[#00F0FF] hover:bg-black/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00F0FF]"
                aria-label={`${t('explorationProgress')}: ${progressLabel}. ${t('openMission')}`}
            >
                <span className="grid h-6 w-6 place-items-center border border-[#F2D019]/60 font-mono text-xs text-[#F2D019]" aria-hidden="true">◇</span>
                {signalStrip}
            </button>
        );
    }

    return (
        <aside
            className="fixed bottom-4 left-4 z-[11000] w-[min(290px,calc(100vw-2rem))] border border-[#F2D019]/45 bg-black/88 p-3 text-white shadow-[0_0_28px_rgba(0,0,0,0.5)] backdrop-blur"
            aria-label={t('explorationProgress')}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center border border-[#F2D019]/60 font-mono text-sm text-[#F2D019]" aria-hidden="true">◇</span>
                    {signalStrip}
                </div>
                <button
                    type="button"
                    onClick={() => setMissionMinimized(true)}
                    className="grid min-h-11 min-w-11 place-items-center border border-white/15 bg-white/5 font-mono text-xs text-white/70 transition hover:border-[#F2D019] hover:text-[#F2D019] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00F0FF]"
                    aria-label={t('minimizeMission')}
                >
                    —
                </button>
            </div>

            <ol className="mt-3 grid grid-cols-5 gap-1" aria-live="polite">
                {MISSION_OBJECTIVES.map((objective, index) => {
                    const isComplete = completedObjectives.includes(objective.id);
                    const status = isComplete ? t('resolved') : t('available');
                    return (
                        <li
                            key={objective.id}
                            className={`group relative grid min-h-11 place-items-center border transition-colors duration-300 ${isComplete
                                ? 'border-[#00F0FF]/60 bg-[#00F0FF]/10 text-[#00F0FF]'
                                : 'border-white/15 bg-white/[0.03] text-white/60'}`}
                            aria-label={`${t(objective.labelKey)}: ${status}`}
                        >
                            <span className="font-mono text-[10px] font-black" aria-hidden="true">{index + 1}</span>
                            <span className="pointer-events-none absolute -bottom-6 left-1/2 z-10 w-max -translate-x-1/2 border border-white/15 bg-black px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                                {t(objective.labelKey)}
                            </span>
                        </li>
                    );
                })}
            </ol>

            <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-2">
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#F2D019]">{progressLabel}</p>
                <button
                    type="button"
                    onClick={resetProgress}
                    className="grid min-h-11 min-w-11 place-items-center border border-white/10 bg-white/5 font-mono text-sm text-white/55 transition hover:border-[#F2D019] hover:text-[#F2D019] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00F0FF]"
                    aria-label={t('resetProgress')}
                    title={t('resetProgress')}
                >
                    ↻
                </button>
            </div>
        </aside>
    );
};
