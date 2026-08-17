import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { sfx } from '../../utils/SoundManager';
import { GoBackButton } from '../../components/ui/GoBackButton';
import { CATEGORY_ORDER, PROJECTS } from './data';
import { Project, ProjectCategory } from './types';
import { countProjects, filterProjects } from './selection';
import { CrtMonitor } from './components/CrtMonitor';
import { LootMapEmblem } from '../LootMapScreen/emblem';

interface ProjectsScreenProps {
    onClose: () => void;
    initialProjectId?: number | string;
    onInspectProject?: (project: Project) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ onClose, initialProjectId = 4, onInspectProject }) => {
    const [activeProjectCategory, setActiveProjectCategory] = useState<ProjectCategory>('DESTACADOS');
    const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
    const [showProjectDetails, setShowProjectDetails] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const filteredProjectItems = useMemo(() => {
        return filterProjects(PROJECTS, activeProjectCategory);
    }, [activeProjectCategory]);

    const categoryCounts = useMemo(() => {
        return CATEGORY_ORDER.reduce<Record<ProjectCategory, number>>((acc, category) => {
            acc[category] = countProjects(PROJECTS, category);
            return acc;
        }, {} as Record<ProjectCategory, number>);
    }, []);

    useEffect(() => {
        if (!filteredProjectItems.find(p => p.id === selectedProjectId) && filteredProjectItems.length > 0) {
            setSelectedProjectId(filteredProjectItems[0].id);
        }
    }, [filteredProjectItems, selectedProjectId]);

    const selectedProject = PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];

    const currentChannel = useMemo(() => {
        const idx = filteredProjectItems.findIndex(p => p.id === selectedProjectId);
        return idx >= 0 ? idx + 1 : 1;
    }, [filteredProjectItems, selectedProjectId]);

    const handleProjectsClose = useCallback(() => {
        sfx.play('CLICK');
        setIsClosing(true);
        setTimeout(onClose, 300);
    }, [onClose]);

    const handleProjectCategoryChange = useCallback((cat: ProjectCategory) => {
        sfx.play('CLICK');
        setActiveProjectCategory(cat);
        setShowProjectDetails(false);
    }, []);

    const handleProjectLaunch = useCallback((url?: string) => {
        if (!url) return;
        sfx.play('CLICK');
        window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    const handleSelectProject = useCallback((project: Project) => {
        sfx.play('CLICK');
        setSelectedProjectId(project.id);
        setShowProjectDetails(false);
        onInspectProject?.(project);
    }, [onInspectProject]);

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
                <aside className="w-full lg:w-[320px] xl:w-[360px] max-w-full shrink-0 flex flex-col rounded-2xl border border-white/20 bg-black/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-20 h-[38vh] lg:h-auto lg:max-h-[calc(100vh-140px)] my-auto overflow-hidden">
                    {/* Header de Categorías */}
                    <div className="shrink-0 border-b border-white/10 px-4 py-2.5 bg-white/[0.02] flex items-center justify-between">
                        <span className="font-['Roboto_Mono'] text-[10px] font-bold uppercase tracking-[0.25em] text-[#F2D019]">
                            CATEGORÍAS
                        </span>
                        <span className="font-['Roboto_Mono'] text-[10px] text-white/40">
                            [{filteredProjectItems.length}]
                        </span>
                    </div>

                    {/* Selector de Categorías */}
                    <div className="shrink-0 flex overflow-x-auto border-b border-white/10 p-2 gap-1.5 lg:grid lg:grid-cols-2 lg:overflow-visible bg-black/30">
                        {CATEGORY_ORDER.map(category => (
                            <CategoryButton
                                key={category}
                                category={category}
                                count={categoryCounts[category]}
                                active={activeProjectCategory === category}
                                onClick={() => handleProjectCategoryChange(category)}
                            />
                        ))}
                    </div>

                    {/* Header de Proyectos */}
                    <div className="shrink-0 border-b border-white/10 px-4 py-1.5 bg-white/[0.01] flex items-center justify-between">
                        <span className="font-['Roboto_Mono'] text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                            PROYECTOS
                        </span>
                        <span className="font-['Roboto_Mono'] text-[9px] text-[#F2D019]/80 font-bold">
                            {filteredProjectItems.length} ITEMS
                        </span>
                    </div>

                    {/* Lista de Proyectos */}
                    <div className="sci-fi-scroll flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-2">
                        {filteredProjectItems.map((project, idx) => (
                            <QuestListItem
                                key={project.id}
                                project={project}
                                index={idx + 1}
                                active={project.id === selectedProjectId}
                                onClick={() => handleSelectProject(project)}
                            />
                        ))}
                    </div>
                </aside>

                {/* Panel Derecho: Área de Monitor y Teclado perfectamente contenidos */}
                <section className="relative flex-1 w-full h-full min-w-0 min-h-0 flex items-center justify-center overflow-hidden">
                    <CrtMonitor
                        project={selectedProject}
                        channelIndex={currentChannel}
                        showDetails={showProjectDetails}
                        onToggleDetails={() => setShowProjectDetails(prev => !prev)}
                        onLaunch={handleProjectLaunch}
                    />
                </section>
            </main>
        </div>
    );
};

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
    DESTACADOS: 'DESTACADOS',
    TODOS: 'TODOS',
    UX_PRODUCT: 'UX / PRODUCTO',
    GAME_UI_3D: 'GAME UI / 3D',
    SYSTEMS_AI: 'SISTEMAS / IA',
    ARCHIVE: 'ARCHIVO',
    THREE_D_ART: 'GAME UI / 3D',
    TECH_AI: 'SISTEMAS / IA',
    FEATURED: 'DESTACADOS',
    ALL: 'TODOS',
    UI_UX: 'UX / PRODUCTO',
    '3D': 'GAME UI / 3D',
    CODE: 'SISTEMAS / IA'
};

