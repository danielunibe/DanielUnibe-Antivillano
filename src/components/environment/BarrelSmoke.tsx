import React, { useRef } from 'react';
import { useImageInteraction } from '../../features/InteractionSystem';
import { useBarrelSmokeEffect } from './useBarrelSmokeEffect';

interface BarrelSmokeProps {
  onClick?: () => void;
}

export const BarrelSmoke: React.FC<BarrelSmokeProps> = React.memo(({ onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const interactionProps = useImageInteraction('BARREL', '/assets/world/interactive/040_fr9bz6g.png');

  useBarrelSmokeEffect(canvasRef.current);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`relative flex items-end justify-center group cursor-pointer ${interactionProps.className}`}
      style={{ width: 'calc(var(--stage-h) * 0.4)', height: 'calc(var(--stage-h) * 0.7)' }}
      onMouseEnter={interactionProps.onMouseEnter}
      onMouseLeave={interactionProps.onMouseLeave}
    >
      <canvas
        ref={canvasRef}
        className="absolute left-1/2 bottom-0 transform -translate-x-1/2 pointer-events-none"
        style={{ width: '100%', height: '100%', zIndex: 0 }}
      />
      <img
        src="/assets/world/interactive/040_fr9bz6g.png"
        alt="Barril Tóxico"
        className="relative z-10 w-[35%] h-[40%] object-contain object-bottom drop-shadow-[0_0_20px_rgba(255,69,0,0.4)] transition-all duration-300 group-hover:brightness-110"
        draggable="false"
      />
    </div>
  );
});
