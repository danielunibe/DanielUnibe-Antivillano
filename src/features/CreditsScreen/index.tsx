import React, { useCallback, useMemo, useState } from 'react';
import { Icons } from '../StackScreen/assets/Icons';
import { GoBackButton } from '../../components/ui/GoBackButton';
import { useMusicPlayer } from '../music/MusicPlayerContext';
import { sfx } from '../../utils/SoundManager';

interface CreditsScreenProps {
    onClose: () => void;
    completedObjectives?: number;
    totalObjectives?: number;
    onOpenContact?: () => void;
    onOpenProjects?: () => void;
    onResetProgress?: () => void;
}

type CreditBlock = {
    eyebrow: string;
    title: string;
    lines: string[];
};

const CREDIT_THEME_PRIORITY = ['patio-de-chatarra', 'nucleo-del-exilio', 'not-the-role-they-gave'];

const CREDIT_BLOCKS: CreditBlock[] = [
    {
        eyebrow: 'PORTFOLIO EXPERIENCE',
        title: 'UNIBELANDS-3',
        lines: [
            'Interfaz cinematográfica de portafolio interactivo',
            'Dirección creativa, sensibilidad visual y producto: Daniel Unibe',
            'Inspiración: escenarios desérticos, UI diegética, loot panels y energía western sci-fi',
        ],
    },
    {
        eyebrow: 'BUILD PIPELINE',
        title: 'Stack técnico auditado',
        lines: [
            'React 19 + React DOM 19',
            'TypeScript 5.8',
            'Vite 6 como bundler y dev server',
            'Tailwind CSS + CSS global especializado',
            'Three.js para cielo, profundidad y atmósfera',
            'pnpm 10 como package manager',
            '@fontsource para tipografías locales',
            '@tanstack/react-query está instalado, pero su uso runtime no está confirmado en auditoría',
        ],
    },
    {
        eyebrow: 'CREATIVE / AI TOOLS',
        title: 'Herramientas mencionadas por dirección creativa',
        lines: [
            'Google Antigravity — apoyo de exploración/flujo, no dependencia del runtime',
            'Claude — apoyo de ideación/asistencia, no dependencia del runtime',
            'Codex — apoyo de implementación técnica, no dependencia del runtime',
            'ChatGPT — apoyo de dirección y asistencia, no dependencia del runtime',
            'Gemini — aparece como placeholder local no usado en runtime confirmado',
            'Adobe Photoshop — apoyo visual/assets declarado',
            'Adobe Illustrator — apoyo visual/assets declarado',
        ],
    },
    {
        eyebrow: 'WORLD SYSTEMS',
        title: 'Módulos visuales del portafolio',
        lines: [
            'Horizon zones: Oeste, Norte y Este',
            'Echo Portal para identidad central y acceso de contenido',
            'Loot Map para enlaces y nodos externos',
            'Projects Screen para quests/proyectos',
            'Stack Screen para tecnologías',
            'Contact Screen para comunicación',
            'Sand Fog + Three Sky para nubes, polvo y profundidad desértica',
        ],
    },
    {
        eyebrow: 'AUDIO LOG',
        title: 'Playlist local',
        lines: [
            'Canciones cargadas desde public/playlist.json',
            'Anti-Villano',
            'Not the Role They Gave',
            'Núcleo del Exilio',
            'Patio de Chatarra',
            'La pista temática se reproduce solo mediante la acción Play theme',
        ],
    },
    {
        eyebrow: 'DEPLOYMENT NOTES',
        title: 'Auditoría de salida',
        lines: [
            'Proyecto preparado como SPA estática',
            'Vercel recomendado como salida principal',
            'Netlify viable como salida secundaria',
            'GitHub Pages requiere revisar rutas absolutas antes de publicar',
        ],
    },
    {
        eyebrow: 'INTEGRITY NOTICE',
        title: 'Tecnologías no auditadas',
        lines: [
            'No se declaran repositorios externos como incorporados si no están auditados en el código',
            'Las herramientas creativas listadas no implican dependencia runtime',
            'Toda tecnología incorporada debe confirmarse desde package.json, código o documentación del repo',
            'Si luego se agregan repositorios externos, deben entrar a estos créditos solo después de auditoría',
        ],
    },
];

