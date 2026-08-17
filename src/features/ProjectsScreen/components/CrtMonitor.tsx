import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { Project } from '../types';
import { VoyagerOS } from '../../VoyagerOS';
import './crt-monitor.css';

interface CrtMonitorProps {
    project: Project;
    channelIndex: number;
    showDetails: boolean;
    onToggleDetails: () => void;
    onLaunch?: (url?: string) => void;
}

// Audio sintetizado suave exacto del simulador original
class RetroCrtAudio {
    private ctx: AudioContext | null = null;

    private getContext(): AudioContext | null {
        try {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
                this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            return this.ctx;
        } catch {
            return null;
        }
    }

    blip(f = 440, d = 0.05, type: OscillatorType = 'square') {
        try {
            const ctx = this.getContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const t = ctx.currentTime;
            osc.type = type;
            osc.frequency.setValueAtTime(f, t);
            gain.gain.setValueAtTime(0.03, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + (d || 0.05));
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + (d || 0.05));
        } catch {
            // Ignorar
        }
    }
}

const crtAudio = new RetroCrtAudio();

export const CrtMonitor: React.FC<CrtMonitorProps> = ({
    project,
    channelIndex,
    showDetails,
    onToggleDetails,
    onLaunch
}) => {
    const [power, setPower] = useState(true);
    const [isZapping, setIsZapping] = useState(false);
    const [osdText, setOsdText] = useState('VOYAGER OS · v1.0');
    const [osdVisible, setOsdVisible] = useState(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [isVoyagerActive, setIsVoyagerActive] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [screenCursor, setScreenCursor] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
    const osdTimerRef = useRef<NodeJS.Timeout | null>(null);

    const showOSD = useCallback((text: string) => {
        setOsdText(text);
        setOsdVisible(true);
        if (osdTimerRef.current) clearTimeout(osdTimerRef.current);
        osdTimerRef.current = setTimeout(() => {
            setOsdVisible(false);
        }, 1300);
    }, []);

    const triggerZap = useCallback(() => {
        setIsZapping(true);
        setTimeout(() => {
            setIsZapping(false);
        }, 300);
    }, []);

    // Efecto al cambiar de proyecto o canal
    useEffect(() => {
        if (power) {
            triggerZap();
            const chStr = channelIndex < 10 ? `0${channelIndex}` : `${channelIndex}`;
            showOSD(`CANAL ${chStr} · ${project.title}`);
        }
    }, [project.id, channelIndex, power, triggerZap, showOSD, project.title]);

    // Manejo de Power
    const handleTogglePower = useCallback(() => {
        setPower(prev => {
            const next = !prev;
            if (next) {
                setTimeout(() => {
                    triggerZap();
                    showOSD('VOYAGER OS · ONLINE');
                }, 450);
            }
            return next;
        });
    }, [showOSD, triggerZap]);

    // Pulsación de tecla interactiva
    const handleKeyPress = useCallback((keyName: string) => {
        setActiveKey(keyName);
        crtAudio.blip(480 + Math.random() * 220, 0.045);
        setTimeout(() => {
            setActiveKey(null);
        }, 130);
    }, []);

    // Escucha teclado físico opcional para feedback
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            handleKeyPress(key);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyPress]);

    return (
        <div className="crt-viewport-container">
            <div 
                className="crt-stage"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* ═══════ MONITOR (3:2) ═══════ */}
                <div className={`mon ${isHovered ? 'is-facing-forward' : ''}`} id="mon">
                    <div className="face front">
                        <div className="grunge" />
                        <div className={`bezel ${!power ? 'off-wrap' : ''}`} id="bezel">
                            <span className="screw tl" />
                            <span className="screw tr" />
                            <span className="screw bl" />
                            <span className="screw br" />

                            <div className={`crt ${!power ? 'off' : ''} ${isZapping ? 'zap' : ''}`} id="crt">
                                <div className={`crt-live ${power ? 'expand' : 'collapse'}`} id="crtLive">
                                    {/* CONTENIDO DIRECTO DENTRO DE LA PANTALLA CRT */}
                                    <div 
                                        className="screen-content relative h-full w-full overflow-hidden cursor-none" 
                                        id="screen-content"
                                        onMouseMove={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setScreenCursor({
                                                x: e.clientX - rect.left,
                                                y: e.clientY - rect.top,
                                                visible: true
                                            });
                                        }}
                                        onMouseLeave={() => {
                                            setScreenCursor(prev => ({ ...prev, visible: false }));
                                        }}
                                    >
                                        {/* Cursor Virtual Retro Sincronizado */}
                                        {screenCursor.visible && (
                                            <div 
                                                className="pointer-events-none absolute z-[9999] -translate-x-0.5 -translate-y-0.5"
                                                style={{ 
                                                    left: `${screenCursor.x}px`, 
                                                    top: `${screenCursor.y}px` 
                                                }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_0_6px_rgba(242,208,25,0.9)]">
                                                    <path d="M3 3L10.5 21L13.5 13.5L21 10.5L3 3Z" fill="#F2D019" stroke="#000" strokeWidth="1.5" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        )}

                                        {/* Vista Directa: VoyagerOS con Navegador Simulado Integrado */}
                                        {isVoyagerActive ? (
                                            <div className="absolute inset-0 h-full w-full">
                                                <VoyagerOS activeProject={project} />
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 h-full w-full bg-black">
                                                <ProjectMediaItem project={project} />

                                                {/* In-Screen Overlay Info */}
                                                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-6">
                                                    <h2 className="font-['Teko'] text-3xl font-bold uppercase tracking-wide text-[#f4a91f] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                                                        {project.title}
                                                    </h2>
                                                    <p className="line-clamp-2 font-mono text-[11px] leading-snug text-white/80 mt-1">
                                                        {project.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Details Drawer */}
                                        {showDetails && (
                                            <div className="absolute inset-0 z-40 flex flex-col bg-black/95 p-4 text-white backdrop-blur animate-in fade-in duration-200">
                                                <div className="flex items-center justify-between border-b border-[#f4a91f]/40 pb-2 mb-2.5">
                                                    <div>
                                                        <span className="font-mono text-[9px] text-[#2fa39b] uppercase tracking-widest">
                                                            INFO // {project.type}
                                                        </span>
                                                        <h3 className="font-['Teko'] text-3xl font-bold uppercase text-[#f4a91f] leading-none">
                                                            {project.title}
                                                        </h3>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={onToggleDetails}
                                                        className="border border-white/20 px-2 py-0.5 font-mono text-[10px] text-white/70 hover:bg-white/10"
                                                    >
                                                        [X]
                                                    </button>
                                                </div>

                                                <div className="sci-fi-scroll flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono text-[11px] leading-relaxed text-white/80">
                                                    <p className="border-l-2 border-[#f4a91f] pl-2 text-white">
                                                        {project.desc}
                                                    </p>

                                                    {project.caseStudy ? (
                                                        <>
                                                            <div>
                                                                <span className="font-bold text-[#2fa39b] uppercase block text-[9px]">CONTEXTO:</span>
                                                                <p className="text-white/70">{project.caseStudy.context}</p>
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-[#2fa39b] uppercase block text-[9px]">CONTRIBUCIÓN:</span>
                                                                <p className="text-white/70">{project.caseStudy.contribution}</p>
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-[#2fa39b] uppercase block text-[9px]">PROCESO:</span>
                                                                <ul className="list-disc list-inside space-y-0.5 text-white/70">
                                                                    {project.caseStudy.process.map(p => (
                                                                        <li key={p}>{p}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-[#2fa39b] uppercase block text-[9px]">EVIDENCIA:</span>
                                                                <ul className="list-disc list-inside space-y-0.5 text-white/70">
                                                                    {project.caseStudy.evidence.map(e => (
                                                                        <li key={e}>{e}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <p className="italic text-white/40">Detalles adicionales pendientes de documentar.</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* OSD */}
                                    <div className={`osd ${osdVisible ? 'show' : ''}`} id="osd">
                                        {osdText}
                                    </div>
                                </div>

                                <div className="vignette" />
                                <div className="glare" />
                            </div>
                        </div>
                    </div>

                    <div className="face right"><div className="side-groove" /><div className="side-groove g2" /><div className="grunge" /></div>
                    <div className="face left"><div className="grunge" /></div>
                    <div className="face top"><div className="tvents" /><div className="grunge" /></div>
                    <div className="face bottom" />

                    <div className="hump">
                        <div className="hf h-back"><div className="h-vents" /></div>
                        <div className="hf h-top" />
                        <div className="hf h-bot" />
                        <div className="hf h-right" />
                        <div className="hf h-left" />
                    </div>

                    <div className="neck"><div className="nt" /><div className="nf" /></div>
                    <div className="base"><div className="bt" /><div className="br" /><div className="bf" /></div>
                    <div className="gshadow" />
                </div>

                {/* ═══════ TECLADO ═══════ */}
                <div className="kb-shadow" />
                <div className="kb" id="kb">
                    <div className="kb-back" />
                    <div className="kb-sideL" />
                    <div className="kb-sideR" />
                    <div className="kb-front" />
                    <div className="kb-lid">
                        <div className="krow">
                            <KeyButton k="ESC" label="ESC" className="t-teal w15" activeKey={activeKey} onPress={handleKeyPress} />
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='].map(k => (
                                <KeyButton key={k} k={k} label={k} activeKey={activeKey} onPress={handleKeyPress} />
                            ))}
                            <KeyButton k="BACK" label="◄ BKSP" className="t-red w2" activeKey={activeKey} onPress={handleKeyPress} />
                        </div>
                        <div className="krow">
                            <KeyButton k="TAB" label="TAB" className="w15" activeKey={activeKey} onPress={handleKeyPress} />
                            {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'].map(k => (
                                <KeyButton key={k} k={k} label={k} activeKey={activeKey} onPress={handleKeyPress} />
                            ))}
                            <KeyButton k="\\" label="\\" className="w15" activeKey={activeKey} onPress={handleKeyPress} />
                        </div>
                        <div className="krow">
                            <KeyButton k="CAPS" label="CAPS" className="w17" activeKey={activeKey} onPress={handleKeyPress} />
                            {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"].map(k => (
                                <KeyButton key={k} k={k} label={k} activeKey={activeKey} onPress={handleKeyPress} />
                            ))}
                            <KeyButton k="ENTER" label="ENTER ↵" className="t-amber w22" activeKey={activeKey} onPress={handleKeyPress} />
                        </div>
                        <div className="krow">
                            <KeyButton k="SHIFT" label="⇧ SHIFT" className="w24" activeKey={activeKey} onPress={handleKeyPress} />
                            {['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'].map(k => (
                                <KeyButton key={k} k={k} label={k} activeKey={activeKey} onPress={handleKeyPress} />
                            ))}
                            <KeyButton k="SHIFT" label="SHIFT ⇧" className="w24" activeKey={activeKey} onPress={handleKeyPress} />
                        </div>
                        <div className="krow">
                            <KeyButton k="CTRL" label="CTRL" className="w15" activeKey={activeKey} onPress={handleKeyPress} />
                            <KeyButton k="ALT" label="ALT" className="w15" activeKey={activeKey} onPress={handleKeyPress} />
                            <KeyButton k="SPACE" label="" className="wide" activeKey={activeKey} onPress={handleKeyPress} />
                            <KeyButton k="ALT" label="ALT" className="w15" activeKey={activeKey} onPress={handleKeyPress} />
                            <KeyButton k="CTRL" label="CTRL" className="w15" activeKey={activeKey} onPress={handleKeyPress} />
                            <KeyButton k="◄" label="◄" activeKey={activeKey} onPress={handleKeyPress} />
                            <KeyButton k="►" label="►" activeKey={activeKey} onPress={handleKeyPress} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KeyButton: React.FC<{
    k: string;
    label: string;
    className?: string;
    activeKey: string | null;
    onPress: (k: string) => void;
}> = ({ k, label, className = '', activeKey, onPress }) => (
    <div
        className={`key ${className} ${activeKey === k ? 'pressed' : ''}`}
        data-k={k}
        onClick={() => onPress(k)}
    >
        {label}
    </div>
);

const ProjectMediaItem: React.FC<{ project: Project }> = ({ project }) => {
    if (project.embedUrl) {
        return (
            <iframe
                title={`${project.title} preview`}
                src={project.embedUrl}
                className="absolute inset-0 h-full w-full bg-black border-none"
                loading="lazy"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
        );
    }

    if (project.videoUrl) {
        return (
            <video
                className="absolute inset-0 h-full w-full bg-black object-contain"
                src={project.videoUrl}
                controls
                playsInline
                preload="metadata"
            />
        );
    }

    return (
        <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 h-full w-full bg-black object-contain"
            draggable="false"
        />
    );
};
