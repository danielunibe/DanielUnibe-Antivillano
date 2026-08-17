import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlatDockButtonProps {
  label: string;
  children: React.ReactNode;
  sizePx?: number;
  badgeCount?: number;
  onClick?: () => void;
  disabled?: boolean;
  shape?: 'circle' | 'rounded-square';
}

export const FlatDockButton = forwardRef<HTMLButtonElement, FlatDockButtonProps>(
  ({ label, children, sizePx = 44, badgeCount = 0, onClick, disabled, shape = 'circle' }, ref) => {
    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';
    
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        title={label}
        className={`relative flex items-center justify-center ${shapeClass} bg-transparent hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:bg-black/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
        style={{ width: sizePx, height: sizePx }}
      >
        {children}
         <AnimatePresence>
          {badgeCount > 0 && (
            <motion.div
              className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-xs font-bold text-white shadow-lg"
              style={{ transform: 'translate(30%, -30%)' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              {badgeCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    );
  }
);

FlatDockButton.displayName = 'FlatDockButton';