export const CreditsScreen: React.FC<CreditsScreenProps> = ({
    onClose,
    completedObjectives = 0,
    totalObjectives = 5,
    onOpenContact,
    onOpenProjects,
    onResetProgress,
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isRollPaused, setIsRollPaused] = useState(false);
    const { state, api } = useMusicPlayer();

    const activeTrack = state.playlist[state.currentIndex];
    const preferredTrackIndex = useMemo(() => {
        for (const trackId of CREDIT_THEME_PRIORITY) {
            const index = state.playlist.findIndex((track) => track.id === trackId);
            if (index >= 0) return index;
        }
        return state.playlist.length ? 0 : -1;
    }, [state.playlist]);

    const handleClose = useCallback(() => {
        sfx.play('CLICK');
        setIsClosing(true);
        setTimeout(onClose, 300);
    }, [onClose]);

    const handlePlayCreditsTheme = useCallback(() => {
        sfx.play('CLICK');
        const index = preferredTrackIndex >= 0 ? preferredTrackIndex : state.currentIndex;
        void api.setCurrentIndex(index, { autoplay: true });
    }, [api, preferredTrackIndex, state.currentIndex]);

    return (
        <div className={`fixed inset-0 z-[220] overflow-hidden bg-[#050505]/95 text-white select-none ${isClosing ? 'animate-out fade-out duration-300' : 'animate-stack-entry'}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,190,61,0.16),transparent_28%),linear-gradient(180deg,rgba(10,8,4,0.12),rgba(0,0,0,0.44)_72%)] backdrop-blur-[2px]" />
            <div className="interface-dot-grid" />
            <div
                className="pointer-events-none absolute inset-0 z-[12] opacity-40 mix-blend-screen"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='56' height='100' viewBox='0 0 56 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='%232DD4BF' stroke-width='1.5' stroke-opacity='0.5'/%3E%3Cpath d='M28 0L28 33' fill='none' stroke='%2300FFF0' stroke-width='1' stroke-opacity='0.35'/%3E%3C/svg%3E\")",
                    backgroundSize: '48px 86px',
                    backgroundPosition: '0 0',
                    maskImage: 'radial-gradient(circle at center, black 58%, transparent 110%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 58%, transparent 110%)',
                    animation: 'hex-drift 10s linear infinite',
                }}
            />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 via-black/30 to-transparent z-30" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 via-black/28 to-transparent z-30" />
            <div className="pointer-events-none absolute inset-0 z-20 border-[10px] border-white/8 shadow-[inset_0_0_90px_rgba(0,0,0,0.55)]" />

            <header className="relative z-40 flex h-[76px] items-center justify-between gap-4 border-b border-[#f2d019]/20 bg-black/32 px-4 md:px-6 backdrop-blur-xl">
                <GoBackButton onClick={handleClose} isClosing={isClosing} ariaLabel="Salir" title="Salir" />

                <div className="min-w-0 text-right">
                    <h1 className="truncate font-['Teko'] text-3xl font-black italic leading-none tracking-wider text-[#f2d019] sm:text-4xl md:text-5xl">
                        <span className="sm:hidden">CRÉDITOS</span><span className="hidden sm:inline">CREDITS_MODE</span>
                    </h1>
                    <span className="hidden font-mono text-[10px] font-bold tracking-[0.35em] text-[#00f0ff] sm:block">
                        MAKING_OF / PORTFOLIO_BUILD_LOG
                    </span>
                </div>
            </header>

            <main className="relative z-10 h-[calc(100vh-76px)] overflow-hidden">
                <section
                    className="credits-scroll-region absolute inset-x-4 bottom-5 top-5 overflow-hidden border border-[#f2d019]/30 bg-white/6 backdrop-blur-2xl md:inset-x-[12vw]"
                    aria-label="Credits transcript"
                    tabIndex={0}
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.045)_50%,rgba(0,0,0,0.18)_50%)",
                        backgroundSize: '100% 4px',
                    }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,190,61,0.08),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.08))]" />
                    <div
                        className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none"
                        style={{
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg width='56' height='100' viewBox='0 0 56 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='%23f2d019' stroke-width='1.2' stroke-opacity='0.45'/%3E%3C/svg%3E\")",
                            backgroundSize: '48px 86px',
                            maskImage: 'radial-gradient(circle at center, black 60%, transparent 112%)',
                            WebkitMaskImage: 'radial-gradient(circle at center, black 60%, transparent 112%)',
                            animation: 'hex-drift-reverse 14s linear infinite',
                        }}
                    />
                    <div className="absolute left-0 top-0 h-full w-2 bg-[#f2d019]" />
                    <div className="absolute right-0 top-0 h-full w-2 bg-[#f2d019]" />

                    <div
                        className="credits-roll mx-auto flex min-h-full max-w-4xl flex-col items-center px-6 text-center"
                        style={{ animationPlayState: isRollPaused ? 'paused' : 'running' }}
                    >
                        <div className="mb-14">
                            <p className="font-mono text-xs font-black uppercase tracking-[0.42em] text-[#00f0ff]">Vault Archive / Final Transmission</p>
                            <h2 className="mt-4 font-['Teko'] text-7xl font-black uppercase italic leading-none tracking-widest text-[#f2d019] md:text-8xl">
                                CREDITOS
                            </h2>
                            <p className="mt-4 font-['Roboto_Mono'] text-sm uppercase tracking-[0.2em] text-white/62">
                                Cómo se construyó esta experiencia de portafolio
                            </p>
                        </div>

                        {CREDIT_BLOCKS.map((block) => (
                            <article key={block.title} className="mb-16 w-full">
                                <p className="mb-2 font-mono text-[11px] font-black uppercase tracking-[0.35em] text-[#00f0ff]">{block.eyebrow}</p>
                                <h3 className="font-['Teko'] text-5xl font-black uppercase italic leading-none tracking-wider text-[#f2d019] md:text-6xl">
                                    {block.title}
                                </h3>
                                <div className="mt-5 space-y-2 font-['Roboto_Mono'] text-sm font-bold uppercase tracking-[0.12em] text-white/72 md:text-base">
                                    {block.lines.map((line) => (
                                        <p key={line}>{line}</p>
                                    ))}
                                </div>
                            </article>
                        ))}

                        <section className="mb-16 w-full border border-[#00f0ff]/30 bg-black/40 p-5">
                            <p className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#00f0ff]">CIERRE DE RECORRIDO</p>
                            <h3 className="mt-2 font-['Teko'] text-4xl font-black uppercase leading-none tracking-wide text-[#f2d019]">{completedObjectives}/{totalObjectives} SEÑALES VERIFICADAS</h3>
                            <p className="mx-auto mt-3 max-w-2xl font-['Roboto_Mono'] text-xs leading-relaxed text-white/62">El progreso refleja módulos realmente visitados durante esta sesión; no representa una calificación profesional.</p>
                            <div className="mt-5 flex flex-wrap justify-center gap-2">
                                {onOpenProjects && <button type="button" onClick={onOpenProjects} className="min-h-11 border border-[#f2d019] px-4 font-['Teko'] text-xl font-black uppercase tracking-wider text-[#f2d019] hover:bg-[#f2d019] hover:text-black">VER PROYECTOS</button>}
                                {onOpenContact && <button type="button" onClick={onOpenContact} className="min-h-11 border border-[#00f0ff] px-4 font-['Teko'] text-xl font-black uppercase tracking-wider text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black">CONTACTO</button>}
                                {onResetProgress && <button type="button" onClick={onResetProgress} className="min-h-11 border border-white/20 px-4 font-['Teko'] text-xl font-black uppercase tracking-wider text-white/65 hover:border-white hover:text-white">REINICIAR</button>}
                            </div>
                        </section>

                        <div className="mb-24 mt-2">
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">End of transmission</p>
                            <p className="mt-3 font-['Teko'] text-5xl font-black uppercase text-[#f2d019]">Gracias por jugar</p>
                        </div>
                    </div>
                </section>

                <aside className="absolute bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] -translate-x-1/2 flex-wrap items-center justify-between gap-3 border border-white/12 bg-black/72 px-4 py-3 backdrop-blur-xl md:w-auto md:min-w-[620px]">
                    <div className="min-w-0">
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/38">Current track</p>
                        <p className="truncate font-['Teko'] text-2xl font-bold uppercase leading-none tracking-wider text-[#f2d019]">
                            {activeTrack ? `${activeTrack.title}${activeTrack.artist ? ` / ${activeTrack.artist}` : ''}` : 'Playlist local pendiente'}
                        </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <button
                            type="button"
                            onClick={() => setIsRollPaused((value) => !value)}
                            className="border border-white/25 bg-white/8 px-3 py-2 font-['Teko'] text-xl font-black uppercase tracking-widest text-white transition hover:bg-white hover:text-black"
                        >
                            {isRollPaused ? 'Resume roll' : 'Pause roll'}
                        </button>
                        <button
                            type="button"
                            onClick={handlePlayCreditsTheme}
                            className="border border-[#00f0ff]/60 bg-[#00f0ff]/12 px-4 py-2 font-['Teko'] text-xl font-black uppercase tracking-widest text-[#00f0ff] transition hover:bg-[#00f0ff] hover:text-black"
                        >
                            Play theme
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    );
};
