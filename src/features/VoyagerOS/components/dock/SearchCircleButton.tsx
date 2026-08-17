import React from 'react';
import { motion } from 'framer-motion';
import { FluentSearchIcon } from '../icons/FluentSearchIcon';

interface SearchCircleButtonProps {
  onClick: () => void;
  isActive: boolean;
  size?: number;
}

export const SearchCircleButton: React.FC<SearchCircleButtonProps> = ({
  onClick,
  isActive,
  size = 58,
}) => {
  const iconSize = Math.max(14, Math.round(size * 0.48));

  return (
    <motion.button
      onClick={onClick}
      aria-label="Buscar en VoyagerOS"
      title="Buscar en VoyagerOS"
      whileHover={{ y: -5, scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className={`relative flex items-center justify-center rounded-full transition-all duration-300 group cursor-pointer ${
        isActive ? 'bg-blue-600/30' : 'bg-black/25 hover:bg-black/35'
      } backdrop-blur-2xl`}
      style={{
        width: size,
        height: size,
        boxShadow: isActive
          ? '0 0 20px rgba(59, 130, 246, 0.4), inset 0 1px 1.5px rgba(255, 255, 255, 0.25)'
          : '0 10px 25px -5px rgba(0, 0, 0, 0.5), inset 0 1px 1.5px rgba(255, 255, 255, 0.15)',
      }}
    >
      {/* Ambient hover glow */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(37,99,235,0.3) 60%, transparent 80%)',
          transform: 'translateY(4px)'
        }}
      />

      <div className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform group-hover:scale-108">
        <FluentSearchIcon size={iconSize} color={isActive ? "#60a5fa" : "white"} />
      </div>
    </motion.button>
  );
};
