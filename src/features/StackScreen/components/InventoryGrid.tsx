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

    return (
        <div className="w-full h-full flex flex-col relative min-h-0 bg-[#050505]">
            {viewMode === 'RESOURCES' ? (
                <>
                    {/* TABS BAR - Minimalist & Aesthetic */}
                    <div className="flex flex-nowrap w-full z-10 shrink-0 min-h-12 items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 gap-1 sm:gap-2 border-b border-white/5 bg-[#080808] overflow-x-auto sci-fi-scroll">
                        <CategoryTab label="TODO" icon={<Icons.All className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} active={activeCategory === 'ALL'} onClick={() => onCategoryChange('ALL')} color="#F2D019" />
                        <CategoryTab label="GRÁFICO" icon={<Icons.Graphic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} active={activeCategory === 'GRAPHIC'} onClick={() => onCategoryChange('GRAPHIC')} color="#f472b6" />
                        <CategoryTab label="UI/UX" icon={<Icons.UIUX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} active={activeCategory === 'UI_UX'} onClick={() => onCategoryChange('UI_UX')} color="#c084fc" />
                        <CategoryTab label="JUEGOS" icon={<Icons.Game className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} active={activeCategory === 'GAME'} onClick={() => onCategoryChange('GAME')} color="#fb923c" />
                        <CategoryTab label="IA" icon={<Icons.AI className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} active={activeCategory === 'AI'} onClick={() => onCategoryChange('AI')} color="#38bdf8" />
                    </div>

                    <div className="flex-grow overflow-y-auto p-4 sm:p-6 md:p-8 sci-fi-scroll relative min-h-0">
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-7 gap-2.5 sm:gap-3 md:gap-4 content-start pb-4">
                            {filteredResources.map((item) => {
                                const isSelected = selectedItem.id === item.id;
                                const ToolIcon = getIconComponent(item);
                                
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
                                            relative cursor-pointer aspect-square rounded-lg transition-all duration-200 group flex items-center justify-center
                                            ${isSelected 
                                                ? 'bg-white/5 ring-1 ring-white/40 z-10' 
                                                : 'bg-[#111] hover:bg-[#181818] border border-transparent hover:border-white/5'
                                            }
                                        `}
                                    >
                                        {/* ICON CONTAINER - Fixed % Size for Perfect Uniformity */}
                                        <div className="w-[60%] h-[60%] flex items-center justify-center">
                                            {ToolIcon ? (
                                                <ToolIcon 
                                                    className="w-full h-full drop-shadow-md" 
                                                    style={{ 
                                                        filter: isSelected ? 'grayscale(0%) brightness(1.1)' : 'grayscale(20%) opacity(0.8)',
                                                        transition: 'all 0.3s ease'
                                                    }} 
                                                />
                                            ) : (
                                                <div className="w-4 h-4 bg-gray-600 rounded-sm" />
                                            )}
                                        </div>

                                        {/* Minimalist Selection Marker */}
                                        {isSelected && (
                                            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
                                        )}
                                    </button>
                                );
                            })}
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
