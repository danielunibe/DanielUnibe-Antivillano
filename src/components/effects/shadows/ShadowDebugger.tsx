
import React, { useState, useRef, useEffect } from 'react';

export interface ShadowConfig {
    // Posición 2D
    x: number;
    y: number;
    // Apariencia
    blur: number;
    opacity: number;
    // Transformación 3D
    perspective: number;
    rotateX: number;
    skewX: number;
    scaleY: number;
    // Utilidades
    showGrid: boolean; 
}

interface ShadowDebuggerProps {
    title?: string;
    config: ShadowConfig;
    onUpdate: (newConfig: ShadowConfig) => void;
    isActive?: boolean;
}

export const ShadowDebugger: React.FC<ShadowDebuggerProps> = ({ title = "SHADOW", config, onUpdate, isActive = true }) => {
    const [mode, setMode] = useState<'sliders' | 'visual'>('visual');
    const [isDraggingSun, setIsDraggingSun] = useState(false);
    const [isDraggingTip, setIsDraggingTip] = useState(false);
    
    // Si no está activo, no renderizamos nada
    if (!isActive) return null;

    // Posiciones visuales simuladas
    const [sunPos, setSunPos] = useState({ x: 20, y: 20 }); 
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
        if (!overlayRef.current) return;
        const rect = overlayRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (isDraggingSun) {
            const xPercent = (mouseX / rect.width) * 100;
            const yPercent = (mouseY / rect.height) * 100;
            setSunPos({ x: xPercent, y: yPercent });

            const objectCenterX = rect.width * 0.5;
            const objectBaseY = rect.height * 0.8; 
            const dx = mouseX - objectCenterX;
            const dy = objectBaseY - mouseY;   

            const newSkewX = -(dx / rect.width) * 120;
            const normalizedHeight = Math.max(dy, 50);
            const newScaleY = (rect.height / normalizedHeight) * 0.5;

            onUpdate({
                ...config,
                skewX: Math.round(newSkewX),
                scaleY: parseFloat(Math.min(newScaleY, 3).toFixed(2))
            });
        }

        if (isDraggingTip) {
            const baseScreenX = rect.width * 0.5;
            const baseScreenY = rect.height * 0.85;
            const deltaX = mouseX - baseScreenX;
            const deltaY = mouseY - baseScreenY;
            const newSkew = (deltaX / 300) * 45; 
            const distY = Math.abs(deltaY);
            const newScale = (distY / 200);

            onUpdate({
                ...config,
                skewX: Math.round(newSkew),
                scaleY: parseFloat(Math.max(newScale, 0.1).toFixed(2))
            });
        }
    };

    const handleMouseUp = () => {
        setIsDraggingSun(false);
        setIsDraggingTip(false);
    };

    useEffect(() => {
        if (isDraggingSun || isDraggingTip) {
            window.addEventListener('mousemove', handleMouseMove as any);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove as any);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingSun, isDraggingTip]);

    const transformString = `perspective(${config.perspective}px) rotateX(${config.rotateX}deg) skewX(${config.skewX}deg) scaleY(${config.scaleY}) translate3d(${config.x}vw, ${config.y}vh, 0px)`;
    const filterString = `blur(${config.blur}px) brightness(0) opacity(${config.opacity})`;

    const copyToClipboard = () => {
        const fullCSS = `
/* SHADOW (${title}) */
transform-origin: bottom center;
transform: ${transformString};
filter: ${filterString};
pointer-events: none;
mix-blend-mode: multiply;
        `.trim();
        navigator.clipboard.writeText(fullCSS);
        alert(`CSS para ${title} copiado!`);
    };

    const toggleGrid = () => onUpdate({ ...config, showGrid: !config.showGrid });

    return (
        <>
            <div className="fixed top-4 right-4 z-[9999] bg-black/90 border-2 border-[#F2D019] p-4 rounded-lg w-80 shadow-2xl backdrop-blur-md text-white font-mono text-xs select-none">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                    <h3 className="font-bold text-[#F2D019] truncate mr-2">{title} STUDIO</h3>
                    <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => setMode('visual')} className={`px-2 py-1 rounded text-[10px] ${mode === 'visual' ? 'bg-[#F2D019] text-black font-bold' : 'bg-gray-800 text-gray-400'}`}>VISUAL</button>
                        <button onClick={() => setMode('sliders')} className={`px-2 py-1 rounded text-[10px] ${mode === 'sliders' ? 'bg-[#F2D019] text-black font-bold' : 'bg-gray-800 text-gray-400'}`}>SLIDERS</button>
                    </div>
                </div>

                {mode === 'visual' && (
                    <div className="mb-4 p-2 bg-gray-800/50 rounded text-gray-300 text-[10px]">
                        <p className="mb-1">☀️ Sol: Dirección de luz</p>
                        <p>🎯 Tip: Deformación manual</p>
                    </div>
                )}

                <div className="space-y-3 mb-4">
                    <Control label="Opacity" name="opacity" min={0} max={1} step={0.05} val={config.opacity} onChange={(e: any) => onUpdate({...config, opacity: parseFloat(e.target.value)})} />
                    <Control label="Blur" name="blur" min={0} max={20} step={0.5} val={config.blur} onChange={(e: any) => onUpdate({...config, blur: parseFloat(e.target.value)})} />
                    <div className="flex justify-between mt-2">
                         <button onClick={toggleGrid} className={`px-2 py-1 text-[9px] rounded border ${config.showGrid ? 'bg-cyan-900 border-cyan-500 text-cyan-100' : 'border-gray-600 text-gray-500'}`}>
                             {config.showGrid ? 'GRID' : 'OFF'}
                         </button>
                         <button onClick={copyToClipboard} className="px-2 py-1 text-[9px] bg-[#F2D019] text-black font-bold rounded">
                             COPIAR
                         </button>
                    </div>
                </div>

                {mode === 'sliders' && (
                    <div className="space-y-2 border-t border-gray-700 pt-2 animate-in fade-in">
                        <Control label="Persp." name="perspective" min={0} max={2000} step={10} val={config.perspective} onChange={(e: any) => onUpdate({...config, perspective: parseFloat(e.target.value)})} />
                        <Control label="Rot X" name="rotateX" min={0} max={180} val={config.rotateX} onChange={(e: any) => onUpdate({...config, rotateX: parseFloat(e.target.value)})} />
                        <Control label="Skew X" name="skewX" min={-90} max={90} val={config.skewX} onChange={(e: any) => onUpdate({...config, skewX: parseFloat(e.target.value)})} />
                        <Control label="Scale Y" name="scaleY" min={0} max={5} step={0.1} val={config.scaleY} onChange={(e: any) => onUpdate({...config, scaleY: parseFloat(e.target.value)})} />
                        <Control label="Pos X" name="x" min={-50} max={50} step={0.1} val={config.x} onChange={(e: any) => onUpdate({...config, x: parseFloat(e.target.value)})} />
                        <Control label="Pos Y" name="y" min={-50} max={50} step={0.1} val={config.y} onChange={(e: any) => onUpdate({...config, y: parseFloat(e.target.value)})} />
                    </div>
                )}
            </div>

            {mode === 'visual' && (
                <div ref={overlayRef} className="fixed inset-0 z-[9990] pointer-events-none">
                    <div 
                        onMouseDown={() => setIsDraggingSun(true)}
                        className="absolute w-12 h-12 -ml-6 -mt-6 cursor-move pointer-events-auto group z-50 transition-transform active:scale-110"
                        style={{ left: `${sunPos.x}%`, top: `${sunPos.y}%` }}
                    >
                        <div className="w-full h-full rounded-full bg-yellow-400 blur-sm animate-pulse opacity-80" />
                        <div className="absolute inset-2 rounded-full bg-white shadow-[0_0_20px_#F2D019]" />
                        <svg className="absolute top-1/2 left-1/2 overflow-visible w-0 h-0 pointer-events-none">
                            <line 
                                x1="0" y1="0" 
                                x2={(window.innerWidth * 0.5) - ((window.innerWidth * sunPos.x)/100)} 
                                y2={(window.innerHeight * 0.8) - ((window.innerHeight * sunPos.y)/100)} 
                                stroke="#F2D019" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" 
                            />
                        </svg>
                    </div>

                    <div 
                        onMouseDown={() => setIsDraggingTip(true)}
                        className="absolute cursor-move pointer-events-auto group z-50 transition-transform active:scale-125"
                        style={{ 
                            left: '50%', 
                            top: '80%', 
                            transform: `translate(${config.skewX * 0.2}vw, -${config.scaleY * 10}vh)` 
                        }}
                    >
                        <div className="w-6 h-6 -ml-3 -mt-3 border-2 border-[#00F0FF] rounded-full bg-[#00F0FF]/20 animate-bounce" />
                        <div className="absolute w-2 h-2 bg-white rounded-full -ml-1 -mt-1 top-0 left-0" />
                    </div>
                </div>
            )}
        </>
    );
};

const Control = ({ label, name, min, max, step = 1, val, onChange }: any) => (
    <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[10px] text-gray-400">
            <label>{label}</label>
            <span className="text-[#00F0FF]">{val}</span>
        </div>
        <input 
            type="range" name={name} min={min} max={max} step={step}
            value={val} onChange={onChange}
            className="w-full accent-[#F2D019] h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
    </div>
);
