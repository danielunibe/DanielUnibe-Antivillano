import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VirtualCursorProps {
  isRunning: boolean;
  targetPosition: { x: number; y: number };
  onComplete: () => void;
}

export const VirtualCursor: React.FC<VirtualCursorProps> = ({
  isRunning,
  targetPosition,
  onComplete
}) => {
  const [phase, setPhase] = useState<'idle' | 'moving' | 'clicking' | 'done'>('idle');

  useEffect(() => {
    if (!isRunning) {
      setPhase('idle');
      return;
    }

    setPhase('moving');

    // Fase 1: Movimiento suave hacia el objetivo (duración ~650ms)
    const clickTimer = setTimeout(() => {
      setPhase('clicking');

      // Fase 2: Simulación de Click y apertura (~250ms)
      const completeTimer = setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 250);

      return () => clearTimeout(completeTimer);
    }, 650);

    return () => clearTimeout(clickTimer);
  }, [isRunning, onComplete]);

  if (!isRunning || phase === 'done') return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 pointer-events-none z-[9999] overflow-hidden">
        <motion.div
          initial={{ 
            x: 80, 
            y: 80, 
            opacity: 0, 
            scale: 0.9 
          }}
          animate={{ 
            x: targetPosition.x, 
            y: targetPosition.y, 
            opacity: 1, 
            scale: phase === 'clicking' ? 0.85 : 1 
          }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
          transition={{
            x: { duration: 0.65, ease: [0.25, 1, 0.5, 1] },
            y: { duration: 0.65, ease: [0.25, 1, 0.5, 1] },
            opacity: { duration: 0.2 },
            scale: { duration: 0.12 }
          }}
          className="absolute top-0 left-0 -translate-x-1 -translate-y-1"
        >
          {/* Puntero Virtual de Fósforo Amarillo */}
          <div className="relative">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="drop-shadow-[0_0_10px_rgba(242,208,25,0.95)]"
            >
              <path 
                d="M3 3L10.5 21L13.5 13.5L21 10.5L3 3Z" 
                fill="#F2D019" 
                stroke="#000000" 
                strokeWidth="1.5" 
                strokeLinejoin="round"
              />
            </svg>

            {/* Pulso y Onda Expansiva al Simular Click */}
            {phase === 'clicking' && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0.9 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute -top-2 -left-2 w-7 h-7 rounded-full border-2 border-[#F2D019] bg-[#F2D019]/30 blur-[1px]"
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
