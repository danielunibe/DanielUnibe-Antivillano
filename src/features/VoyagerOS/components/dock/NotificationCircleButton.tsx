import React from 'react';
import { motion } from 'framer-motion';
import { NotificationIcon } from '../icons/NotificationIcon';

interface NotificationCircleButtonProps {
  onClick: () => void;
  isActive: boolean;
  notificationCount: number;
  size?: number;
}

export const NotificationCircleButton: React.FC<NotificationCircleButtonProps> = ({
  onClick,
  isActive,
  notificationCount,
  size = 58,
}) => {
  const iconSize = Math.max(14, Math.round(size * 0.48));

  return (
    <motion.button
      onClick={onClick}
      aria-label="Centro de Notificaciones"
      title="Centro de Notificaciones"
      whileHover={{ y: -5, scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className={`relative flex items-center justify-center rounded-full transition-all duration-300 group cursor-pointer ${
        isActive ? 'bg-rose-600/30' : 'bg-black/25 hover:bg-black/35'
      } backdrop-blur-2xl`}
      style={{
        width: size,
        height: size,
        boxShadow: isActive
          ? '0 0 20px rgba(244, 63, 94, 0.4), inset 0 1px 1.5px rgba(255, 255, 255, 0.25)'
          : '0 10px 25px -5px rgba(0, 0, 0, 0.5), inset 0 1px 1.5px rgba(255, 255, 255, 0.15)',
      }}
    >
      {/* Ambient hover glow */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(244,63,94,0.6) 0%, rgba(225,29,72,0.3) 60%, transparent 80%)',
          transform: 'translateY(4px)'
        }}
      />

      <div className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform group-hover:scale-108">
        <NotificationIcon size={iconSize} color={isActive ? "#fb7185" : "white"} />
        
        {notificationCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-1 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.9)] text-[10px] font-bold text-white leading-none border-0"
          >
            {notificationCount > 9 ? '9+' : notificationCount}
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};
