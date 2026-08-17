import React from 'react';
import { motion } from 'framer-motion';
import { FluentSearchIcon } from '../icons/FluentSearchIcon';
import { NotificationIcon } from '../icons/NotificationIcon';
import { WindowsIcon } from '../WindowsIcon';

interface SystemHubProps {
  onSearchClick: () => void;
  onWindowsClick: () => void;
  onNotificationsClick: () => void;
  notificationCount: number;
  isSearchActive: boolean;
  isNotificationsActive: boolean;
  size?: number;
}

export const SystemHub: React.FC<SystemHubProps> = ({
  onSearchClick,
  onWindowsClick,
  onNotificationsClick,
  notificationCount,
  isSearchActive,
  isNotificationsActive,
  size = 72,
}) => {
  const height = size;
  const buttonWidth = size * 0.82; 

  return (
    <motion.div
      className="relative flex items-center justify-center bg-black/25 backdrop-blur-2xl rounded-[26px] px-1.5 overflow-hidden"
      style={{ 
        height,
        boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.15), 0 12px 32px -6px rgba(0, 0, 0, 0.65)'
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-60 pointer-events-none" />

      {/* --- SEARCH BUTTON --- */}
      <HubButton 
        onClick={onSearchClick} 
        isActive={isSearchActive}
        width={buttonWidth}
        label="Buscar en VoyagerOS"
        glowColor="rgba(59, 130, 246, 0.5)"
      >
        <FluentSearchIcon size={24} color={isSearchActive ? "#60a5fa" : "white"} />
      </HubButton>

      {/* Divider */}
      <div className="h-6 w-px bg-white/10 mx-1" />

      {/* --- WINDOWS START BUTTON --- */}
      <div className="relative z-10 mx-0.5">
        <WindowsIcon 
          size={size * 0.82} 
          ref={null} 
        />
        <div 
          className="absolute inset-0 cursor-pointer rounded-full" 
          onClick={onWindowsClick}
          title="Menú Inicio (Windows)"
        />
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-white/10 mx-1" />

      {/* --- NOTIFICATIONS BUTTON --- */}
      <HubButton 
        onClick={onNotificationsClick} 
        isActive={isNotificationsActive}
        width={buttonWidth}
        label="Centro de Notificaciones"
        glowColor="rgba(244, 63, 94, 0.5)"
      >
        <div className="relative flex items-center justify-center">
          <NotificationIcon size={24} color={isNotificationsActive ? "#f43f5e" : "white"} />
          
          {notificationCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.9)] text-[9px] font-bold text-white leading-none"
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </motion.div>
          )}
        </div>
      </HubButton>
    </motion.div>
  );
};

interface HubButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
  width: number;
  label: string;
  glowColor: string;
}

const HubButton: React.FC<HubButtonProps> = ({ 
  children, 
  onClick, 
  isActive, 
  width, 
  label, 
  glowColor 
}) => {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`relative group flex items-center justify-center h-[calc(100%-8px)] rounded-[20px] transition-all duration-300 ${
        isActive ? 'bg-white/12 shadow-inner' : 'hover:bg-white/8'
      }`}
      style={{ width }}
    >
      {/* Dynamic Ambient Hover Glow */}
      <motion.div 
        className="absolute inset-1 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full"
        style={{ backgroundColor: glowColor, transform: 'translateY(4px)' }}
      />

      <motion.div
        whileHover={{ scale: 1.12, y: -2 }}
        whileTap={{ scale: 0.92 }}
        className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center"
      >
        {children}
      </motion.div>
      
      {isActive && (
        <motion.div 
          layoutId="active-hub-pill"
          className="absolute inset-0 rounded-[20px] bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  );
};
