
import React from 'react';
import { StackItem, WeaponConfig, isWeapon } from '../types';
import { ExtendedStackItem } from '../data';
import { SkillIcons } from '../assets/SkillIcons';
import { Visualizer3D } from './3d/Visualizer3D';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';
import { RUNTIME_FLAGS } from '../../../config/runtimeFlags';

interface InspectorPanelProps {
    selectedItem: StackItem | WeaponConfig;
    animateCard: boolean;
    themeColor?: string;
}

const RARITY_COLORS: Record<string, string> = {
    common: '#9ca3af',
    rare: '#3b82f6',
    epic: '#a855f7',
    legendary: '#f59e0b',
    mystic: '#ef4444'
};
const THREE_ITEM_IDS = new Set([
    '3dsmax', 'blender', 'figma', 'xd', 'ae', 'prem', 'ai',
    'sub-pt', 'sub-ds', 'powershell', 'id', 'ps', 'affinity', 'audition'
]);
const VERIFIED_LOCAL_USAGE: Record<string, string> = {
    react: 'Implementado en el runtime de UnibeLands 3',
    ts: 'Tipado y validado en el código de UnibeLands 3',
    tailwind: 'Utilizado en la interfaz de UnibeLands 3',
};

export const InspectorPanel: React.FC<InspectorPanelProps> = React.memo(({ selectedItem, animateCard, themeColor = '#F2D019' }) => {
    
    const rarity = selectedItem.rarity || 'common';
    const rarityColor = RARITY_COLORS[rarity] || '#ffffff';
    const accentColor = isWeapon(selectedItem) ? themeColor : rarityColor; 

    const extendedItem = !isWeapon(selectedItem) ? (selectedItem as ExtendedStackItem) : null;
    const IconComponent = extendedItem?.iconKey ? SkillIcons[extendedItem.iconKey] : null;
    
    const has3D = THREE_ITEM_IDS.has(selectedItem.id);

    const componentIds = isWeapon(selectedItem) ? selectedItem.components : [];
    const verifiedUsage = isWeapon(selectedItem)
        ? componentIds.some((id) => VERIFIED_LOCAL_USAGE[id])
            ? 'Combinación parcialmente demostrada en UnibeLands 3'
            : 'Proyecto de aplicación pendiente de documentar'
        : VERIFIED_LOCAL_USAGE[selectedItem.id] ?? 'Proyecto de aplicación pendiente de documentar';

    return (
        <div className={`
            relative flex h-auto w-full flex-col overflow-visible select-none transition-all duration-300 lg:h-full lg:overflow-hidden
            ${animateCard ? 'opacity-50 scale-[0.99]' : 'opacity-100 scale-100'}
        `}>
            {/* 1. HEADER (Absolute Top) */}
            <div className="pointer-events-none z-20 flex w-full shrink-0 items-start justify-between gap-3 p-4 md:p-6">
                <div>
                    <div className="flex items-center gap-3 mb-1 opacity-60">
                        <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-white uppercase bg-white/10 px-2 py-0.5 rounded">
                            {isWeapon(selectedItem) ? selectedItem.subtitle : (selectedItem as StackItem).manufacturer}
                        </span>
                        <div className="h-[1px] w-12 bg-white/30" />
                    </div>
                    <h2 className="max-w-[230px] truncate font-['Teko'] text-4xl font-bold uppercase leading-[0.8] tracking-tight text-white drop-shadow-xl sm:max-w-md md:text-7xl">
                        {selectedItem.name}
                    </h2>
                </div>

                {/* Honest capability badge: avoids presenting arbitrary percentages as evidence. */}
                <div className="flex flex-col items-end">
                    <div className="mb-1 font-mono text-[10px] tracking-widest text-gray-400">CAPABILITY PROFILE</div>
                    <div className="font-['Teko'] text-3xl font-bold uppercase leading-none md:text-5xl" style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}` }}>
                        {isWeapon(selectedItem) ? 'COMBO' : 'TOOL'}
                    </div>
                </div>
            </div>

            {/* 2. CENTER PIECE (Flexible Container - Prevents overflow) */}
            <div className="relative z-10 flex h-48 w-full flex-none items-center justify-center py-4 lg:h-auto lg:min-h-0 lg:flex-1">
                <div className="w-full h-full flex items-center justify-center relative">
                    {/* Background Glow */}
                    <div 
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{ background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 60%)` }}
                    />
                    
                    {/* Icon Container with Max Size Constraints */}
                    <div className="w-full h-full max-w-[80%] max-h-[80%] flex items-center justify-center">
                        {has3D && RUNTIME_FLAGS.ENABLE_3D_VIEWERS ? (
                            <div className="w-full h-full">
                                <ErrorBoundary fallback={
                                    <div className="w-full h-full flex items-center justify-center opacity-50">
                                        <img src={extendedItem?.icon || selectedItem.icon} className="max-h-[60%] max-w-[60%] object-contain grayscale opacity-50" alt="Fallback" />
                                    </div>
                                }>
                                    <Visualizer3D itemId={selectedItem.id} />
                                </ErrorBoundary>
                            </div>
                        ) : isWeapon(selectedItem) ? (
                            <img src={selectedItem.image} alt={selectedItem.name} className="h-full w-auto max-h-full object-contain drop-shadow-2xl animate-float" />
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {IconComponent ? (
                                    <IconComponent className="w-full h-full max-w-[15vw] max-h-[25vh] object-contain drop-shadow-2xl animate-float" />
                                ) : (
                                    <img src={selectedItem.icon} className="w-full h-full max-w-[15vw] max-h-[25vh] object-contain animate-float" alt="Icon" />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. FOOTER STATS (Pinned Bottom) */}
            <div className="mt-auto w-full shrink-0 border-t border-white/10 bg-black/40 p-4 backdrop-blur-md md:p-8">
                <div className="flex flex-col gap-7 md:flex-row md:gap-12">
                    
                    {/* CAPABILITY CONTEXT */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 bg-white rotate-45" />
                            <span className="text-xs font-mono text-white/50 tracking-[0.3em] font-bold uppercase">CAPABILITY CONTEXT</span>
                        </div>
                        <div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                                {isWeapon(selectedItem) ? 'TOOLS COMBINED' : 'CATEGORY'}
                            </div>
                            <p className="mt-1 font-['Teko'] text-2xl font-bold uppercase tracking-wider text-white">
                                {isWeapon(selectedItem) ? componentIds.join(' + ') : `${selectedItem.category} / ${selectedItem.type}`}
                            </p>
                        </div>
                        <div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">EVIDENCE STATUS</div>
                            <p className="mt-1 font-['Roboto_Mono'] text-xs leading-relaxed text-[#00F0FF]">{verifiedUsage}</p>
                        </div>
                    </div>

                    {/* INFO COLUMN */}
                    <div className="flex-1 border-l border-white/10 pl-8 flex flex-col justify-between">
                        <div>
                            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">DESCRIPTION</div>
                            <p className="font-['Roboto_Mono'] text-sm text-gray-300 leading-relaxed line-clamp-3">
                                {selectedItem.description}
                            </p>
                        </div>
                        
                        <div className="mt-6 flex items-end justify-between gap-4">
                            <div>
                                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">PORTFOLIO NOTE</div>
                                <p className="mt-1 max-w-sm font-['Roboto_Mono'] text-xs leading-relaxed text-white/55">
                                    Sin porcentajes ni niveles: la competencia se respalda con proyectos documentados.
                                </p>
                            </div>
                            <span className="border px-2 py-1 font-mono text-[9px] font-black uppercase tracking-[0.16em]" style={{ borderColor: accentColor, color: accentColor }}>EVIDENCE FIRST</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
});
