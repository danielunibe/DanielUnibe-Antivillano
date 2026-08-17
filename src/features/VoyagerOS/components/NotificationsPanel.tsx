import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Trash2, X } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsPanelProps {
  style?: React.CSSProperties;
  notifications: Notification[];
  onClear: () => void;
  onDismiss: (id: number) => void;
}

export const NotificationsPanel = forwardRef<HTMLDivElement, NotificationsPanelProps>(({ style, notifications, onClear, onDismiss }, ref) => {
  return (
    <motion.div
      ref={ref}
      style={{
          ...style,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 1.5px rgba(255, 255, 255, 0.15)'
      }}
      tabIndex={-1}
      className="absolute bottom-[calc(100%+20px)] rounded-2xl bg-neutral-950/80 backdrop-blur-3xl p-4 text-white flex flex-col gap-2"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <div className="flex justify-between items-center px-1">
        <h3 className="font-semibold text-base">Notifications</h3>
        {notifications.length > 0 && (
            <button 
              onClick={onClear} 
              className="p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Clear all notifications"
            >
                <Trash2 size={16} className="text-white/70" />
            </button>
        )}
      </div>

      <div className="max-h-[300px] overflow-y-auto pr-1">
        <AnimatePresence>
          {notifications.length > 0 ? (
            <motion.div layout className="flex flex-col gap-2">
              {notifications.map((notif, i) => (
                <motion.div
                  key={notif.id}
                  className="bg-white/5 rounded-xl p-3 relative group-notification pr-8"
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                  exit={{ opacity: 0, x: -25 }}
                >
                  <p className="font-semibold text-sm leading-tight">{notif.title}</p>
                  <p className="text-xs text-white/80 mt-1 leading-normal">{notif.message}</p>
                  <button
                    onClick={() => onDismiss(notif.id)}
                    className="absolute top-2 right-2 p-0.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer"
                    title="Dismiss"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4 gap-2 w-48">
                <Bell size={24} className="text-white/50" />
                <p className="text-sm text-white/70">No new notifications.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      <div
        className="absolute left-1/2 h-4 w-4 bg-neutral-950/80"
        style={{
            transform: 'translateX(-50%) rotate(45deg)',
            bottom: '-7px',
            backdropFilter: 'blur(40px)', 
            WebkitBackdropFilter: 'blur(40px)',
        }}
      />
    </motion.div>
  );
});

NotificationsPanel.displayName = 'NotificationsPanel';
