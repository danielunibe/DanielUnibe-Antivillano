import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface ProfileBadgeProps {
  size?: number;
}

export const AVATAR_URL = "/assets/profile/daniel-unibe-portrait.webp";

export const ProfileBadge: React.FC<ProfileBadgeProps> = ({ size = 70 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.button
      className="relative flex items-center justify-center rounded-full focus:outline-none cursor-pointer p-0 select-none group"
      style={{ width: size, height: size }}
      whileHover={{ y: -6, scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 550, damping: 22 }}
      aria-label="Profile"
      title="Perfil de Usuario"
    >
      {/* AMBIENT GLOW ON HOVER */}
      {!imageError && (
        <div 
          className="absolute inset-0 rounded-full blur-[12px] opacity-0 group-hover:opacity-75 transition-opacity duration-150 pointer-events-none"
          style={{ 
            background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, rgba(59,130,246,0.4) 60%, transparent 80%)',
            transform: 'translateY(3px) scale(0.95)'
          }}
        />
      )}

      {/* AVATAR IMAGE CONTAINER */}
      <div
        className="w-full h-full rounded-full overflow-hidden z-10 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.45)] relative"
      >
        {!imageError ? (
          <>
            <img
              src={AVATAR_URL}
              alt="Profile"
              className={`w-full h-full object-cover transition-transform duration-200 group-hover:scale-106 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            {/* Subtle glass reflection highlight */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none rounded-full" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
            <User size={size * 0.45} className="text-white" />
          </div>
        )}
      </div>
    </motion.button>
  );
};

