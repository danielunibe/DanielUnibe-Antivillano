
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

            {/* HEADER AREA - Coupled Buttons & Title */}
            <div className="relative z-50 mt-2 mb-1 flex w-full max-w-[1800px] shrink-0 flex-col items-stretch justify-between gap-2 px-3 animate-fade-up delay-100 sm:px-6 md:mt-4 md:mb-3 md:flex-row md:items-center md:px-8 md:gap-4">
                
                <div className="flex flex-wrap items-center gap-3">
                    <GoBackButton onClick={handleClose} isClosing={isClosing} ariaLabel="Salir" title="Salir" />
                    
                    {/* UNIFIED TAB SYSTEM */}
                    <div className="flex h-10 items-stretch overflow-hidden rounded-sm border border-white/10 bg-white/5 p-0.5 md:h-12">
                        {/* Botón SOFTWARE */}
                        <button onClick={() => handleModeSwitch('RESOURCES')} 
                            className={`stack-tab
                                relative flex h-full items-center justify-center border-x border-black/20 px-5 transition-all duration-300 md:px-10
                                ${viewMode === 'RESOURCES' 
                                    ? 'bg-[#F2D019] text-black z-20 shadow-[0_0_20px_rgba(242,208,25,0.4)]' 
                                    : 'bg-[#151515] text-gray-500 hover:text-white z-10'
                                }
                            `}
                        >
                            <span className="pt-0.5 font-['Teko'] text-lg font-bold tracking-widest md:text-2xl">SOFTWARE</span>
                        </button>

                        {/* Botón ARMAS */}
                        <button onClick={() => handleModeSwitch('WEAPONS')} 
                            className={`stack-tab
                                relative flex h-full items-center justify-center px-5 transition-all duration-300 md:px-10
                                ${viewMode === 'WEAPONS' 
                                    ? 'bg-[#00F0FF] text-black z-20 shadow-[0_0_20px_rgba(0,240,255,0.4)]' 
                                    : 'bg-[#151515] text-gray-500 hover:text-white z-10'
                                }
                            `}
                        >
                            <span className="pt-0.5 font-['Teko'] text-lg font-bold tracking-widest md:text-2xl">ARMAS</span>
                        </button>
                    </div>
                </div>

                <div className="stack-screen-heading ml-auto flex max-w-full -skew-x-[10deg] flex-col items-end self-end border-r-4 border-white pr-4 md:self-auto">
                    <h1 className="max-w-full font-['Teko'] text-3xl font-bold uppercase italic leading-none tracking-wider text-white sm:text-4xl md:text-5xl">SKILLS_INVENTORY</h1>
                    <span className="font-mono text-[9px] tracking-[0.35em] font-bold text-[#F2D019]">
                        {viewMode === 'WEAPONS' ? 'ARSENAL_LOADOUT' : 'SOFTWARE_INVENTORY'}
                    </span>
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
