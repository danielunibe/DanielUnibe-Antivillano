import React from 'react';
import { ASSETS } from '../../../config/assets';
import { useImageInteraction } from '../../../features/InteractionSystem';
import { useLocale } from '../../../features/profile/useLocale';
import { WorldTooltip } from '../../ui/WorldTooltip';
import type { TargetVisualState } from '../../../features/experience/types';

interface WestZoneProps {
  onMapClick: () => void;
  activeIndex?: number;
  targetState: TargetVisualState;
}

export const WestZone: React.FC<WestZoneProps> = React.memo(({ onMapClick, activeIndex = 0, targetState }) => {
  const { t } = useLocale();
  const tacticalMapInteraction = useImageInteraction(t('tacticalMap'), ASSETS.STRUCTURES.WEST_B);

  const handleWestZoneMapClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onMapClick();
  };

  return (
    <button
      type="button"
      aria-label={t('openTacticalMap')}
      tabIndex={activeIndex === 0 ? 0 : -1}
      className={[
        'world-target absolute left-0 z-[54]',
        'flex items-end justify-start',
        'cursor-pointer border-0 bg-transparent p-0 text-left',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00F0FF]',
        activeIndex === 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      ].join(' ')}
      data-target-state={targetState}
      onClick={handleWestZoneMapClick}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        event.stopPropagation();
        onMapClick();
      }}
      style={{
        // Anchored to the stage floor. -0.46 offset aligns with horizon-wrapper bottom.
        // 150px lift keeps the base above the floor edge as requested.
        bottom: 'calc(var(--stage-h) * -0.46 + 150px)',
        // Height fills ~95% of the visible stage. No scale() used — avoids
        // invisible overflow above var(--stage-h) that causes the top crop.
        height: 'calc(var(--stage-h) * 0.95)',
        left: '-150px',
        transformOrigin: 'bottom left',
      }}
    >
      <div
        className={[
          'relative h-full w-auto overflow-visible',
          'border-2 border-transparent',
          'transition-all duration-200',
          'hover:border-[#00F0FF] hover:shadow-[0_0_24px_rgba(0,240,255,0.45)]',
          tacticalMapInteraction.className,
        ].join(' ')}
        onMouseEnter={tacticalMapInteraction.onMouseEnter}
        onMouseLeave={tacticalMapInteraction.onMouseLeave}
      >
        <img
          src={ASSETS.STRUCTURES.WEST_B}
          alt="Pared Oeste"
          className="h-full w-auto max-w-none object-contain object-bottom select-none"
          draggable="false"
          decoding="async"
          style={{ filter: 'contrast(1.04)' }}
        />
        <span className="world-target-signal" aria-hidden="true" />
        <WorldTooltip
          title={t('lootMap')}
          subtitle={t('tacticalMap')}
          side="top"
          className="!bottom-[28%] !left-[60%]"
          state={targetState}
        />
      </div>
    </button>
  );
});
