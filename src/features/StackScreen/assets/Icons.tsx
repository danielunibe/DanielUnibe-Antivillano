
import React from 'react';

interface IconProps {
    className?: string;
    color?: string;
}

// Estilo base para todos los iconos: Trazo fino, angulos rectos, look técnico
export const Icons = {
    // CATEGORÍA: TODO (Database Grid)
    All: ({ className = "w-5 h-5" }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3H10V10H3V3Z" strokeLinecap="square" />
            <path d="M14 3H21V10H14V3Z" strokeLinecap="square" />
            <path d="M14 14H21V21H14V14Z" strokeLinecap="square" />
            <path d="M3 14H10V21H3V14Z" strokeLinecap="square" />
            <path d="M7 10V14" strokeWidth="1" opacity="0.5" />
            <path d="M17 10V14" strokeWidth="1" opacity="0.5" />
            <path d="M10 7H14" strokeWidth="1" opacity="0.5" />
            <path d="M10 17H14" strokeWidth="1" opacity="0.5" />
        </svg>
    ),

    // CATEGORÍA: GRÁFICO (Pen Tool / Vector Node)
    Graphic: ({ className = "w-5 h-5" }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 22H22L12 2Z" strokeLinecap="square" opacity="0.2" fill="currentColor" />
            <circle cx="12" cy="5" r="3" strokeLinecap="square" />
            <circle cx="5" cy="19" r="2" strokeLinecap="square" />
            <circle cx="19" cy="19" r="2" strokeLinecap="square" />
            <path d="M10 7.5L6.5 17.5" strokeWidth="1.5" />
            <path d="M14 7.5L17.5 17.5" strokeWidth="1.5" />
        </svg>
    ),

    // CATEGORÍA: UI/UX (Layout / Wireframe)
    UIUX: ({ className = "w-5 h-5" }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="18" strokeLinecap="square" />
            <path d="M2 9H22" strokeWidth="1.5" />
            <path d="M8 9V21" strokeWidth="1.5" />
            <circle cx="5" cy="6" r="1" fill="currentColor" stroke="none" />
            <path d="M14 13H18" strokeWidth="1.5" opacity="0.6" />
            <path d="M14 17H18" strokeWidth="1.5" opacity="0.6" />
        </svg>
    ),

    // CATEGORÍA: GAME (Gamepad Abstracto)
    Game: ({ className = "w-5 h-5" }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12H6M18 12H22" strokeLinecap="square" />
            <path d="M22 12C22 16.4183 18.4183 20 14 20H10C5.58172 20 2 16.4183 2 12C2 7.58172 5.58172 4 10 4H14C18.4183 4 22 7.58172 22 12Z" strokeLinecap="square" />
            <path d="M8 10V14M6 12H10" strokeLinecap="square" strokeWidth="1.5" />
            <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
            <circle cx="17" cy="10" r="1" fill="currentColor" stroke="none" />
        </svg>
    ),

    // CATEGORÍA: AI (Brain / Circuit)
    AI: ({ className = "w-5 h-5" }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2V4" strokeLinecap="square" />
            <path d="M12 20V22" strokeLinecap="square" />
            <path d="M2 12H4" strokeLinecap="square" />
            <path d="M20 12H22" strokeLinecap="square" />
            <path d="M4.92993 4.92993L6.34993 6.34993" strokeLinecap="square" />
            <path d="M17.6499 17.6499L19.0699 19.0699" strokeLinecap="square" />
            <path d="M19.0699 4.92993L17.6499 6.34993" strokeLinecap="square" />
            <path d="M6.34993 17.6499L4.92993 19.0699" strokeLinecap="square" />
            <rect x="7" y="7" width="10" height="10" strokeLinecap="square" />
            <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
    ),

    // MODE: WEAPON (Rifle Silhouette)
    Weapon: ({ className = "w-5 h-5" }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19H9L19 9L15 5L5 15V19H4Z" strokeLinecap="square" />
            <path d="M13 7L17 11" strokeWidth="1.5" />
            <path d="M2 22L22 2" strokeWidth="1" opacity="0.3" strokeDasharray="2 2"/>
        </svg>
    ),

    // MODE: STACK (Layers / Server)
    Stack: ({ className = "w-5 h-5" }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="square" fill="currentColor" fillOpacity="0.1"/>
            <path d="M2 17L12 22L22 17" strokeLinecap="square" />
            <path d="M2 12L12 17L22 12" strokeLinecap="square" />
        </svg>
    ),

    // UTILS: SETTINGS (Gear / System Control)
    Settings: ({ className = "w-5 h-5" }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" strokeLinecap="square" />
            <path d="M12 2V5" strokeLinecap="square" />
            <path d="M12 19V22" strokeLinecap="square" />
            <path d="M2 12H5" strokeLinecap="square" />
            <path d="M19 12H22" strokeLinecap="square" />
            <path d="M4.9 4.9L7 7" strokeLinecap="square" />
            <path d="M17 17L19.1 19.1" strokeLinecap="square" />
            <path d="M19.1 4.9L17 7" strokeLinecap="square" />
            <path d="M7 17L4.9 19.1" strokeLinecap="square" />
            <circle cx="12" cy="12" r="6.5" opacity="0.35" />
        </svg>
    ),
    
    // UTILS: CLOSE (X with frame)
    Close: ({ className = "w-5 h-5" }: IconProps) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18" strokeLinecap="square" />
            <path d="M6 6L18 18" strokeLinecap="square" />
        </svg>
    )
};
