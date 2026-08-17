import React from 'react';
import { motion } from 'framer-motion';
import { Turntable } from './Turntable';
import { useMusic } from '../contexts/MusicContext';
import { X, GripHorizontal } from 'lucide-react';

interface DesktopWidgetProps {
    initialX?: number;
    initialY?: number;
    onClose?: () => void;
}

export const DesktopWidget: React.FC<DesktopWidgetProps> = ({ initialX = 100, initialY = 100, onClose }) => {
    const { isPlaying, togglePlay, progress, songData } = useMusic();

    // === OPTICAL PHYSICS CONSTANTS ===
    const BASE_SIZE = 288; 
    const TARGET_SCALE = 0.7; // ~201px final size
    
    // Optical Math:
    // Dock Icon Visual Size = ~57.6px (72px * 0.8 inner scale)
    // Widget Visual Size = ~201.6px (288px * 0.7)
    // Entry Scale Ratio = 57.6 / 201.6 ≈ 0.2857
    const ENTRY_SCALE_RATIO = 0.286; 

    return (
        <motion.div 
            className="absolute z-40 flex flex-col items-center gap-4 group"
            style={{ 
                left: initialX, 
                top: initialY,
                transform: 'translate(-50%, -50%)',
                // Using 'touch-action: none' prevents browser scrolling while dragging on touch
                touchAction: 'none'
            }}
            // === LANDING ANIMATION ===
            // Start small and slightly rotated (momentum) -> Land flat and full size
            initial={{ opacity: 0, scale: ENTRY_SCALE_RATIO, rotate: -15, y: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, scale: ENTRY_SCALE_RATIO, rotate: 10, transition: { duration: 0.2 } }}
            
            // "Heavy" spring physics for a solid object feel
            transition={{ 
                type: 'spring', 
                stiffness: 380, 
                damping: 25, 
                mass: 1.2 
            }}
            
            drag
            dragMomentum={true} // Allow it to slide a bit after release
            dragElastic={0.1} // Resist dragging off screen
        >
            {/* Close / Return to Dock Button */}
            {onClose && (
                <button 
                    onClick={onClose}
                    className="absolute -top-8 -right-8 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:text-white hover:bg-red-500/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 scale-75 hover:scale-100 shadow-md"
                    title="Return to Dock"
                >
                    <X size={14} />
                </button>
            )}

            {/* Inner Scale Wrapper: Handles the final visual size of the Turntable */}
            <motion.div 
                className="relative cursor-grab active:cursor-grabbing"
                style={{ width: BASE_SIZE, height: BASE_SIZE }}
                // We keep the inner content at TARGET_SCALE always, the outer div handles the entry zoom
                initial={{ scale: TARGET_SCALE }} 
                animate={{ scale: TARGET_SCALE }}
            >
                {/* Turntable Container */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="pointer-events-auto relative">
                        {/* 
                            Dynamic Shadow Layer:
                            Simulates the object getting closer to the "desk" surface.
                            When dragged (lifted), shadow grows and blurs.
                        */}
                        <motion.div 
                            className="absolute inset-4 rounded-full bg-black"
                            initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.8 }}
                            animate={{ opacity: 0.6, filter: 'blur(30px)', scale: 1 }}
                            whileDrag={{ opacity: 0.4, filter: 'blur(50px)', scale: 1.1 }}
                        />

                        <Turntable 
                            isPlaying={isPlaying} 
                            onClick={togglePlay} 
                            scale={1} 
                            progress={progress}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Metadata Card - "Floating" below the widget */}
            <div className="flex flex-col items-center text-center -mt-8 pointer-events-none">
                <motion.div 
                    className="bg-black/60 backdrop-blur-3xl px-5 py-2.5 rounded-2xl flex items-center gap-3"
                    style={{
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.65), inset 0 1px 1.5px rgba(255, 255, 255, 0.15)'
                    }}
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring' }}
                >
                    <div className="flex flex-col text-left">
                        <h2 className="text-sm font-bold text-white tracking-wide leading-none">
                            {songData.title}
                        </h2>
                        <p className="text-white/50 text-[10px] font-medium tracking-wider uppercase mt-1">
                            {songData.artist}
                        </p>
                    </div>
                    
                    {/* Visual Drag Handle Indicator */}
                    <div className="h-6 w-px bg-white/10" />
                    <GripHorizontal size={16} className="text-white/20" />
                </motion.div>
            </div>
        </motion.div>
    );
};