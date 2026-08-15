import React from 'react';
import { ASSETS } from '../../../config/assets';
import { useImageInteraction } from '../../../features/InteractionSystem';
import { useLocale } from '../../../features/profile/useLocale';
import { CastShadow } from '../../effects/shadows/CastShadow';
import { WorldTooltip } from '../../ui/WorldTooltip';
import { BarrelSmoke } from '../BarrelSmoke';
import { RUNTIME_FLAGS } from '../../../config/runtimeFlags';
import type { TargetVisualState } from '../../../features/experience/types';

interface EastZoneProps {
  onHeroClick: () => void;
  activeIndex?: number;
  targetState: TargetVisualState;
}

export const EastZone: React.FC<EastZoneProps> = React.memo(({ onHeroClick, activeIndex = 2, targetState }) => {
  const { t } = useLocale();
  const eastHeroInteraction = useImageInteraction(t('technicalStack'), ASSETS.PROPS.HERO);

  const handleHeroClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onHeroClick();
  };

  const handleHeroKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    e.stopPropagation();
    onHeroClick();
  };

  return (
    <>
      {/* Background landscape */}
      <div className="absolute left-0 top-0 h-full w-full z-[10] flex items-end justify-center overflow-visible pointer-events-none">
        <img
          src={ASSETS.BG.EAST}
          alt="Paisaje Este"
          className="h-full w-auto object-contain object-bottom select-none"
          style={{
            transform: 'translate(calc(var(--stage-w) * -0.03 + 30%), calc(var(--stage-h) * 0.02 - 6px)) scale(1.18)',
            transformOrigin: 'bottom center',
            filter: 'saturate(1.14) contrast(1.08) blur(3px)',
          }}
        />
      </div>

      {/* Barrel with smoke effect */}
      {RUNTIME_FLAGS.ENABLE_PARTICLES && (
        <div className="absolute left-[44%] bottom-0 z-[86] flex items-end justify-center pointer-events-none">
          <div
            className="pointer-events-auto relative"
            style={{ transform: 'translateX(-50%) translateY(calc(var(--stage-h) * 0.18)) scale(0.78)', animationDelay: '0.3s' }}
          >
            <CastShadow
              shadowSrc="/assets/world/interactive/040_fr9bz6g.png"
              debugId="BARREL"
              enableDebug={true}
              height="calc(var(--stage-h) * 0.7)"
              initialConfig={{ perspective: 1140, rotateX: 44, skewX: -9, scaleY: 1.33, x: -1, y: 1.3, blur: 1.5, opacity: 0.8 }}
            >
              <BarrelSmoke />
            </CastShadow>
          </div>
        </div>
      )}

      {/* Hero interactive target — ARSENAL / TECHNICAL STACK */}
      <div className="absolute left-[9%] bottom-0 z-[118] flex items-end justify-center pointer-events-none">
        <button
          type="button"
          aria-label={t('openTechnicalStack')}
          tabIndex={activeIndex === 2 ? 0 : -1}
          className={[
            'world-target relative group pointer-events-auto cursor-pointer border-0 bg-transparent p-0 text-left',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00F0FF]',
            activeIndex === 2 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
          ].join(' ')}
          data-target-state={targetState}
          style={{
            height: 'calc(var(--stage-h) * 0.32)',
            transform: 'translateY(calc(var(--stage-h) * 0.215))',
          }}
          onClick={handleHeroClick}
          onKeyDown={handleHeroKeyDown}
          onMouseEnter={eastHeroInteraction.onMouseEnter}
          onMouseLeave={eastHeroInteraction.onMouseLeave}
        >
          <div className="absolute inset-0 bg-[#F2D019]/0 group-hover:bg-[#F2D019]/15 rounded-full blur-2xl transition-all duration-500" />
          <img
            src={ASSETS.PROPS.HERO}
            alt="Hero Este"
            className={`relative z-10 h-full w-auto object-contain object-bottom select-none transition-all duration-300 group-hover:brightness-125 group-hover:scale-[1.06] ${eastHeroInteraction.className}`}
          />
          <span className="world-target-signal" aria-hidden="true" />
          <WorldTooltip title={t('arsenal')} subtitle={t('technicalStack')} side="top" state={targetState} />
        </button>
      </div>

      {/* Transition base structure */}
      <div className="absolute left-0 bottom-0 z-[58] flex w-full items-end justify-end pointer-events-none">
        <img
          src={ASSETS.STRUCTURES.STONE_MESH}
          alt="Estructura Base Norte-Este"
          className="object-contain object-bottom select-none"
          style={{
            height: 'calc(var(--stage-h) * 0.46)',
            transform: 'translateX(calc(var(--stage-w) * 0.18)) translateY(calc(var(--stage-h) * 0.18 + 30px))',
            maxWidth: 'none',
            filter: 'brightness(0.76) contrast(1.2)',
          }}
        />
      </div>

      {/* Gateway transition */}
      <div className="absolute left-0 bottom-0 z-[28] flex w-full items-end justify-start pointer-events-none">
        <img
          src={ASSETS.BG.TRANSITION}
          alt="Estructura Transición"
          className="object-contain object-bottom select-none opacity-90"
          style={{
            height: 'calc(var(--stage-h) * 0.7)',
            transform: 'translateX(calc(var(--stage-w) * -0.42)) translateY(calc(var(--stage-h) * 0.17))',
            maxWidth: 'none',
            filter: 'brightness(0.62) contrast(1.18)',
          }}
        />
      </div>

      {/* East wall — right edge, mirrors WestZone pattern */}
      <div
        className="absolute z-[54] flex items-end justify-end pointer-events-none"
        style={{
          bottom: 'calc(var(--stage-h) * -0.46 + 150px)',
          height: 'calc(var(--stage-h) * 0.95)',
          right: '-150px',
          transformOrigin: 'bottom right',
        }}
      >
        <img
          src={ASSETS.STRUCTURES.EAST_WALL}
          alt="Pared Este"
          className="h-full w-auto max-w-none object-contain object-bottom select-none"
          draggable="false"
          decoding="async"
          style={{ filter: 'contrast(1.04)' }}
        />
      </div>
    </>
  );
});
