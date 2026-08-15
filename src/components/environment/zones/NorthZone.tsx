import React from 'react';
import { ASSETS } from '../../../config/assets';
import { useImageInteraction } from '../../../features/InteractionSystem';
import { useLocale } from '../../../features/profile/useLocale';
import { EchoPortal } from '../EchoPortal';
import { Portal } from '../Portal';
import type { TargetVisualState, WorldTargetId } from '../../../features/experience/types';

interface NorthZoneProps {
  onQuestClick: () => void;
  onContactClick: () => void;
  onCreditsClick: () => void;
  onRecruiterClick: () => void;
  onProfileClick: () => void;
  targetStates: Readonly<Record<WorldTargetId, TargetVisualState>>;
  activeIndex: number;
  triggerAnimation: boolean;
}

export const NorthZone: React.FC<NorthZoneProps> = React.memo(({ onQuestClick, onContactClick, onCreditsClick, onRecruiterClick, onProfileClick, targetStates, activeIndex, triggerAnimation }) => {
  const { t } = useLocale();
  const contactUplinkInteraction = useImageInteraction(t('contactStation'), '');
  const creditsTerminalInteraction = useImageInteraction(`${t('credits')}: ${t('makingOf')}`, '');
  const recruiterInteraction = useImageInteraction(t('professionalDossier'), '');

  return (
    <>
      <div className="absolute left-[7%] bottom-0 z-[30] flex items-end justify-center pointer-events-none">
        <img
          src={ASSETS.STRUCTURES.STONE_MESH}
          alt="Stone Mounds"
          className="object-contain object-bottom select-none"
          style={{
            // User request: reduce back rocks by 20% (from the previous +30% adjustment).
            height: 'calc(var(--stage-h) * 0.69)',
            transform: 'translateX(-50%) translateY(calc(var(--stage-h) * 0.13 + 30px))',
            maxWidth: 'none',
            filter: 'brightness(0.9)'
          }}
        />
      </div>

      <div
        className="absolute left-[5.2%] top-1/2 z-[90] flex items-center justify-center pointer-events-none"
        // Keep the portal crisp: avoid scaling the whole group from a smaller rasterized layer.
        style={{ transform: 'translateY(-80%)', transformOrigin: 'center left' }}
      >
        <EchoPortal trigger={triggerAnimation} onOpenProfile={onProfileClick} visualState={targetStates.IDENTITY} />
      </div>

      <button
        type="button"
        aria-label={t('openCredits')}
        className={`world-target absolute right-[2%] top-[2%] z-[1200] flex items-end justify-center pointer-events-auto cursor-pointer group border-0 bg-transparent p-4 text-left ${creditsTerminalInteraction.className}`}
        data-target-state={targetStates.PROCESS}
        onClick={(event) => {
          event.stopPropagation();
          onCreditsClick();
        }}
        onMouseEnter={creditsTerminalInteraction.onMouseEnter}
        onMouseLeave={creditsTerminalInteraction.onMouseLeave}
        style={{ animationDelay: '0.65s' }}
      >
        <div
          className="relative h-24 w-48 overflow-hidden border-2 border-black bg-[#f2d019] shadow-[0_7px_0_rgba(0,0,0,0.9),0_13px_18px_rgba(0,0,0,0.34)] transition duration-150 group-hover:-translate-y-0.5 group-hover:brightness-105 group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-[#00f0ff]"
          style={{ clipPath: 'polygon(0 0, 92% 0, 100% 18%, 100% 100%, 8% 100%, 0 82%)' }}
        >
          <div className="absolute inset-x-0 top-0 h-5 bg-[repeating-linear-gradient(135deg,#000_0_10px,#f2d019_10px_20px)]" />
          <div className="absolute left-4 right-4 top-8 text-center">
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-black/62">{t('archive')}</p>
            <p className="font-['Teko'] text-4xl font-black uppercase leading-[0.82] tracking-widest text-black">{t('credits')}</p>
          </div>
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between border border-black/60 bg-black/82 px-2 py-1 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[#f2d019]">
            <span>{t('makingOf')}</span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#f2d019]" />
          </div>
          <span className="world-target-signal" aria-hidden="true" />
        </div>
      </button>

      <button
        type="button"
        aria-label={t('openRecruiter')}
        className={`world-target group absolute right-[2.2%] top-[calc(var(--stage-h)_*_0.28)] z-[1195] flex w-48 items-stretch border-0 bg-transparent p-0 text-left pointer-events-auto cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00f0ff] sm:w-56 ${recruiterInteraction.className}`}
        data-target-state={targetStates.RECRUITER}
        onClick={onRecruiterClick}
        onMouseEnter={recruiterInteraction.onMouseEnter}
        onMouseLeave={recruiterInteraction.onMouseLeave}
        style={{ animationDelay: '0.55s' }}
      >
        <div
          className="relative flex min-h-24 w-full flex-col justify-between overflow-hidden border-2 border-black bg-[#00f0ff] px-4 py-3 text-black shadow-[0_7px_0_rgba(0,0,0,0.9),0_13px_18px_rgba(0,0,0,0.3)] transition duration-150 group-hover:-translate-y-0.5 group-hover:bg-white"
          style={{ clipPath: 'polygon(0 0, 93% 0, 100% 18%, 100% 100%, 7% 100%, 0 82%)' }}
        >
          <div className="absolute inset-x-0 top-0 h-4 bg-[repeating-linear-gradient(135deg,#000_0_9px,#00f0ff_9px_18px)] opacity-90" />
          <div className="mt-3 flex items-center justify-between font-mono text-[8px] font-black uppercase tracking-[0.18em] text-black/65">
            <span>{t('priorityChannel')}</span>
            <span className="h-2 w-2 animate-pulse bg-black" />
          </div>
          <span className="font-['Teko'] text-4xl font-black uppercase leading-none tracking-widest">{t('recruiter')}</span>
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-black/70">{t('professionalDossier')} →</span>
          <span className="world-target-signal" aria-hidden="true" />
        </div>
      </button>

      <button
        type="button"
        aria-label={t('openContact')}
        className={`world-target absolute right-[2.6%] top-[calc(var(--stage-h)_*_0.14)] z-[1190] flex items-end justify-center pointer-events-auto cursor-pointer group border-0 bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00ff9d] ${contactUplinkInteraction.className}`}
        data-target-state={targetStates.CONTACT}
        onClick={onContactClick}
        onMouseEnter={contactUplinkInteraction.onMouseEnter}
        onMouseLeave={contactUplinkInteraction.onMouseLeave}
        style={{ animationDelay: '0.4s' }}
      >
        <div className="relative w-36 h-36 border-2 border-[#00ff9d] bg-[#00ff9d]/10 backdrop-blur-sm flex items-center justify-center overflow-hidden animate-float">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,#00ff9d_25%,#00ff9d_50%,transparent_50%,transparent_75%,#00ff9d_75%,#00ff9d_100%)] opacity-10 bg-[length:10px_10px]" />
          <div className="absolute top-0 left-0 w-full h-1 bg-[#00ff9d] shadow-[0_0_10px_#00ff9d]" />
          <span className="font-['Teko'] text-3xl text-[#00ff9d] font-bold tracking-widest drop-shadow-[0_0_5px_rgba(0,255,157,0.8)]">{t('contact')}</span>
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-[#00ff9d] animate-pulse" />
          <span className="world-target-signal" aria-hidden="true" />
        </div>
      </button>
      <div className="absolute left-0 bottom-0 z-[108] w-full flex items-end justify-end pr-[7%] pointer-events-none">
        <Portal onQuestClick={onQuestClick} activeIndex={activeIndex} visualState={targetStates.PROJECTS} layout="north" />
      </div>

    </>
  );
});