const CategoryButton: React.FC<{
    category: ProjectCategory;
    count: number;
    active: boolean;
    onClick: () => void;
}> = ({ category, count, active, onClick }) => {
    const label = CATEGORY_LABELS[category];
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center justify-between px-2.5 py-1.5 font-['Roboto_Mono'] text-[11px] border transition text-left ${
                active
                    ? 'border-[#F2D019] bg-[#F2D019] text-black font-bold shadow-[0_4px_12px_rgba(242,208,25,0.35)]'
                    : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/30 hover:bg-white/[0.08] hover:text-white'
            }`}
        >
            <span className="truncate font-['Teko'] text-xl leading-none tracking-wider uppercase">
                {label}
            </span>
            <span className={`text-[9px] px-1 py-0.2 font-['Roboto_Mono'] ${active ? 'bg-black/80 text-[#F2D019] font-bold' : 'text-white/40'}`}>
                {count}
            </span>
        </button>
    );
};

const QuestListItem: React.FC<{
    project: Project;
    index: number;
    active: boolean;
    onClick: () => void;
}> = ({ project, index, active, onClick }) => {
    const idxStr = index < 10 ? `0${index}` : `${index}`;
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group w-full flex items-center gap-2.5 p-2 border transition text-left relative overflow-hidden ${
                active
                    ? 'border-[#F2D019] bg-[#F2D019]/10 shadow-[0_4px_16px_rgba(242,208,25,0.25)]'
                    : 'border-white/10 bg-black/50 hover:border-white/30 hover:bg-white/[0.04]'
            }`}
        >
            {/* Thumbnail */}
            <div className="relative h-11 w-13 shrink-0 overflow-hidden border border-white/15 bg-black">
                <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition duration-200"
                    loading="lazy"
                />
                <span className="absolute bottom-0 right-0 bg-black/85 px-1 font-['Roboto_Mono'] text-[8px] text-white/80">
                    #{idxStr}
                </span>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className={`truncate font-['Roboto_Mono'] text-[9px] font-bold tracking-wider ${active ? 'text-[#F2D019]' : 'text-white/60'}`}>
                        {project.type}
                    </span>
                    <span className={`font-['Roboto_Mono'] text-[8px] font-bold px-1.5 py-0.5 border ${
                        active ? 'border-[#F2D019]/60 text-[#F2D019] bg-[#F2D019]/10' : 'border-white/15 text-white/50 bg-white/[0.03]'
                    }`}>
                        {project.status}
                    </span>
                </div>
                <h3 className={`truncate font-['Teko'] text-2xl font-bold uppercase leading-none tracking-wide transition ${active ? 'text-[#F2D019]' : 'text-white group-hover:text-[#F2D019]'}`}>
                    {project.title}
                </h3>
            </div>
        </button>
    );
};
