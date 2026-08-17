import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppIconButtonProps {
    iconUrl: string;
    alt: string;
    size?: number;
    onClick?: (e: React.MouseEvent) => void;
}

const colorMapByAlt: Record<string, string> = {
    'Files': '#eab308',
    'Studio': '#ec4899',
    'Terminal': '#10b981',
    'Gallery': '#8b5cf6',
    'USB Drive': '#64748b'
};

export const AppIconButton: React.FC<AppIconButtonProps> = React.memo(({ iconUrl, alt, size = 56, onClick }) => {
    const imgSize = Math.floor(size * 0.85);
    const [isBouncing, setIsBouncing] = useState(false);
    const [showRipple, setShowRipple] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const bounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const rippleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const activeColor = colorMapByAlt[alt] || '#3b82f6';

    useEffect(() => {
        return () => {
            if (bounceTimeoutRef.current) clearTimeout(bounceTimeoutRef.current);
            if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
        };
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        setIsBouncing(true);
        setShowRipple(true);
        setIsRunning(true);
        
        if (bounceTimeoutRef.current) clearTimeout(bounceTimeoutRef.current);
        bounceTimeoutRef.current = setTimeout(() => {
            setIsBouncing(false);
        }, 650);

        if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
        rippleTimeoutRef.current = setTimeout(() => {
            setShowRipple(false);
        }, 800);

        if (onClick) {
            onClick(e);
        }
    };

    return (
        <motion.button 
            onClick={handleClick}
            className="relative flex items-center justify-center bg-transparent hover:bg-white/5 rounded-2xl transition-colors duration-200 group cursor-pointer"
            style={{ width: size, height: size }}
            animate={{ 
                y: isBouncing ? [0, -18, 2, -6, 0] : 0,
                scale: isBouncing ? [1, 0.86, 1.15, 0.94, 1.02, 1] : 1
            }}
            transition={isBouncing ? {
                y: { duration: 0.65, ease: "easeInOut" },
                scale: { duration: 0.65, ease: "easeInOut" }
            } : {
                type: 'spring', stiffness: 350, damping: 25
            }}
            whileHover={{ y: isBouncing ? undefined : -10 }}
            whileTap={{ scale: 0.88, scaleY: 0.84, scaleX: 1.12 }}
            aria-label={alt}
        >
            {/* Ripple Wave Expander */}
            <AnimatePresence>
                {showRipple && (
                    <motion.div
                        initial={{ opacity: 0.85, scale: 0.4 }}
                        animate={{ opacity: 0, scale: 1.8 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="absolute inset-0 rounded-2xl pointer-events-none z-0"
                        style={{
                            background: `radial-gradient(circle, ${activeColor}33 0%, transparent 75%)`
                        }}
                    />
                )}
            </AnimatePresence>

            {/* --- DEEP COLORED AMBIENT (Replaces the black shadow) --- */}
            <motion.img 
                src={iconUrl} 
                alt=""
                className="absolute object-contain opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                style={{ 
                    width: imgSize, 
                    height: imgSize,
                    filter: 'blur(18px) brightness(0.9) saturate(1.8)',
                    transform: 'translateY(12px) scale(0.9)'
                }}
            />

            {/* --- CORE GLOW (Focused light) --- */}
            <motion.img 
                src={iconUrl} 
                alt=""
                className="absolute object-contain opacity-40 group-hover:opacity-80 transition-all duration-300 pointer-events-none"
                style={{ 
                    width: imgSize, 
                    height: imgSize,
                    filter: 'blur(8px) brightness(1.2) saturate(1.2)',
                    transform: 'translateY(6px) scale(0.95)'
                }}
            />

            {/* --- MAIN ICON LAYER --- */}
            <img 
                src={iconUrl} 
                alt={alt} 
                className="relative z-10 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]"
                style={{ width: imgSize, height: imgSize }}
            />

            {/* --- RUNNING STATE INDICATOR DOT --- */}
            {isRunning && (
                <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    className="absolute bottom-1 w-1.5 h-1.5 rounded-full z-20 pointer-events-none"
                    style={{ 
                        backgroundColor: activeColor,
                        boxShadow: `0 0 10px ${activeColor}, 0 0 4px ${activeColor}` 
                    }}
                />
            )}
        </motion.button>
    );
});
