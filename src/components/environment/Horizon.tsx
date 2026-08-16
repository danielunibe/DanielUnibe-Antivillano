import React from 'react';
import { ASSETS } from '../../config/assets';
import { WestZone, NorthZone, EastZone } from './HorizonZones';
import { SandFog } from '../effects/SandFog';
import { RUNTIME_FLAGS } from '../../config/runtimeFlags';
import type { TargetVisualState, WorldTargetId } from '../../features/experience/types';

interface HorizonProps {
  onActivateTarget: (targetId: WorldTargetId) => void;
  targetStates: Readonly<Record<WorldTargetId, TargetVisualState>>;
  activeIndex: number;
  enableAnimations: boolean;
  scrollRef: React.MutableRefObject<number>;
}

/** Clip style: prevents hard horizontal cuts between panes without creating scroll. */
const PANE_CLIP: React.CSSProperties = {
  clipPath: 'inset(-120% -120% -120% -120%)',
};



export const Horizon: React.FC<HorizonProps> = React.memo(({
  onActivateTarget,
  targetStates,
  activeIndex,
  enableAnimations,
  scrollRef,
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
    {/* Niebla: delante del avión (z-5) pero detrás de máscaras y zonas */}
    {RUNTIME_FLAGS.ENABLE_FOG && <SandFog scrollRef={scrollRef} />}
    {/* OESTE (Left) */}
    <div
      className="absolute left-0 top-0 h-full overflow-visible pointer-events-none"
      style={{ ...PANE_CLIP, width: 'var(--stage-w)' }}
    >
      {/* Avión en el fondo detrás de las montañas en el lado más izquierdo */}
      <img
        src={ASSETS.BG.AVION}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute bottom-[-10px] left-1/2 z-[5] w-[92%] max-w-[1440px] object-contain object-bottom select-none pointer-events-none opacity-90"
        style={{
          filter: 'contrast(1.02) brightness(0.95)',
          transform: 'translateX(calc(-50% + 100px))',
        }}
      />
      <WestZone
        onMapClick={() => onActivateTarget('LOOT_MAP')}
        activeIndex={activeIndex}
        targetState={targetStates.LOOT_MAP}
      />
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
          height: 'calc(var(--stage-h) * 1.56)',
          maxWidth: 'none',
          filter: 'none',
        }}
      />
    </div>

    {/* SEAM: Container structure between North (Center) and East (Right) */}
    <div
      className="absolute bottom-0 z-[25] flex items-end justify-center pointer-events-none select-none"
      style={{
        left: 'calc(var(--stage-w) * 2 + 2%)',
        transform: 'translateX(calc(-50% - 500px)) translateY(calc(var(--stage-h) * 0.08 + 250px))',
      }}
    >
      <img
        src={ASSETS.STRUCTURES.CONTAINER}
        alt="Container"
        draggable={false}
        className="object-contain object-bottom select-none"
        style={{
          height: 'calc(var(--stage-h) * 1.1)',
          maxWidth: 'none',
          filter: 'none',
          transform: 'scale(0.665)',
          transformOrigin: 'bottom center',
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
    </div>
  </div>
));
