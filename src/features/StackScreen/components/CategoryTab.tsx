
import React from 'react';

interface CategoryTabProps {
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
    color: string;
    liftPx?: number;
}

export const CategoryTab: React.FC<CategoryTabProps> = ({ label, icon, active, onClick, color, liftPx = 0 }) => (
    <button
        type="button"
        onClick={onClick}
        className={`
            relative flex-1 min-w-[65px] sm:min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 h-10 px-2 sm:px-3 md:px-4 transition-all duration-300 group outline-none rounded-sm
            ${active ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}
        `}
    >
        {/* Active Line Indicator (Minimalist) */}
        <div 
            className={`
                absolute bottom-0 left-0 h-[2px] transition-all duration-300 ease-out
                ${active ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50'}
            `}
            style={{ backgroundColor: active ? color : 'white' }}
        />

        {/* Content */}
        <div className={`
            flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap
            ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}
        `}>
            <div className="shrink-0 transition-transform duration-300" style={{ color: active ? color : 'currentColor' }}>
                {icon}
            </div>
            
            <span className={`
                font-['Teko'] text-lg sm:text-xl tracking-[0.08em] sm:tracking-[0.12em] leading-none pt-0.5 uppercase font-bold transition-all truncate
                ${active ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''}
            `}>
                <span style={liftPx ? { display: 'inline-block', transform: `translateY(-${liftPx}px)` } : undefined}>
                    {label}
                </span>
            </span>
        </div>
    </button>
);
