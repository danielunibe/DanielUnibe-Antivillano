
import React, { useState, useEffect, useRef } from 'react';
import { sfx } from '../../utils/SoundManager';
import { STACK_DATABASE, WEAPONS_DATABASE } from './data';
import { ViewMode, ItemCategory, StackItem, WeaponConfig } from './types';
import { Icons } from './assets/Icons';
import { GoBackButton } from '../../components/ui/GoBackButton';

// Subcomponents
import { InventoryGrid } from './components/InventoryGrid';
import { InspectorPanel } from './components/InspectorPanel';

interface StackScreenProps {
    onClose: () => void;
    onInspectCapability?: (item: StackItem | WeaponConfig) => void;
}

export const StackScreen: React.FC<StackScreenProps> = ({ onClose, onInspectCapability }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('RESOURCES');
    const [activeCategory, setActiveCategory] = useState<ItemCategory>('ALL');
    const [selectedItem, setSelectedItem] = useState<StackItem | WeaponConfig>(STACK_DATABASE[0]);
    const [previewItem, setPreviewItem] = useState<StackItem | WeaponConfig | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [animateCard, setAnimateCard] = useState(false);
    
    const hoverTimerRef = useRef<number | null>(null);

    const themeColor = viewMode === 'WEAPONS' ? '#00F0FF' : '#F2D019';
    const themeText = viewMode === 'WEAPONS' ? 'text-[#00F0FF]' : 'text-[#F2D019]';

    useEffect(() => {
        // Sonido de apertura silenciado por feedback
        return () => {
            if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
        };
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        sfx.play('CLICK');
        setTimeout(onClose, 300); 
    };

    const handleSelect = (item: StackItem | WeaponConfig) => {
        if (item.id === selectedItem.id) return;
        if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
        
        sfx.play('CLICK');
        setSelectedItem(item);
        onInspectCapability?.(item);
        setPreviewItem(null); 
        setAnimateCard(true);
        setTimeout(() => setAnimateCard(false), 300);
    };

    const handleHover = (item: StackItem | WeaponConfig | null) => {
        if (hoverTimerRef.current) {
            window.clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }

        if (item) {
            if (item.id !== selectedItem.id) {
                hoverTimerRef.current = window.setTimeout(() => {
                    setPreviewItem(item);
                    sfx.play('HOVER');
                }, 500); 
            }
        } else {
            setPreviewItem(null);
        }
    };

    const handleModeSwitch = (mode: ViewMode) => {
        if (viewMode === mode) return;
        sfx.play('CLICK');
        setViewMode(mode);
        const defaultItem = mode === 'WEAPONS' ? WEAPONS_DATABASE[0] : STACK_DATABASE[0];
        setSelectedItem(defaultItem);
        onInspectCapability?.(defaultItem);
        setPreviewItem(null);
    };

    const itemToDisplay = previewItem || selectedItem;

    return (
        <div data-screen="stack" className={`
            fixed inset-0 z-[200] flex flex-col items-stretch lg:items-center
            w-full bg-[#050505] overflow-y-auto overflow-x-clip lg:overflow-hidden select-none
            ${isClosing ? 'animate-out fade-out duration-300' : 'animate-stack-entry'}
        `}>
            <div className="interface-dot-grid" />
            <div className="interface-screen-vignette" />

            {/* GO BACK BUTTON - Same fixed absolute position as in LootMap */}
            <GoBackButton 
                onClick={handleClose} 
                isClosing={isClosing} 
                className="absolute left-4 top-3 sm:top-4 z-50" 
                ariaLabel="Salir" 
                title="Salir" 
            />

            {/* HEADER AREA - Centered Title in Middle & Switcher on Right */}
            <div className="relative z-40 mt-2 mb-1 flex w-full max-w-[1800px] shrink-0 items-center justify-between px-3 animate-fade-up delay-100 sm:px-6 md:mt-3 md:mb-2 md:px-8">
                {/* Left spacer matching GoBackButton width for perfect centering */}
                <div className="w-20 sm:w-28 md:w-36 shrink-0" />

                {/* CENTER: White Section Title Centered in Top Middle */}
                <div className="flex flex-col items-center justify-center text-center -skew-x-[6deg] px-2 flex-1 min-w-0">
                    <h1 className="font-['Teko'] text-3xl sm:text-4xl md:text-5xl font-bold uppercase italic leading-none tracking-wider text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] truncate max-w-full">
                        SKILLS_INVENTORY
                    </h1>
                    <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.35em] font-bold text-[#F2D019] uppercase mt-0.5">
                        {viewMode === 'WEAPONS' ? 'ARSENAL_LOADOUT' : 'SOFTWARE_INVENTORY'}
                    </span>
                </div>

                {/* RIGHT: Unified Mode Switcher */}
                <div className="flex items-center justify-end shrink-0">
                    <div className="flex h-9 items-stretch overflow-hidden rounded-sm border border-white/10 bg-white/5 p-0.5 sm:h-10 md:h-11">
                        {/* Botón SOFTWARE */}
                        <button 
                            onClick={() => handleModeSwitch('RESOURCES')} 
                            className={`stack-tab
                                relative flex h-full items-center justify-center border-x border-black/20 px-3.5 transition-all duration-300 sm:px-6 md:px-8
                                ${viewMode === 'RESOURCES' 
                                    ? 'bg-[#F2D019] text-black z-20 shadow-[0_0_20px_rgba(242,208,25,0.4)]' 
                                    : 'bg-[#151515] text-gray-500 hover:text-white z-10'
                                }
                            `}
                        >
                            <span className="pt-0.5 font-['Teko'] text-base font-bold tracking-widest sm:text-lg md:text-xl">SOFTWARE</span>
                        </button>

                        {/* Botón ARMAS */}
                        <button 
                            onClick={() => handleModeSwitch('WEAPONS')} 
                            className={`stack-tab
                                relative flex h-full items-center justify-center px-3.5 transition-all duration-300 sm:px-6 md:px-8
                                ${viewMode === 'WEAPONS' 
                                    ? 'bg-[#00F0FF] text-black z-20 shadow-[0_0_20px_rgba(0,240,255,0.4)]' 
                                    : 'bg-[#151515] text-gray-500 hover:text-white z-10'
                                }
                            `}
                        >
                            <span className="pt-0.5 font-['Teko'] text-base font-bold tracking-widest sm:text-lg md:text-xl">ARMAS</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="relative z-10 flex w-full max-w-[1800px] flex-1 flex-col gap-4 overflow-visible px-3 pb-4 min-h-0 lg:flex-row lg:gap-6 lg:overflow-hidden lg:px-8 lg:py-2">
                {/* LEFT: Grid */}
                <div className="relative flex h-[380px] w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-md animate-fade-up delay-200 sm:h-[460px] lg:h-full lg:w-[46%] xl:w-[44%] min-h-0">
                    <InventoryGrid 
                        viewMode={viewMode}
                        activeCategory={activeCategory} 
                        onCategoryChange={setActiveCategory} 
                        selectedItem={selectedItem} 
                        onSelect={handleSelect} 
                        onHover={handleHover} 
                    />
                </div>

                {/* RIGHT: Floating Inspector */}
                <div className="relative flex min-h-[500px] w-full flex-col rounded-xl border border-white/10 bg-black/30 shadow-2xl backdrop-blur-md overflow-hidden animate-fade-up delay-300 lg:h-full lg:min-h-0 lg:w-[54%] xl:w-[56%] min-h-0">
                    <InspectorPanel 
                        selectedItem={itemToDisplay} 
                        animateCard={animateCard} 
                        themeColor={themeColor}
                    />
                </div>
            </div>
        </div>
    );
};
