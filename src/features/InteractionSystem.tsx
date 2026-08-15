
import React, { createContext, useContext, useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { sfx } from '../utils/SoundManager';
import { useLocale } from './profile/useLocale';

// --- TYPE DEFINITIONS ---
interface InteractionData {
    name: string;
    src?: string;
}

interface InteractionContextType {
    setHoveredItem: (data: InteractionData | null) => void;
}

const InteractionContext = createContext<InteractionContextType>({
    setHoveredItem: () => {},
});

export const useInteraction = () => useContext(InteractionContext);

// --- UTILITY: Robust Copy to Clipboard ---
const copyToClipboard = (text: string): Promise<void> => {
    // Try modern API first if available and in secure context
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback: Hidden textarea (Legacy approach for restricted environments)
        return new Promise((resolve, reject) => {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (successful) resolve();
                else reject(new Error('Fallback copy failed'));
            } catch (err) {
                reject(err);
            }
        });
    }
};

// --- HOOK: useImageInteraction ---
export const useImageInteraction = (name: string, src?: string) => {
    const { setHoveredItem } = useInteraction();
    return {
        onMouseEnter: () => setHoveredItem({ name, src }),
        onMouseLeave: () => setHoveredItem(null),
        className: "interaction-target" 
    };
};

// --- VISUAL UI COMPONENT ---
export const InteractionUI: React.FC = () => {
    const { t } = useLocale();
    const [tooltipData, setTooltipData] = useState<{ name: string; x: number; y: number; visible: boolean }>({ 
        name: '', x: 0, y: 0, visible: false 
    });
    
    const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: '', visible: false });
    
    const hoveredDataRef = useRef<InteractionData | null>(null);
    const mousePosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY };
            
            if (e.ctrlKey && hoveredDataRef.current) {
                setTooltipData(prev => ({
                    ...prev,
                    x: e.clientX,
                    y: e.clientY,
                    visible: true,
                    name: hoveredDataRef.current?.name || ''
                }));
            } else {
                setTooltipData(prev => (prev.visible ? { ...prev, visible: false } : prev));
            }
        };

        const handleClick = (e: MouseEvent) => {
            // Match the HUD prompt: SHIFT + CLICK to copy
            // This provides a stronger "user gesture" context for browsers
            if (e.shiftKey && hoveredDataRef.current) {
                const name = hoveredDataRef.current.name;
                copyToClipboard(name).then(() => {
                    sfx.play('CLICK');
                    setToast({ msg: `${t('dataAcquired')}: ${name}`, visible: true });
                    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2000);
                }).catch(err => {
                    // Fail silently in debug but prevent crash
                    console.debug('Clipboard action failed:', err);
                });
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Control' && hoveredDataRef.current) {
                setTooltipData({
                    name: hoveredDataRef.current.name,
                    x: mousePosRef.current.x,
                    y: mousePosRef.current.y,
                    visible: true
                });
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Control') {
                setTooltipData(prev => ({ ...prev, visible: false }));
            }
        };

        const handleHoverChange = (e: CustomEvent) => {
            const data = e.detail as InteractionData | null;
            hoveredDataRef.current = data;

            if (!data) {
                setTooltipData(prev => ({ ...prev, visible: false }));
            } else {
                // Avoid capturing `tooltipData` in this effect; only update the name when tooltip is visible.
                setTooltipData(prev => (prev.visible ? { ...prev, name: data.name } : prev));
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleClick); 
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('interaction-hover', handleHoverChange as EventListener);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleClick);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('interaction-hover', handleHoverChange as EventListener);
        };
    }, [t]);

return (
        <div className="pointer-events-none fixed inset-0 z-[9999]">
            {/* --- MOUSE TOOLTIP (CONTROL) --- */}
            <div 
                className={`absolute transition-opacity duration-100 ease-out flex flex-col items-start gap-1 ${tooltipData.visible ? 'opacity-100' : 'opacity-0'}`}
                style={{ left: tooltipData.x + 20, top: tooltipData.y + 20 }}
            >
                <div className="absolute -top-3 -left-3 w-4 h-4 border-l-2 border-t-2 border-[#00F0FF]" />
                <div className="bg-black/90 border border-[#00F0FF] px-4 py-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 bg-[#00F0FF] animate-pulse rounded-full" />
                        <span className="text-[9px] font-['Roboto_Mono'] text-[#00F0FF] tracking-widest uppercase">
                            {t('objectIdentifier')}
                        </span>
                    </div>
                    <span className="font-['Teko'] text-2xl text-white tracking-wide uppercase leading-none">
                        {tooltipData.name}
                    </span>
                </div>
            </div>

            {/* --- TOAST NOTIFICATION (SHIFT) --- */}
            <div className={`
                absolute bottom-24 left-1/2 -translate-x-1/2 
                bg-[#F2D019] text-black px-8 py-3 
                transform transition-all duration-300 cubic-bezier(0.175, 0.885, 0.32, 1.275)
                clip-path-polygon-[0_0,_100%_0,_95%_100%,_5%_100%]
                border-2 border-white
                flex items-center gap-4
                ${toast.visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90'}
            `}>
                <div className="w-6 h-6 border-2 border-black flex items-center justify-center animate-spin">
                    <div className="w-2 h-2 bg-black" />
                </div>
                <div>
                    <div className="font-['Teko'] text-3xl font-bold leading-none tracking-widest">{t('copied')}</div>
                    <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">{toast.msg}</div>
                </div>
            </div>
        </div>
    );
};

// --- PROVIDER ---
export const InteractionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const setHoveredItem = useCallback((data: InteractionData | null) => {
        window.dispatchEvent(new CustomEvent('interaction-hover', { detail: data }));
    }, []);

    const value = useMemo(() => ({ setHoveredItem }), [setHoveredItem]);

    return (
        <InteractionContext.Provider value={value}>
            {children}
            <InteractionUI />
        </InteractionContext.Provider>
    );
};
