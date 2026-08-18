import React, { useCallback, useMemo, useState } from 'react';
import { sfx } from '../../utils/SoundManager';
import { GoBackButton } from '../../components/ui/GoBackButton';
import { PROJECTS } from './data';
import { Project } from './types';
import { CrtMonitor } from './components/CrtMonitor';
import { LootMapEmblem } from '../../components/ui/LootMapEmblem';
import { getProjectEmoji } from './logos';

interface ProjectsScreenProps {
    onClose: () => void;
    initialProjectId?: number | string;
    onInspectProject?: (project: Project) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ onClose, initialProjectId, onInspectProject }) => {
    const [selectedProjectId, setSelectedProjectId] = useState<number | string | undefined>(initialProjectId);
    const [showProjectOverlay, setShowProjectOverlay] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const selectedProject = selectedProjectId ? (PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0]) : undefined;

    const currentChannel = useMemo(() => {
        if (!selectedProjectId) return 0;
        const idx = PROJECTS.findIndex(p => p.id === selectedProjectId);
        return idx >= 0 ? idx + 1 : 0;
    }, [selectedProjectId]);

    const handleProjectsClose = useCallback(() => {
        sfx.play('CLICK');
        setIsClosing(true);
        setTimeout(onClose, 300);
    }, [onClose]);

    const handleProjectLaunch = useCallback((url?: string) => {
        if (!url) return;
        sfx.play('CLICK');
        window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    const handleSelectProject = useCallback((project: Project) => {
        sfx.play('CLICK');
        setSelectedProjectId(project.id);
        setShowProjectOverlay(true);
        onInspectProject?.(project);
    }, [onInspectProject]);

    const handleCloseProjectOverlay = useCallback(() => {
        sfx.play('CLICK');
        setShowProjectOverlay(false);
    }, []);

    return (
        <div className={`fixed inset-0 z-[200] w-screen h-screen overflow-hidden bg-[#07090c] text-white select-none ${isClosing ? 'animate-out fade-out duration-300' : 'animate-stack-entry'}`}>
            {/* Fondo Atmosférico Pantalla Completa Exacto de IntroScreen */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_45%,#131720_0%,#07090c_75%)]" />
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* SVG del Emblema de la Cámara Animado en Fondo */}
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                <div className="animate-emblem-rotate relative flex w-full h-full items-center justify-center">
                    <div className="animate-emblem-breathe">
                        <LootMapEmblem className="h-[140vh] max-h-none w-auto max-w-none scale-[1.75] rotate-12 translate-x-[15%] opacity-20 text-[#F2D019] select-none pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Botón de Salida Flotante */}
            <div className="absolute top-6 left-6 z-40">
                <GoBackButton onClick={handleProjectsClose} isClosing={isClosing} ariaLabel="Salir" title="Salir" />
            </div>

            {/* Título Centrado Flotante */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                <h1 className="truncate font-['Teko'] text-4xl sm:text-5xl md:text-6xl font-bold italic leading-none tracking-widest text-[#F2D019] text-center">
                    SELECTED_WORKS
                </h1>
                <span className="font-['Roboto_Mono'] text-[10px] md:text-[11px] font-bold tracking-[0.3em] text-white/60 uppercase text-center mt-0.5">
                    PRODUCT DESIGN · UX/UI · INTERACTIVE SYSTEMS
                </span>
            </div>

            {/* Layout Principal: Menú Izquierdo que NO se tapa + Monitor CRT 100% Visible */}
            <main className="relative z-10 flex flex-col-reverse lg:flex-row h-screen w-full overflow-hidden p-3 md:p-6 lg:p-8 lg:pt-28 gap-4 lg:gap-8 items-center justify-between">
                {/* Panel Izquierdo: Caja de Opciones Flotante */}
                <aside className="relative w-full lg:w-[460px] xl:w-[540px] max-w-full shrink-0 flex flex-col rounded-2xl border border-white/20 bg-black/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-20 h-[32vh] lg:h-auto lg:max-h-[calc(100vh-320px)] my-auto overflow-hidden">
                    {/* Header DESARROLLOS */}
                    <div className="shrink-0 border-b border-white/10 px-4 py-2.5 bg-white/[0.02] flex items-center justify-between">
                        <span className="font-['Roboto_Mono'] text-[10px] font-bold uppercase tracking-[0.25em] text-[#F2D019]">
                            DESARROLLOS
                        </span>
                        <span className="font-['Roboto_Mono'] text-[10px] text-white/40">
                            [{PROJECTS.length}]
                        </span>
                    </div>

                    {/* Grilla de Productos (Logos) */}
                    <div className="sci-fi-scroll flex-1 overflow-y-auto overflow-x-hidden p-2">
                        <div className="grid grid-cols-3 gap-2">
                            {PROJECTS.map((project) => (
                                <ProjectGridItem
                                    key={project.id}
                                    project={project}
                                    active={project.id === selectedProjectId}
                                    onClick={() => handleSelectProject(project)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Overlay: la caja grande se desliza sobre la misma caja al hacer click */}
                    {showProjectOverlay && selectedProject && (
                        <div className="absolute inset-0 z-30 flex flex-col bg-[#0a0d12] p-3 backdrop-blur-2xl animate-box-slide-in">
                            <div className="flex items-center justify-between border-b border-[#F2D019]/25 pb-2 mb-2">
                                <span className="font-['Roboto_Mono'] text-[10px] font-bold uppercase tracking-[0.25em] text-[#F2D019]">
                                    {selectedProject.title}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleCloseProjectOverlay}
                                    aria-label="Cerrar"
                                    className="border border-white/20 px-1.5 py-0.5 font-mono text-[10px] text-white/70 transition hover:border-[#F2D019] hover:text-[#F2D019]"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="sci-fi-scroll flex-1 overflow-y-auto pr-1 space-y-2">
                                <div className="grid place-items-center rounded-xl border border-white/10 bg-white/[0.03] py-4">
                                    <span className="text-5xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" aria-hidden="true">
                                        {getProjectEmoji(selectedProject)}
                                    </span>
                                </div>
                                <p className="border-l-2 border-[#f4a91f] pl-2 font-mono text-[11px] leading-relaxed text-white/80">
                                    {selectedProject.desc}
                                </p>

                                {selectedProject.caseStudy ? (
                                    <>
                                        <div>
                                            <span className="block text-[9px] font-bold uppercase text-[#2fa39b]">CONTEXTO:</span>
                                            <p className="font-mono text-[11px] leading-relaxed text-white/70">{selectedProject.caseStudy.context}</p>
                                        </div>
                                        <div>
                                            <span className="block text-[9px] font-bold uppercase text-[#2fa39b]">CONTRIBUCIÓN:</span>
                                            <p className="font-mono text-[11px] leading-relaxed text-white/70">{selectedProject.caseStudy.contribution}</p>
                                        </div>
                                        <div>
                                            <span className="block text-[9px] font-bold uppercase text-[#2fa39b]">PROCESO:</span>
                                            <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px] leading-relaxed text-white/70">
                                                {selectedProject.caseStudy.process.map(p => (
                                                    <li key={p}>{p}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <span className="block text-[9px] font-bold uppercase text-[#2fa39b]">EVIDENCIA:</span>
                                            <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px] leading-relaxed text-white/70">
                                                {selectedProject.caseStudy.evidence.map(e => (
                                                    <li key={e}>{e}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                ) : (
                                    <p className="font-mono text-[11px] italic text-white/40">Detalles adicionales pendientes de documentar.</p>
                                )}
                            </div>
                        </div>
                    )}
                </aside>

                {/* Panel Derecho: Área de Monitor y Teclado perfectamente contenidos */}
                <section className="relative flex-1 w-full h-full min-w-0 min-h-0 flex items-center justify-center overflow-visible">
                    <CrtMonitor
                        project={selectedProject}
                        channelIndex={currentChannel}
                        onLaunch={handleProjectLaunch}
                    />
                </section>
            </main>
        </div>
    );
};

const ProjectGridItem: React.FC<{
    project: Project;
    active: boolean;
    onClick: () => void;
}> = ({ project, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        title={project.title}
        aria-pressed={active}
        className={`group relative flex aspect-square w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border p-1 text-center transition duration-150 ${
            active
                ? 'border-[#F2D019] bg-[#F2D019]/15 shadow-[0_0_18px_rgba(242,208,25,0.3)]'
                : 'border-white/15 bg-black/50 hover:border-[#F2D019]/60 hover:bg-[#F2D019]/5'
        }`}
    >
        <span className="text-2xl leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]" aria-hidden="true">
            {getProjectEmoji(project)}
        </span>
        <span className={`w-full truncate font-['Teko'] text-base font-bold uppercase leading-[0.9] tracking-wide ${
            active ? 'text-[#F2D019]' : 'text-white/85 group-hover:text-[#F2D019]'
        }`}>
            {project.title}
        </span>
        {active && <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#F2D019] animate-pulse" />}
    </button>
);
