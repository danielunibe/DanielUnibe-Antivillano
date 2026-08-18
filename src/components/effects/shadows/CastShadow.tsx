
import React, { lazy, Suspense, useState } from 'react';
import type { ShadowConfig } from './ShadowDebugger';

// Dev-only panel: excluded from the production bundle via dead-code elimination.
const DevShadowDebugger =
    import.meta.env.DEV
        ? lazy(() => import('./ShadowDebugger').then((m) => ({ default: m.ShadowDebugger })))
        : null;

interface CastShadowProps {
    /** La imagen o elemento que proyecta la sombra (normalmente el objeto visible) */
    children: React.ReactNode;
    /** URL de la imagen que se usará como forma de la sombra */
    shadowSrc: string;
    /** Nombre para identificar en el debugger */
    debugId?: string;
    /** Activar el panel de control */
    enableDebug?: boolean;
    /** Configuración inicial de la sombra */
    initialConfig?: Partial<ShadowConfig>;
    /** Estilos extra para el contenedor */
    className?: string;
    style?: React.CSSProperties;
    /** Altura para el elemento de la sombra (debe coincidir o ajustarse a la imagen) */
    height?: string;
}

const DEFAULT_CONFIG: ShadowConfig = {
    x: 0, y: 0,
    blur: 4, opacity: 0.5,
    perspective: 600, rotateX: 60, skewX: 0, scaleY: 1,
    showGrid: false
};

export const CastShadow: React.FC<CastShadowProps> = ({ 
    children, 
    shadowSrc, 
    debugId = "OBJECT", 
    enableDebug = false, 
    initialConfig = {},
    className = "",
    style = {},
    height = "100%"
}) => {
    // Fusionar configuración inicial con defaults
    const [config, setConfig] = useState<ShadowConfig>({ ...DEFAULT_CONFIG, ...initialConfig });

    return (
        <div className={`relative ${className}`} style={style}>
            
            {/* 1. DEBUGGER (Solo si está habilitado y en entorno de desarrollo) */}
            {enableDebug && DevShadowDebugger && (
                <Suspense fallback={null}>
                    <DevShadowDebugger
                        title={debugId}
                        config={config}
                        onUpdate={setConfig}
                    />
                </Suspense>
            )}

            {/* 2. LA SOMBRA (Hyper-Realistic Layer) */}
            <img 
                src={shadowSrc}
                alt=""
                className="absolute bottom-0 left-0 select-none object-contain object-bottom pointer-events-none"
                style={{
                    height: height,
                    width: '100%', // Asegura que ocupe el contenedor
                    transformOrigin: 'bottom center',
                    transform: `
                        perspective(${config.perspective}px) 
                        rotateX(${config.rotateX}deg) 
                        skewX(${config.skewX}deg) 
                        scaleY(${config.scaleY}) 
                        translate3d(calc(var(--stage-w) * ${config.x}), calc(var(--stage-h) * ${config.y}), 0px)
                    `,
                    filter: `blur(${config.blur}px) brightness(0) opacity(${config.opacity})`,
                    zIndex: -1, // Siempre detrás
                    mixBlendMode: 'multiply' // FUSIÓN REALISTA CON EL SUELO
                }}
            />

            {/* 3. MALLA DE AYUDA (GRID) */}
            {config.showGrid && enableDebug && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[50%] z-0 pointer-events-none"
                    style={{
                        background: `
                            linear-gradient(to right, rgba(0, 240, 255, 0.3) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                        transformOrigin: 'bottom center',
                        transform: 'perspective(600px) rotateX(60deg) translateY(10%)',
                        opacity: 0.5
                    }}
                >
                    <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-[#F2D019] rounded-full -translate-x-1" />
                </div>
            )}

            {/* 4. EL OBJETO REAL (Children) */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};
