import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';

const BASE_GAP = 2;
const SEP_GAP = 3.5;
const BASE_OFFSET = 0;
const SEP_OFFSET = 1.2;

const squares = [
  { base: '#F25022', glow: 'rgba(242, 80, 34, 0.85)', xBase: -BASE_OFFSET, yBase: -BASE_OFFSET, xSep: -SEP_OFFSET, ySep: -SEP_OFFSET },
  { base: '#7FBA00', glow: 'rgba(127, 186, 0, 0.85)',  xBase:  BASE_OFFSET, yBase: -BASE_OFFSET, xSep:  SEP_OFFSET, ySep: -SEP_OFFSET },
  { base: '#00A4EF', glow: 'rgba(0, 164, 239, 0.85)', xBase: -BASE_OFFSET, yBase:  BASE_OFFSET, xSep: -SEP_OFFSET, ySep:  SEP_OFFSET },
  { base: '#FFB900', glow: 'rgba(255, 185, 0, 0.85)', xBase:  BASE_OFFSET, yBase:  BASE_OFFSET, xSep:  SEP_OFFSET, ySep:  SEP_OFFSET }
];

interface WindowsIconProps {
  size?: number;
  onClick?: () => void;
}

export const WindowsIcon = forwardRef<HTMLButtonElement, WindowsIconProps>(({ size = 48, onClick }, ref) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const squareSize = Math.max(9, Math.floor(size * 0.32)); 
  const gapScale = size / 48; 

  const handlePointerDown = () => {
    setPressed(true);
  };

  const handlePointerUp = () => {
    setPressed(false);
  };

  return (
    <motion.button
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setPressed(false)}
      onClick={onClick}
      aria-label="Windows Start"
      title="Menú Inicio (Windows)"
      className="relative flex items-center justify-center rounded-2xl bg-black/25 hover:bg-black/35 backdrop-blur-2xl focus:outline-none group cursor-pointer select-none transition-colors duration-200"
      style={{ 
        width: size, 
        height: size,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), inset 0 1px 1.5px rgba(255, 255, 255, 0.15)'
      }}
      whileHover={{ y: -5, scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 500, damping: 24 }}
    >
      {/* Background ambient glow on hover */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-85 transition-opacity duration-200 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,164,239,0.6) 0%, rgba(242,80,34,0.4) 50%, transparent 80%)',
          transform: 'translateY(3px)'
        }}
      />

      <motion.div
        className="grid grid-cols-2 relative z-10"
        style={{ padding: 4 }}
        animate={{
          gap: pressed ? 1 : (hovered ? SEP_GAP * gapScale : BASE_GAP * gapScale),
          scale: pressed ? 0.92 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      >
        {squares.map((s, i) => (
          <div key={i} className="relative">
            {/* AMBIENT DARKENED SHADOW */}
            <div 
              className="absolute inset-0 blur-[3px] opacity-40 pointer-events-none"
              style={{ 
                backgroundColor: s.glow,
                transform: 'translateY(2px) scale(0.95)',
                borderRadius: '3px'
              }}
            />
            
            {/* DYNAMIC HOVER SHADOW */}
            <motion.div 
              className="absolute inset-0 blur-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              animate={{
                backgroundColor: s.glow,
                y: hovered ? (pressed ? 2 : 6) : 3,
                scale: hovered ? (pressed ? 0.9 : 1.15) : 0.8
              }}
              style={{ borderRadius: '3px' }}
            />
            
            {/* THE SQUARE ITSELF - ANIMATES TOGETHER IN DIRECT UNISON ON CLICK AND RELEASE */}
            <motion.div
              style={{ width: squareSize, height: squareSize, backgroundColor: s.base }}
              initial={false}
              animate={{
                x: pressed ? 0 : (hovered ? s.xSep * gapScale : s.xBase * gapScale),
                y: pressed ? 0 : (hovered ? s.ySep * gapScale : s.yBase * gapScale),
                borderRadius: pressed ? '2px' : '3px',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="relative z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
            />
          </div>
        ))}
      </motion.div>
    </motion.button>
  );
});

WindowsIcon.displayName = 'WindowsIcon';

