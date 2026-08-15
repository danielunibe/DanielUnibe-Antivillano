
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
            relative flex h-full w-full flex-col overflow-hidden select-none transition-all duration-300 min-h-0
            ${animateCard ? 'opacity-50 scale-[0.99]' : 'opacity-100 scale-100'}
        `}>
            {/* 1. HEADER (Top Bar with full-width text) */}
            <div className="z-20 flex w-full shrink-0 items-start justify-between gap-4 border-b border-white/10 bg-black/40 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-md">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 opacity-70">
                        <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-white uppercase bg-white/10 px-2 py-0.5 rounded">
                            {isWeapon(selectedItem) ? selectedItem.subtitle : (selectedItem as StackItem).manufacturer}
                        </span>
                        <div className="h-[1px] w-8 sm:w-16 bg-white/20" />
                        <span className="text-[10px] font-mono tracking-widest text-[#F2D019] uppercase hidden sm:inline">
                            SYS_ID: {selectedItem.id}
                        </span>
                    </div>
                    <h2 className="font-['Teko'] text-3xl font-bold uppercase leading-[0.9] tracking-normal text-white drop-shadow-xl sm:text-5xl md:text-6xl break-words">
                        {selectedItem.name}
                    </h2>
                </div>

                {/* Capability Badge */}
                <div className="flex flex-col items-end shrink-0 pl-2">
                    <div className="mb-0.5 font-mono text-[9px] sm:text-[10px] tracking-widest text-gray-400 uppercase">CAPABILITY</div>
                    <div className="font-['Teko'] text-2xl font-bold uppercase leading-none sm:text-4xl md:text-5xl" style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}` }}>
                        {isWeapon(selectedItem) ? 'COMBO' : 'TOOL'}
                    </div>
                </div>
            </div>

            {/* 2. CENTER PIECE (Interactive Hologram / 3D Inspection Bay) */}
            <div className="relative z-10 flex w-full flex-1 items-center justify-center min-h-0 py-2 px-4 overflow-hidden">
                {/* Tech Reticle Corners */}
                <div className="absolute top-3 left-3 text-white/20 font-mono text-[10px] select-none pointer-events-none">[ + ] MATRIX_VIEW</div>
                <div className="absolute top-3 right-3 text-white/20 font-mono text-[10px] select-none pointer-events-none">ROT: ACTIVE [ + ]</div>
                <div className="absolute bottom-3 left-3 text-white/20 font-mono text-[10px] select-none pointer-events-none">[ // 3D_INSPECTOR ]</div>
                <div className="absolute bottom-3 right-3 text-white/20 font-mono text-[10px] select-none pointer-events-none">FOV: 45° //</div>

                <div className="w-full h-full flex items-center justify-center relative">
                    {/* Background Radial Glow */}
                    <div 
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 65%)` }}
                    />
                    
                    {/* Concentric Holo Rings */}
                    <div className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-white/5 pointer-events-none animate-spin-slow opacity-40" />
                    <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-dashed border-white/5 pointer-events-none opacity-30" />
                    
                    {/* Model / Icon Display Stage */}
                    <div className="w-full h-full flex items-center justify-center relative z-10 p-2">
                        {has3D && RUNTIME_FLAGS.ENABLE_3D_VIEWERS ? (
                            <div className="w-full h-full min-h-[160px]">
                                <ErrorBoundary fallback={
                                    <div className="w-full h-full flex items-center justify-center opacity-50">
                                        <img src={extendedItem?.icon || selectedItem.icon} className="max-h-[70%] max-w-[70%] object-contain grayscale opacity-50" alt="Fallback" />
                                    </div>
                                }>
                                    <Visualizer3D itemId={selectedItem.id} />
                                </ErrorBoundary>
                            </div>
                        ) : isWeapon(selectedItem) ? (
                            <img src={selectedItem.image} alt={selectedItem.name} className="h-full w-auto max-h-[260px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] animate-float" />
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {IconComponent ? (
                                    <IconComponent className="w-auto h-auto max-w-[200px] max-h-[200px] sm:max-w-[240px] sm:max-h-[240px] object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] animate-float" />
                                ) : (
                                    <img src={selectedItem.icon} className="w-auto h-auto max-w-[200px] max-h-[200px] sm:max-w-[240px] sm:max-h-[240px] object-contain animate-float drop-shadow-2xl" alt="Icon" />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. FOOTER STATS (Pinned Bottom - Perfectly Proportioned) */}
            <div className="mt-auto w-full shrink-0 border-t border-white/10 bg-black/60 p-3.5 sm:p-5 backdrop-blur-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    
                    {/* CAPABILITY CONTEXT */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-white rotate-45" />
                            <span className="text-[11px] font-mono text-white/60 tracking-[0.25em] font-bold uppercase">CAPABILITY CONTEXT</span>
                        </div>
                        <div>
                            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                                {isWeapon(selectedItem) ? 'TOOLS COMBINED' : 'CATEGORY'}
                            </div>
                            <p className="mt-0.5 font-['Teko'] text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
                                {isWeapon(selectedItem) ? componentIds.join(' + ') : `${selectedItem.category} / ${selectedItem.type}`}
                            </p>
                        </div>
                        <div>
                            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">EVIDENCE STATUS</div>
                            <p className="mt-0.5 font-['Roboto_Mono'] text-[11px] sm:text-xs leading-relaxed text-[#00F0FF]">{verifiedUsage}</p>
                        </div>
                    </div>

                    {/* INFO COLUMN */}
                    <div className="border-t border-white/10 pt-3 md:border-t-0 md:border-l md:border-white/10 md:pt-0 md:pl-6 flex flex-col justify-between">
                        <div>
                            <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">DESCRIPTION</div>
                            <p className="font-['Roboto_Mono'] text-xs sm:text-[13px] text-gray-300 leading-relaxed">
                                {selectedItem.description}
                            </p>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between gap-3 pt-2 border-t border-white/5">
                            <div>
                                <p className="font-['Roboto_Mono'] text-[10px] text-white/50 leading-tight">
                                    Respaldo con proyectos documentados en portafolio.
                                </p>
                            </div>
                            <span className="border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] shrink-0" style={{ borderColor: accentColor, color: accentColor }}>EVIDENCE FIRST</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
});
