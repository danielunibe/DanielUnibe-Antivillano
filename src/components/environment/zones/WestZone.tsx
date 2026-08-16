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
  const tacticalMapInteraction = useImageInteraction(t('tacticalMap'), ASSETS.STRUCTURES.MAPA);

  const handleWestZoneMapClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onMapClick();
  };

  return (
    <div
      className="absolute left-0 z-[54] flex items-end justify-start pointer-events-none select-none"
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
      <div className="relative h-full w-auto overflow-visible pointer-events-none">
        <img
          src={ASSETS.STRUCTURES.WEST_B}
          alt="Pared Oeste"
          className="h-full w-auto max-w-none object-contain object-bottom select-none pointer-events-none"
          draggable="false"
          decoding="async"
          style={{ filter: 'contrast(1.04)' }}
        />
        <img
          src={ASSETS.STRUCTURES.LETRERO}
          alt="Letrero"
          className="pointer-events-none absolute select-none"
          draggable="false"
          decoding="async"
          style={{
            left: '50%',
            bottom: '0px',
            height: '38%',
            width: 'auto',
            objectFit: 'contain',
            transform: 'translateX(calc(-50% + 350px)) rotate(-3deg)',
          }}
        />

        {/* Solo la imagen mapa.png es el botón interactivo que abre el mapa y se ilumina en los bordes */}
        <button
          type="button"
          aria-label={t('openTacticalMap')}
          tabIndex={activeIndex === 0 ? 0 : -1}
          className={[
            'world-target group map-target-button absolute pointer-events-auto cursor-pointer border-0 bg-transparent p-0 select-none',
            'focus-visible:outline-none',
            tacticalMapInteraction.className,
            activeIndex === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none',
          ].join(' ')}
          data-target-state={targetState}
          onClick={handleWestZoneMapClick}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            event.stopPropagation();
            onMapClick();
          }}
          onMouseEnter={tacticalMapInteraction.onMouseEnter}
          onMouseLeave={tacticalMapInteraction.onMouseLeave}
          style={{
            left: '50%',
            bottom: '0px',
            height: '38%',
            width: 'auto',
            transform: 'translateX(calc(-50% + 350px)) rotate(-3deg)',
            zIndex: 10,
          }}
        >
          <img
            src={ASSETS.STRUCTURES.MAPA}
            alt="Mapa"
            className="map-target-image h-full w-auto object-contain select-none pointer-events-none"
            draggable="false"
            decoding="async"
          />
          <span className="world-target-signal" aria-hidden="true" />
          <WorldTooltip
            title={t('lootMap')}
            subtitle={t('tacticalMap')}
            side="top"
            className="!bottom-[95%] !left-[50%]"
            state={targetState}
          />
        </button>
      </div>
    </div>
  );
});
