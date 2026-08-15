import React from 'react';
import { ASSETS } from '../../config/assets';
import { WestZone, NorthZone, EastZone } from './HorizonZones';
import type { TargetVisualState, WorldTargetId } from '../../features/experience/types';

interface HorizonProps {
  onActivateTarget: (targetId: WorldTargetId) => void;
  targetStates: Readonly<Record<WorldTargetId, TargetVisualState>>;
  activeIndex: number;
  enableAnimations: boolean;
}

/** Clip style: prevents hard horizontal cuts between panes without creating scroll. */
const PANE_CLIP: React.CSSProperties = {
  clipPath: 'inset(-120% -120% -120% -120%)',
};

/** Shared horizon mask style applied at the bottom of every pane. */
const MASK_BASE: React.CSSProperties = {
  height: '42%',
  transformOrigin: 'bottom center',
  filter: 'sepia(0.28) saturate(0.7) brightness(1.18)',
  opacity: 1.0,
};

const maskStyle = (translateY: string): React.CSSProperties => ({
  ...MASK_BASE,
  transform: `scale(0.9) translateY(${translateY})`,
});

const HorizonMask: React.FC<{ translateY: string }> = ({ translateY }) => (
  <img
    src={ASSETS.BG.HORIZON_MASK}
    alt=""
    aria-hidden="true"
    className="absolute bottom-0 left-0 w-full object-contain object-bottom z-20 select-none pointer-events-none"
    style={maskStyle(translateY)}
  />
);

export const Horizon: React.FC<HorizonProps> = React.memo(({
  onActivateTarget,
  targetStates,
  activeIndex,
  enableAnimations,
}) => (
  <div
    id="horizon-wrapper"
    className="absolute left-0 z-20 pointer-events-none will-change-transform"
    style={{
      width: 'calc(var(--stage-w) * 3)',
      bottom: 'calc(var(--stage-h) * 0.46 - 20px)',
      height: 'calc(var(--stage-h) * 0.4)',
      minHeight: '200px',
    }}
  >
    {/* OESTE (Left) */}
    <div
      className="absolute left-0 top-0 h-full overflow-visible pointer-events-none"
      style={{ ...PANE_CLIP, width: 'var(--stage-w)' }}
    >
      <WestZone
        onMapClick={() => onActivateTarget('LOOT_MAP')}
        activeIndex={activeIndex}
        targetState={targetStates.LOOT_MAP}
      />
      <HorizonMask translateY="-60px" />
    </div>

    {/* SEAM: Communication & Radar Station between West (Left) and North (Center) */}
    <div
      className="absolute bottom-0 z-[25] flex items-end justify-center pointer-events-none select-none"
      style={{
        left: 'calc(var(--stage-w) - 2%)',
        transform: 'translateX(-50%) translateY(calc(var(--stage-h) * 0.12))',
      }}
    >
      <img
        src={ASSETS.STRUCTURES.COMM_TOWER}
        alt="Communication Radar Tower"
        draggable={false}
        className="object-contain object-bottom select-none"
        style={{
          height: 'calc(var(--stage-h) * 0.78)',
          maxWidth: 'none',
          filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.65)) brightness(0.98)',
        }}
      />
    </div>

    {/* NORTE (Center) */}
    <div
      className="absolute top-0 h-full overflow-visible pointer-events-none"
      style={{ ...PANE_CLIP, left: 'var(--stage-w)', width: 'var(--stage-w)' }}
    >
      <NorthZone
        onQuestClick={() => onActivateTarget('PROJECTS')}
        onContactClick={() => onActivateTarget('CONTACT')}
        onCreditsClick={() => onActivateTarget('PROCESS')}
        onRecruiterClick={() => onActivateTarget('RECRUITER')}
        onProfileClick={() => onActivateTarget('IDENTITY')}
        targetStates={targetStates}
        activeIndex={activeIndex}
        triggerAnimation={enableAnimations}
      />
      <HorizonMask translateY="-80px" />
    </div>

    {/* ESTE (Right) */}
    <div
      className="absolute top-0 h-full overflow-visible pointer-events-none"
      style={{ ...PANE_CLIP, left: 'calc(var(--stage-w) * 2)', width: 'var(--stage-w)' }}
    >
      <EastZone
        onHeroClick={() => onActivateTarget('STACK')}
        activeIndex={activeIndex}
        targetState={targetStates.STACK}
      />
      <HorizonMask translateY="-60px" />
    </div>
  </div>
));
