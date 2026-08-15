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

    // Configuración de posición base del contenedor
    let positionClassName = '';
    
    if (isRightSide) {
        positionClassName = 'top-[20%] right-[-10%] translate-x-[-0.5vw]'; 
    } else if (isLeftSide) {
        positionClassName = 'top-[20%] left-[-10%] translate-x-[0.5vw]';
    } else if (isTopSide) {
        positionClassName = 'bottom-[90%] left-1/2 -translate-x-1/2 translate-y-[0.5vw]';
    }

    return (
        <div 
            className={`world-tooltip
                absolute z-50 pointer-events-none 
                ${positionClassName}
                ${className}
            `}
            data-target-state={state}
        >
            <div className={`
                relative flex items-center 
                ${isRightSide ? 'flex-row' : ''}
                ${isLeftSide ? 'flex-row-reverse' : ''}
                ${isTopSide ? 'flex-col-reverse' : ''}
            `}>
                
                {/* 1. CONECTOR (PUNTO Y LÍNEA) */}
                <div className={`
                    flex items-center overflow-visible
                    ${isTopSide ? 'flex-col-reverse' : ''}
                    ${isLeftSide ? 'flex-row-reverse' : ''}
                `}>
                    
                    {/* PASO 1: Punto de anclaje (Pop inmediato) */}
                    <div className="
                        w-3 h-3 bg-[#F2D019] rounded-full shadow-[0_0_10px_#F2D019] border-2 border-black z-10
                        opacity-90 scale-100 group-hover:scale-110 group-focus-visible:scale-110
                        transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                    " />
                    
                    {/* PASO 2: Línea conectora (Se extiende después del punto) */}
                    <div className={`
                        bg-[#F2D019] shadow-[0_0_8px_#F2D019]
                        transition-all duration-300 ease-out delay-150
                        ${isTopSide 
                            ? 'w-[3px] h-6 group-hover:h-12 group-focus-visible:h-12' // Crece verticalmente
                            : 'h-[3px] w-6 group-hover:w-12 group-focus-visible:w-12' // Crece horizontalmente
                        }
                    `} />
                </div>
                
                {/* 2. CAJA PRINCIPAL */}
                <div 
                    className={`
                        bg-[#141414]/95 border-[#F2D019] 
                        backdrop-blur-md relative overflow-hidden
                        /* Animación de la caja: Pop elástico con delay */
                        opacity-90 scale-100 group-hover:opacity-100 group-hover:scale-105 group-focus-visible:opacity-100 group-focus-visible:scale-105
                        transition-all duration-500 delay-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]

                        /* Estilos estáticos según orientación */
                        ${isTopSide ? 'mb-0 border-b-4 skew-x-[-10deg] p-3' : 'p-4 shadow-[8px_8px_0px_rgba(0,0,0,1)]'}
                        ${isRightSide ? 'ml-0 border-l-4 -skew-x-[15deg]' : ''}
                        ${isLeftSide ? 'mr-0 border-r-4 skew-x-[15deg]' : ''}
                    `}
                >
                    {/* Decoración de fondo */}
                    <div 
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(#F2D019 1px, transparent 1px)',
                            backgroundSize: '4px 4px'
                        }}
                    />

                    {/* Flash de gradiente */}
                    <div className={`absolute top-0 w-24 h-24 bg-gradient-to-bl from-[#F2D019]/40 to-transparent pointer-events-none ${isRightSide ? 'right-0' : 'left-0'}`} />
                    
                    {/* 3. CONTENIDO (TEXTO) */}
                    <div className={`
                        transform 
                        /* Animación del texto: Slide In con más delay */
                        opacity-100 translate-y-0 group-hover:translate-y-[-2px] group-focus-visible:translate-y-[-2px]
                        transition-all duration-300 delay-[450ms] ease-out

                        /* Ajustes de sesgo para contrarrestar el contenedor */
                        ${isRightSide ? 'skew-x-[15deg] text-left' : ''}
                        ${isLeftSide ? '-skew-x-[15deg] text-right' : ''}
                        ${isTopSide ? 'skew-x-[10deg] text-center' : ''}
                    `}>
                        <h3 className="font-['Teko'] text-3xl font-bold text-[#F2D019] leading-[0.8] tracking-widest drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] whitespace-nowrap">
                            {title}
                        </h3>
                        
                        <div className={`
                            flex items-center gap-2 mt-2 border-t-2 border-[#F2D019]/30 pt-1
                            ${isRightSide ? 'justify-start' : ''}
                            ${isLeftSide ? 'flex-row-reverse' : ''}
                            ${isTopSide ? 'justify-center' : ''}
                        `}>
                            <div className="w-2 h-2 bg-[#00F0FF] animate-pulse rounded-full shadow-[0_0_5px_#00F0FF]" />
                            <span className="font-['Roboto_Mono'] text-sm text-[#00F0FF] tracking-widest font-bold uppercase drop-shadow-md">
                                {subtitle}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
