import React from 'react';
import { Turntable } from './Turntable';
import { useMusic } from '../contexts/MusicContext';

interface MusicPlayerPillProps {
  size?: number;
  onClick?: () => void;
  isOpen?: boolean;
}

export const MusicPlayerPill: React.FC<MusicPlayerPillProps> = ({ size = 72, onClick, isOpen }) => {
  const { isPlaying, progress } = useMusic();
  
  // CONSTANTS
  const BASE_SIZE = 288; // Original size of Turntable component
  
  // SCALING LOGIC
  // Adjusted to 0.8 (approx 57.6px for a 72px slot).
  // This optical adjustment makes the solid Turntable shape appear 
  // balanced against the ~61px irregular App icons.
  const visualSize = size * 0.8; 
  const scale = visualSize / BASE_SIZE;

  return (
    <button 
        className="relative flex items-center justify-center group rounded-2xl transition-colors duration-200 hover:bg-white/10" 
        style={{ width: size, height: size }}
        onClick={onClick}
        aria-label="Music Player Widget"
    >
        {/* 
            Container for the Turntable.
            We center it absolutely. The Turntable itself handles the scaling via transform.
        */}
        <div className="absolute top-1/2 left-1/2 w-[288px] h-[288px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <Turntable 
                isPlaying={isPlaying} 
                scale={scale}
                progress={progress}
                className="pointer-events-none origin-center shadow-md" 
            />
        </div>

        {/* Active State Indicator (Small glow below) */}
        {isOpen && (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_4px_white] z-10" />
        )}
    </button>
  );
};