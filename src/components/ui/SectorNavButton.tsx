import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SECTOR_FRAME_COUNT, getSectorFrame, ASSETS } from '../../config/assets';
import type { SectorId } from '../../features/experience/types';

export interface SectorNavButtonProps {
  sector: SectorId;
  onClick: () => void;
  disabled?: boolean;
  muted?: boolean;
  className?: string;
  ariaLabel?: string;
  title?: string;
}

interface SectorAnimConfig {
  staticFrame: number;
  pressStart: number;
  pressEnd: number;
}

const SECTOR_CONFIG: Record<SectorId, SectorAnimConfig> = {
  NORTH: {
    staticFrame: 0,
    pressStart: 0,
    pressEnd: 21,
  },
  WEST: {
    staticFrame: 0,
    pressStart: 24,
    pressEnd: 50,
  },
  EAST: {
    staticFrame: 0,
    pressStart: 58,
    pressEnd: 85,
  },
};

const STEP_MS = 1000 / 50; // ~20ms per frame for snappy, tactile mechanical feedback

export const SectorNavButton: React.FC<SectorNavButtonProps> = ({
  sector,
  onClick,
  disabled = false,
  muted = false,
  className,
  ariaLabel,
  title,
}) => {
  const config = SECTOR_CONFIG[sector] ?? SECTOR_CONFIG.NORTH;
  const [frame, setFrame] = useState(config.staticFrame);
  const [pressing, setPressing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pressingRef = useRef(false);
  const frameRef = useRef(config.staticFrame);
  const lastTriggerTimeRef = useRef(0);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setStatic = useCallback(() => {
    stopTimer();
    frameRef.current = config.staticFrame;
    setFrame(config.staticFrame);
  }, [config.staticFrame, stopTimer]);

  // Preload and warm frames for the sector
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(ASSETS.SOUNDS.CLICK);
      audio.preload = 'auto';
      audioRef.current = audio;
    }

    // Warm-decode frames for instant press response
    for (let i = 0; i < SECTOR_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getSectorFrame(sector, i);
      img.decode?.().catch(() => undefined);
    }

    setStatic();

    return () => {
      stopTimer();
    };
  }, [sector, setStatic, stopTimer]);

  const handleTrigger = useCallback(() => {
    const now = Date.now();
    if (disabled || pressingRef.current || now - lastTriggerTimeRef.current < 300) return;
    lastTriggerTimeRef.current = now;
    pressingRef.current = true;
    setPressing(true);
    stopTimer();

    // Crisp click sound
    if (!muted && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => undefined);
    }

    frameRef.current = config.pressStart;
    setFrame(config.pressStart);

    timerRef.current = setInterval(() => {
      const next = frameRef.current + 1;
      if (next > config.pressEnd) {
        stopTimer();
        pressingRef.current = false;
        setPressing(false);
        setStatic();
        return;
      }
      frameRef.current = next;
      setFrame(next);
    }, STEP_MS);

    onClick();
  }, [config.pressEnd, config.pressStart, disabled, muted, onClick, setStatic, stopTimer]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      if (pressingRef.current || disabled) return;
      event.preventDefault();
      handleTrigger();
    },
    [disabled, handleTrigger],
  );

  return (
    <button
      type="button"
      className={`world-nav-btn sector-nav-btn sector-nav-btn-${sector.toLowerCase()} ${className ?? ''}`}
      onClick={handleTrigger}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={pressing}
      title={title}
    >
      <img
        className="sector-nav-btn-frame"
        src={getSectorFrame(sector, frame)}
        alt=""
        draggable={false}
      />
    </button>
  );
};
