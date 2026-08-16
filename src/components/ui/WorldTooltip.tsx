import React from 'react';
import type { TargetVisualState } from '../../features/experience/types';

interface WorldTooltipProps {
    title: string;
    subtitle: string;
    side?: 'left' | 'right' | 'top';
    className?: string;
    state?: TargetVisualState;
}

export const WorldTooltip: React.FC<WorldTooltipProps> = ({ 
    title, 
    subtitle, 
    side = 'right',
    className = '',
    state = 'available',
}) => {
    const isRightSide = side === 'right';
    const isLeftSide = side === 'left';
    const isTopSide = side === 'top';

    const accentColor = state === 'verified' ? '#00F0FF' : '#F2D019';
    const accentGlow  = state === 'verified'
        ? 'rgba(0,240,255,0.55)'
        : 'rgba(242,208,25,0.55)';

    let positionClassName = '';
    if (isRightSide) {
        positionClassName = 'top-[15%] right-[-8%] translate-x-[-0.5vw]';
    } else if (isLeftSide) {
        positionClassName = 'top-[15%] left-[-8%] translate-x-[0.5vw]';
    } else if (isTopSide) {
        positionClassName = 'bottom-[94%] left-1/2 -translate-x-1/2 translate-y-[0.5vw]';
    }

    const clipPath = isTopSide
        ? 'polygon(0 0, 92% 0, 100% 12%, 100% 100%, 8% 100%, 0 88%)'
        : isRightSide
            ? 'polygon(0 0, 90% 0, 100% 16%, 100% 100%, 10% 100%, 0 84%)'
            : 'polygon(10% 0, 100% 0, 100% 84%, 90% 100%, 0 100%, 0 16%)';

    return (
        <div
            className={`world-tooltip absolute z-50 pointer-events-none ${positionClassName} ${className}`}
            data-target-state={state}
        >
            <div className={`relative flex items-center
                ${isRightSide ? 'flex-row' : ''}
                ${isLeftSide  ? 'flex-row-reverse' : ''}
                ${isTopSide   ? 'flex-col-reverse' : ''}
            `}>

                {/* Connector */}
                <div className={`flex items-center overflow-visible
                    ${isTopSide  ? 'flex-col-reverse' : ''}
                    ${isLeftSide ? 'flex-row-reverse' : ''}
                `}>
                    <div
                        className="relative w-3 h-3 rounded-full border-2 border-black z-10
                            transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                            opacity-90 scale-100 group-hover:scale-125 group-focus-visible:scale-125"
                        style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentGlow}` }}
                    />
                    <div
                        className={`transition-all duration-300 ease-out delay-150
                            ${isTopSide
                                ? 'w-[2px] h-4 group-hover:h-10 group-focus-visible:h-10'
                                : 'h-[2px] w-4 group-hover:w-10 group-focus-visible:w-10'
                            }`}
                        style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentGlow}` }}
                    />
                </div>

                {/* Label Box */}
                <div
                    className={`relative overflow-hidden
                        opacity-0 scale-95
                        group-hover:opacity-100   group-hover:scale-100
                        group-focus-visible:opacity-100 group-focus-visible:scale-100
                        transition-all duration-400 delay-200 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]
                        ${isRightSide ? 'ml-1' : ''} ${isLeftSide ? 'mr-1' : ''}
                    `}
                    style={{
                        background: 'rgba(4,4,4,0.95)',
                        border: `2px solid ${accentColor}`,
                        boxShadow: `0 0 0 1px rgba(0,0,0,0.9), 4px 4px 0 rgba(0,0,0,1), 0 0 18px ${accentGlow}`,
                        clipPath,
                        padding: isTopSide ? '6px 12px' : '7px 13px',
                    }}
                >
                    {/* Hazard stripe top */}
                    <div
                        className="absolute inset-x-0 top-0 h-[3px] pointer-events-none"
                        style={{
                            background: `repeating-linear-gradient(90deg, ${accentColor} 0 7px, transparent 7px 14px)`,
                            opacity: 0.75,
                        }}
                    />

                    {/* Metadata row */}
                    <div className={`flex items-center gap-1.5 mb-0.5 ${isTopSide ? 'justify-center' : isLeftSide ? 'flex-row-reverse' : ''}`}>
                        <span
                            className="font-mono text-[7px] font-black uppercase tracking-[0.3em] leading-none"
                            style={{ color: accentColor }}
                        >
                            {'◆ TARGET'}
                        </span>
                        <span className="h-[1px] flex-1" style={{ backgroundColor: `${accentColor}40` }} />
                    </div>

                    {/* Main title */}
                    <h3
                        className={`font-['Teko'] font-black uppercase leading-[0.85] tracking-[0.07em] whitespace-nowrap drop-shadow-[1px_1px_0_rgba(0,0,0,1)]
                            ${isTopSide ? 'text-center text-[1.5rem]' : 'text-left text-[1.65rem]'}
                            ${isLeftSide ? '!text-right' : ''}
                        `}
                        style={{ color: '#F5EED6' }}
                    >
                        {title}
                    </h3>

                    {/* Subtitle row */}
                    <div
                        className={`flex items-center gap-2 mt-1 pt-1 border-t
                            ${isTopSide ? 'justify-center' : isLeftSide ? 'flex-row-reverse' : ''}
                        `}
                        style={{ borderColor: `${accentColor}30` }}
                    >
                        <div
                            className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                            style={{ backgroundColor: accentColor, boxShadow: `0 0 5px ${accentGlow}` }}
                        />
                        <span
                            className="font-mono text-[8px] font-bold uppercase tracking-[0.22em]"
                            style={{ color: accentColor }}
                        >
                            {subtitle}
                        </span>
                    </div>

                    {/* Corner glint */}
                    <div
                        className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
                        style={{ background: `linear-gradient(135deg, transparent 50%, ${accentColor}1a 100%)` }}
                    />
                </div>
            </div>
        </div>
    );
};
