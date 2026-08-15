import React, { useMemo } from 'react';
import { StackItem, WeaponConfig, ViewMode, ItemCategory } from '../types';
import { STACK_DATABASE, WEAPONS_DATABASE } from '../data';
import { Icons } from '../assets/Icons';
import { CategoryTab } from './CategoryTab';
import { SkillIcons } from '../assets/SkillIcons';

interface InventoryGridProps {
    viewMode: ViewMode;
    activeCategory: ItemCategory;
    onCategoryChange: (cat: ItemCategory) => void;
    selectedItem: StackItem | WeaponConfig;
    onSelect: (item: StackItem | WeaponConfig) => void;
    onHover: (item: StackItem | WeaponConfig | null) => void;
}

export const InventoryGrid: React.FC<InventoryGridProps> = ({ 
    viewMode, 
    activeCategory, 
    onCategoryChange, 
    selectedItem, 
    onSelect,
    onHover
}) => {
    const filteredResources = useMemo(() => {
        if (activeCategory === 'ALL') return STACK_DATABASE;
        return STACK_DATABASE.filter(item => item.category === activeCategory);
    }, [activeCategory]);

    const getIconComponent = (item: StackItem) => {
        if (item.iconKey && SkillIcons[item.iconKey]) return SkillIcons[item.iconKey];
        if (SkillIcons[item.id]) return SkillIcons[item.id];
        return null;
    };

    const handleMouseEnter = (item: StackItem) => {
        onHover(item);
    };

    const handleMouseLeave = () => {
        onHover(null);
    };

    const RARITY_COLORS: Record<string, string> = {
        common: '#9ca3af',
        rare: '#3b82f6',
        epic: '#a855f7',
        legendary: '#f59e0b',
        mystic: '#ef4444'
    };

    return (
        <div className="w-full h-full flex flex-col relative min-h-0 bg-[#050505]/95">
            {viewMode === 'RESOURCES' ? (
                <>
                    {/* TABS BAR - Minimalist & Aesthetic */}
                    <div className="flex flex-nowrap w-full z-10 shrink-0 min-h-12 items-center px-2 sm:px-4 py-2 gap-1.5 border-b border-white/10 bg-[#0a0a0a] overflow-x-auto sci-fi-scroll">
                        <CategoryTab label="TODO" icon={<Icons.All className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} active={activeCategory === 'ALL'} onClick={() => onCategoryChange('ALL')} color="#F2D019" />
                        <CategoryTab label="GRÁFICO" icon={<Icons.Graphic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} active={activeCategory === 'GRAPHIC'} onClick={() => onCategoryChange('GRAPHIC')} color="#f472b6" />
                        <CategoryTab label="UI/UX" icon={<Icons.UIUX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} active={activeCategory === 'UI_UX'} onClick={() => onCategoryChange('UI_UX')} color="#c084fc" />
                        <CategoryTab label="JUEGOS" icon={<Icons.Game className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} active={activeCategory === 'GAME'} onClick={() => onCategoryChange('GAME')} color="#fb923c" />
                        <CategoryTab label="IA" icon={<Icons.AI className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} active={activeCategory === 'AI'} onClick={() => onCategoryChange('AI')} color="#38bdf8" />
                    </div>

                    {/* GRID OF INVENTORY ITEMS */}
                    <div className="flex-grow overflow-y-auto p-3.5 sm:p-5 md:p-6 sci-fi-scroll relative min-h-0">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-3.5 content-start pb-2">
                            {filteredResources.map((item) => {
                                const isSelected = selectedItem.id === item.id;
                                const ToolIcon = getIconComponent(item);
                                const itemRarityColor = RARITY_COLORS[item.rarity || 'common'] || '#ffffff';
                                
                                return (
                                    <button
                                        type="button"
                                        aria-label={`Inspect ${item.name}`}
                                        aria-pressed={isSelected}
                                        key={item.id} 
                                        onClick={() => onSelect(item)} 
                                        onMouseEnter={() => handleMouseEnter(item)} 
                                        onMouseLeave={handleMouseLeave} 
                                        className={`
                                            relative cursor-pointer aspect-square rounded-lg transition-all duration-200 group flex flex-col items-center justify-center p-2
                                            ${isSelected 
                                                ? 'bg-white/10 ring-2 ring-[#F2D019] shadow-[0_0_18px_rgba(242,208,25,0.3)] z-10 scale-[1.03]' 
                                                : 'bg-[#101010] hover:bg-[#181818] border border-white/5 hover:border-white/20 hover:scale-[1.02]'
                                            }
                                        `}
                                    >
                                        {/* Corner Rarity Notch */}
                                        <div 
                                            className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-sm opacity-70"
                                            style={{ backgroundColor: itemRarityColor }}
                                        />

                                        {/* ICON CONTAINER - Balanced sizing */}
                                        <div className="w-[65%] h-[65%] flex items-center justify-center">
                                            {ToolIcon ? (
                                                <ToolIcon 
                                                    className="w-full h-full drop-shadow-md transition-transform duration-200 group-hover:scale-110" 
                                                    style={{ 
                                                        filter: isSelected ? 'grayscale(0%) brightness(1.15)' : 'grayscale(15%) opacity(0.85)',
                                                    }} 
                                                />
                                            ) : (
                                                <div className="w-5 h-5 bg-gray-600 rounded-sm" />
                                            )}
                                        </div>

                                        {/* Sub-label for tool identification */}
                                        <span className={`
                                            mt-1 font-mono text-[9px] uppercase tracking-wider truncate max-w-full px-1 text-center font-bold leading-none
                                            ${isSelected ? 'text-[#F2D019]' : 'text-gray-400 group-hover:text-white'}
                                        `}>
                                            {item.id}
                                        </span>

                                        {/* Minimalist Selection Marker */}
                                        {isSelected && (
                                            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#F2D019] rounded-full shadow-[0_0_6px_#F2D019]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* BOTTOM STATUS / CAPACITY BAR */}
                    <div className="shrink-0 w-full px-4 py-2.5 bg-[#080808] border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-gray-400 select-none">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#F2D019] rounded-full animate-pulse" />
                            <span className="tracking-widest uppercase">CAPACITY: <strong className="text-white">{filteredResources.length} ITEMS</strong></span>
                        </div>
                        <div className="tracking-widest uppercase hidden sm:block text-gray-500">
                            SECTOR: <strong className="text-white">{activeCategory}</strong>
                        </div>
                        <div className="tracking-widest uppercase text-[#00F0FF]">
                            STATUS: READY
                        </div>
                    </div>
                </>
            ) : (
                // WEAPONS LIST
                <div className="flex-grow p-4 md:p-6 overflow-y-auto sci-fi-scroll">
                    <div className="flex flex-col gap-3">
                        {WEAPONS_DATABASE.map((weapon) => {
                            const isSelected = selectedItem.id === weapon.id;
                            return (
                                <button
                                    type="button"
                                    aria-label={`Inspect ${weapon.name}`}
                                    aria-pressed={isSelected}
                                    key={weapon.id} 
                                    onClick={() => onSelect(weapon)} 
                                    className={`
                                        relative h-20 w-full cursor-pointer flex items-center px-6 justify-between 
                                        transition-all duration-200 border-l-2
                                        ${isSelected 
                                            ? 'bg-white/5 border-[#00F0FF]' 
                                            : 'bg-transparent border-[#333] hover:bg-white/5 hover:border-white/30'
                                        }
                                    `}
                                >
                                    <div className="flex flex-col z-10">
                                        <span className={`font-['Teko'] text-2xl font-bold uppercase leading-none ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                                            {weapon.name}
                                        </span>
                                        <span className="font-mono text-[9px] text-gray-600 uppercase tracking-wider">
                                            {weapon.subtitle}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
