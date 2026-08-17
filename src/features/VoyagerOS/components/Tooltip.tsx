import React, { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  enableJumpAnimation?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ label, children, enableJumpAnimation = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isHovered && ref.current) {
      const updatePosition = () => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setPosition({
          // Position above the element (rect.top) minus a gap
          top: rect.top - 12, 
          left: rect.left + rect.width / 2,
        });
      };

      updatePosition();
      // Add listeners to keep tooltip attached during interactions
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isHovered]);

  const animationProps = enableJumpAnimation
    ? {
        whileHover: { y: -12, scale: 1.15 },
        transition: { type: 'spring' as const, stiffness: 400, damping: 15 },
      }
    : {};

  return (
    <>
      <motion.div
        ref={ref}
        className="flex items-center justify-center origin-bottom relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        {...animationProps}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {isHovered &&
          createPortal(
            <motion.div
              className="fixed px-3.5 py-1.5 rounded-xl bg-neutral-900/90 backdrop-blur-xl shadow-[0_12px_28px_rgba(0,0,0,0.6)] whitespace-nowrap pointer-events-none z-[9999]"
              style={{
                top: position.top,
                left: position.left,
                transform: 'translate(-50%, -100%)',
              }}
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <span className="text-white text-xs font-medium tracking-wide antialiased">{label}</span>
              
              {/* Visual Arrow Indicator */}
              <div 
                className="absolute left-1/2 bottom-[-4px] w-2 h-2 bg-neutral-900/90 backdrop-blur-xl"
                style={{ transform: 'translateX(-50%) rotate(45deg)' }}
              />
            </motion.div>,
            document.body
          )}
      </AnimatePresence>
    </>
  );
};