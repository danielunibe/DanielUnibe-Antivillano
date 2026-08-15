
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
        onClick={onClick}
        className={`
            relative flex items-center justify-center gap-2 h-10 px-6 transition-all duration-300 group outline-none
        `}
    >
        {/* Active Line Indicator (Minimalist) */}
        <div 
            className={`
                absolute bottom-0 left-0 h-[2px] bg-current transition-all duration-300 ease-out
                ${active ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50'}
            `}
            style={{ color: active ? color : 'white' }}
        />

        {/* Content */}
        <div className={`
            flex items-center gap-2
            ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}
        `}>
            <div className={`transition-transform duration-300 ${active ? 'scale-110 text-' + color : ''}`} style={{ color: active ? color : 'inherit' }}>
                {icon}
            </div>
            
            <span className={`
                font-['Teko'] text-xl tracking-[0.15em] leading-none pt-1 uppercase font-bold transition-all
                ${active ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''}
            `}>
                <span style={liftPx ? { display: 'inline-block', transform: `translateY(-${liftPx}px)` } : undefined}>
                    {label}
                </span>
            </span>
        </div>
    </button>
);
