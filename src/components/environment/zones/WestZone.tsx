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

  const isVerified = targetState === 'verified';
  const glowColor = isVerified ? 'rgba(0, 240, 255, 0.9)' : 'rgba(242, 208, 25, 0.9)';
  const activeGlowColor = isVerified ? '#00F0FF' : '#FFE94D';

  return (
    <div
      className="absolute left-0 z-[54] flex items-end justify-start pointer-events-none select-none"
      style={{
        bottom: 'calc(var(--stage-h) * -0.46 + 150px)',
        height: 'calc(var(--stage-h) * 0.95)',
        left: '-150px',
        transformOrigin: 'bottom left',
      }}
    >
      <div className="relative h-full w-auto overflow-visible pointer-events-none">
        {/* Estructura Base: Pared Oeste (Decorativa, no interactiva) */}
        <img
          src={ASSETS.STRUCTURES.WEST_B}
          alt="Pared Oeste"
          className="h-full w-auto max-w-none object-contain object-bottom select-none pointer-events-none"
          draggable="false"
          decoding="async"
          style={{ filter: 'contrast(1.04)' }}
        />

        {/* Estructura Base: Letrero (Decorativo, no interactivo) */}
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

        {/* Único punto interactivo: Botón del Mapa (mapa.png) */}
        <button
          type="button"
          aria-label={t('openTacticalMap')}
          tabIndex={activeIndex === 0 ? 0 : -1}
          className={[
            'world-target absolute z-[10] group pointer-events-auto cursor-pointer border-0 bg-transparent p-0 text-left',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00F0FF]',
            activeIndex === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none',
            tacticalMapInteraction.className,
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
          }}
        >
          {/* Halo de resplandor exterior dinámico */}
          <div
            className="absolute inset-0 -m-3 rounded-lg opacity-0 transition-all duration-300 pointer-events-none group-hover:opacity-100 group-active:opacity-100 group-active:scale-105"
            style={{
              background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 75%)`,
              filter: 'blur(12px)',
            }}
          />

          {/* Imagen del mapa con iluminación de silueta/bordes al hacer hover y click */}
          <img
            src={ASSETS.STRUCTURES.MAPA}
            alt="Mapa"
            className="relative z-10 h-full w-auto select-none transition-all duration-300 group-hover:scale-[1.03] group-active:scale-[0.98]"
            draggable="false"
            decoding="async"
            style={{
              objectFit: 'contain',
              filter: `drop-shadow(0 4px 12px rgba(0,0,0,0.7))`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = `drop-shadow(0 0 10px ${glowColor}) drop-shadow(0 0 22px ${glowColor}) brightness(1.12)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = `drop-shadow(0 4px 12px rgba(0,0,0,0.7))`;
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.filter = `drop-shadow(0 0 16px ${activeGlowColor}) drop-shadow(0 0 34px ${activeGlowColor}) brightness(1.3)`;
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.filter = `drop-shadow(0 0 10px ${glowColor}) drop-shadow(0 0 22px ${glowColor}) brightness(1.12)`;
            }}
          />

          <span className="world-target-signal" aria-hidden="true" />
          <WorldTooltip
            title={t('lootMap')}
            subtitle={t('tacticalMap')}
            side="top"
            className="!bottom-[95%] !left-1/2 -translate-x-1/2"
            state={targetState}
          />
        </button>
      </div>
    </div>
  );
});
