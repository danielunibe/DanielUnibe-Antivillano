import React, { useCallback, useMemo, useState } from 'react';
import { GoBackButton } from '../../components/ui/GoBackButton';
import { PROJECTS } from '../ProjectsScreen/data';
import { STACK_DATABASE } from '../StackScreen/data';
import { Icons } from '../StackScreen/assets/Icons';
import { PROFILE_DATA } from '../profile/data';
import { useLocale } from '../profile/useLocale';

interface RecruiterScreenProps {
    onClose: () => void;
    onOpenProject: (projectId: number) => void;
    onOpenStack: () => void;
    onOpenContact: () => void;
    onOpenProfile: () => void;
}

const EVIDENCE = [
    { label: 'PRODUCT', value: 'Diseño de producto digital', tone: 'yellow' },
    { label: 'BUILD', value: 'Frontend interactivo', tone: 'cyan' },
    { label: 'WORLD', value: 'Arte 3D y experiencia espacial', tone: 'yellow' },
];

export const RecruiterScreen: React.FC<RecruiterScreenProps> = ({ onClose, onOpenProject, onOpenStack, onOpenContact, onOpenProfile }) => {
    const { t, text } = useLocale();
    const [showDetails, setShowDetails] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const featuredProjects = useMemo(() => PROJECTS.filter(project => project.featured).slice(0, 4), []);
    const capabilityNames = useMemo(() => STACK_DATABASE.slice(0, 8).map(item => item.name), []);
    const specialties = useMemo(() => PROFILE_DATA.specialties.map(specialty => text(specialty)), [text]);

    const handleRecruiterClose = useCallback(() => {
        setIsClosing(true);
        window.setTimeout(onClose, 280);
    }, [onClose]);

    return (
        <div
            data-screen="recruiter"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recruiter-title"
            tabIndex={-1}
            className={`fixed inset-0 z-[220] overflow-y-auto bg-[#050505] text-white ${isClosing ? 'animate-out fade-out duration-300' : 'animate-stack-entry'}`}
        >
            <div className="interface-dot-grid" />
            <div className="interface-screen-vignette" />
            <div className="pointer-events-none fixed inset-0 opacity-30 [background:linear-gradient(rgba(0,240,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.035)_1px,transparent_1px)] [background-size:42px_42px]" />

            <header className="sticky top-0 z-40 flex min-h-[78px] items-center justify-between gap-4 border-b border-white/10 bg-black/90 px-4 py-3 backdrop-blur-xl md:px-8">
                <GoBackButton onClick={handleRecruiterClose} isClosing={isClosing} ariaLabel="Salir" title="Salir" />
                <div className="min-w-0 text-right">
                    <p className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-[#00F0FF]">NORTH // PRIORITY CHANNEL</p>
                    <h1 id="recruiter-title" className="truncate font-['Teko'] text-3xl font-black uppercase leading-none tracking-wide text-[#F2D019] md:text-5xl"><span className="sm:hidden">RECRUITER</span><span className="hidden sm:inline">RECRUITER DOSSIER</span></h1>
                </div>
            </header>

            <main className="relative z-10 mx-auto w-full max-w-[1540px] space-y-7 px-4 py-6 md:space-y-10 md:px-8 md:py-10">
                <section className="relative overflow-hidden border border-[#F2D019]/45 bg-[linear-gradient(120deg,rgba(242,208,25,0.12),rgba(0,0,0,0.74)_42%,rgba(0,240,255,0.08))] p-5 shadow-[0_0_45px_rgba(0,0,0,0.42)] md:p-9">
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(0,240,255,0.2),transparent_65%)]" />
                    <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
                        <div>
                            <div className="mb-4 flex flex-wrap items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#00F0FF]">
                                <span className="border border-[#00F0FF]/60 bg-[#00F0FF]/10 px-2 py-1">IDENTITY LOCKED</span>
                                <span className="text-white/45">{PROFILE_DATA.name.toUpperCase()} // CREATIVE SYSTEMS</span>
                            </div>
                            <h2 className="max-w-4xl font-['Teko'] text-6xl font-black uppercase leading-[0.82] tracking-wide text-white md:text-8xl">Diseño sistemas que se sienten y funcionan.</h2>
                            <p className="mt-5 max-w-2xl font-['Roboto_Mono'] text-xs leading-relaxed text-white/70 md:text-sm">
                                {text(PROFILE_DATA.role)}. {text(PROFILE_DATA.summary)}
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {specialties.map(specialty => <span key={specialty} className="border border-white/15 bg-black/45 px-3 py-2 font-mono text-[9px] font-black tracking-[0.14em] text-white/75">{specialty}</span>)}
                            </div>
                        </div>
                        <div className="border-l-2 border-[#F2D019] pl-5 font-['Roboto_Mono'] text-xs leading-relaxed text-white/65">
                            <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#F2D019]">REVIEW IN 30 SECONDS</p>
                            <p className="mt-3">Una ficha de entrada para entender el perfil, revisar evidencia y decidir dónde profundizar.</p>
                            <div className="mt-5 flex flex-wrap gap-2">
                                <button type="button" onClick={onOpenContact} className="min-h-11 border border-[#00F0FF] bg-[#00F0FF] px-4 font-['Teko'] text-xl font-black uppercase tracking-wider text-black transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2D019]">CONTACTAR</button>
                                <button type="button" onClick={onOpenProfile} className="min-h-11 border border-[#F2D019] bg-[#F2D019] px-4 font-['Teko'] text-xl font-black uppercase tracking-wider text-black transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00F0FF]">{t('profile')}</button>
                                <button type="button" onClick={() => setShowDetails(value => !value)} className="min-h-11 border border-white/25 bg-black/50 px-4 font-['Teko'] text-xl font-black uppercase tracking-wider text-white transition hover:border-[#F2D019] hover:text-[#F2D019] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F2D019]">{showDetails ? 'OCULTAR' : 'VER PERFIL'}</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-3 md:grid-cols-3" aria-label="Evidence summary">
                    {EVIDENCE.map(item => (
                        <div key={item.label} className={`border-l-4 ${item.tone === 'cyan' ? 'border-[#00F0FF]' : 'border-[#F2D019]'} bg-white/[0.045] px-4 py-4`}>
                            <p className="font-mono text-[9px] font-black tracking-[0.24em] text-white/45">{item.label}</p>
                            <p className="mt-1 font-['Teko'] text-2xl font-black uppercase leading-none tracking-wide text-white">{item.value}</p>
                        </div>
                    ))}
                </section>

                {showDetails && (
                    <section className="grid gap-5 border border-[#00F0FF]/25 bg-[#00F0FF]/[0.035] p-5 md:grid-cols-3 md:p-7" aria-label="Professional profile details">
                        <Detail label="FOCUS" value="Interfaces interactivas, sistemas visuales y productos con alta densidad de información." />
                        <Detail label="BRIDGE" value="Documentación y prototipado para conectar equipos creativos con ingeniería." />
                        <Detail label="EVIDENCE POLICY" value="Las métricas, URLs y claims profesionales se publican únicamente después de verificación." />
                    </section>
                )}

                <section aria-labelledby="recruiter-projects-title">
                    <div className="mb-4 flex items-end justify-between gap-4 border-b border-white/10 pb-3">
                        <div>
                            <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#00F0FF]">EVIDENCE SELECTED // LIVE CATALOG</p>
                            <h2 id="recruiter-projects-title" className="font-['Teko'] text-4xl font-black uppercase leading-none tracking-wide text-[#F2D019] md:text-5xl">PROYECTOS DESTACADOS</h2>
                        </div>
                        <span className="hidden font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/40 sm:block">SELECT → INSPECT</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredProjects.map((project, index) => (
                            <button key={project.id} type="button" onClick={() => onOpenProject(project.id)} className="group relative min-h-[285px] overflow-hidden border border-white/10 bg-black/70 text-left transition hover:-translate-y-1 hover:border-[#F2D019] hover:shadow-[0_14px_35px_rgba(0,0,0,0.42)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00F0FF]">
                                <div className="absolute left-3 top-3 z-10 border border-black/60 bg-[#F2D019] px-2 py-1 font-mono text-[9px] font-black text-black">0{index + 1}</div>
                                <img src={project.image} alt="" className="h-44 w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" loading="lazy" />
                                <div className="absolute inset-x-0 top-28 h-16 bg-gradient-to-t from-black to-transparent" />
                                <div className="relative p-4">
                                    <p className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#00F0FF]">{project.type} · {project.status}</p>
                                    <h3 className="mt-1 font-['Teko'] text-3xl font-black uppercase leading-none tracking-wide text-white">{project.title}</h3>
                                    <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#F2D019]">ABRIR CASO →</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
                    <div className="border border-white/10 bg-white/[0.035] p-5 md:p-7">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#00F0FF]">CAPABILITY LOADOUT</p>
                                <h2 className="font-['Teko'] text-4xl font-black uppercase leading-none tracking-wide text-[#F2D019]">STACK DE TRABAJO</h2>
                            </div>
                            <button type="button" onClick={onOpenStack} className="hidden min-h-10 border border-[#F2D019] px-3 font-['Teko'] text-lg font-black uppercase tracking-wider text-[#F2D019] transition hover:bg-[#F2D019] hover:text-black sm:block">VER TODO</button>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {capabilityNames.map(name => <span key={name} className="border border-white/15 bg-black/40 px-3 py-3 font-mono text-[9px] font-black uppercase tracking-[0.08em] text-white/72">{name}</span>)}
                        </div>
                        <button type="button" onClick={onOpenStack} className="mt-4 min-h-11 w-full border border-[#F2D019] px-4 font-['Teko'] text-xl font-black uppercase tracking-wider text-[#F2D019] transition hover:bg-[#F2D019] hover:text-black sm:hidden">VER STACK COMPLETO</button>
                    </div>
                    <div className="border border-white/10 bg-black/45 p-5 md:p-7">
                        <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#00F0FF]">TRANSPARENCY LAYER</p>
                        <h2 className="font-['Teko'] text-4xl font-black uppercase leading-none tracking-wide text-[#F2D019]">ESTADO DE EVIDENCIA</h2>
                        <ul className="mt-5 space-y-3 font-['Roboto_Mono'] text-xs leading-relaxed text-white/65">
                            <li><span className="mr-2 text-[#00F0FF]">●</span> Catálogo de proyectos y stack reutilizado desde la aplicación.</li>
                            <li><span className="mr-2 text-[#F2D019]">●</span> Los casos se abren para revisar contexto y proceso.</li>
                            <li><span className="mr-2 text-[#ef4444]">●</span> CV, métricas y enlaces externos requieren verificación editorial.</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
    <div>
        <p className="font-mono text-[9px] font-black tracking-[0.24em] text-[#00F0FF]">{label}</p>
        <p className="mt-2 font-['Roboto_Mono'] text-xs leading-relaxed text-white/70">{value}</p>
    </div>
);
