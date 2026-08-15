import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { sfx } from '../../utils/SoundManager';
import { Icons } from '../StackScreen/assets/Icons';
import { GoBackButton } from '../../components/ui/GoBackButton';
import { CATEGORY_ORDER, PROJECTS } from './data';
import { Project, ProjectCategory } from './types';
import { countProjects, filterProjects } from './selection';

interface ProjectsScreenProps {
    onClose: () => void;
    initialProjectId?: number;
    onInspectProject?: (project: Project) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({ onClose, initialProjectId = 301, onInspectProject }) => {
    const [activeProjectCategory, setActiveProjectCategory] = useState<ProjectCategory>('FEATURED');
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

    return (
        <div className={`fixed inset-0 z-[200] bg-[#050505] text-white overflow-hidden select-none ${isClosing ? 'animate-out fade-out duration-300' : 'animate-stack-entry'}`}>
            <div className="interface-dot-grid" />
            <div className="interface-screen-vignette" />

            <header className="relative z-30 flex h-[76px] items-center justify-between gap-4 border-b border-white/10 bg-black/80 px-4 md:px-6 backdrop-blur">
                <GoBackButton onClick={handleProjectsClose} isClosing={isClosing} ariaLabel="Salir" title="Salir" />

                <div className="min-w-0 text-right">
                    <h1 className="truncate font-['Teko'] text-4xl font-bold italic leading-none tracking-wider text-[#ffaa00] md:text-5xl">
                        <span className="sm:hidden">QUEST LOG</span><span className="hidden sm:inline">MASTER_QUEST_LOG</span>
                    </h1>
                    <span className="hidden font-mono text-[10px] font-bold tracking-[0.24em] text-white/58 sm:block">
                        ELIGE CATEGORIA · SELECCIONA QUEST · USA INFO O ABRIR
                    </span>
                </div>
            </header>

            <main className="relative z-10 h-[calc(100vh-76px)] overflow-hidden">
                <aside className="absolute inset-x-0 bottom-0 z-50 flex max-h-[42vh] min-h-0 flex-col border-t border-white/10 bg-black/82 backdrop-blur transition-all duration-300 lg:inset-y-0 lg:left-0 lg:right-auto lg:max-h-none lg:w-[316px] lg:border-r lg:border-t-0">
                    <div className="hidden shrink-0 border-b border-white/10 px-4 py-3 lg:block">
                        <div className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-[#00F0FF]">PASO 01</div>
                        <div className="mt-1 font-['Teko'] text-3xl font-black uppercase leading-none tracking-wider text-[#ffaa00]">Escoge una ruta</div>
                    </div>

                    <div className="flex shrink-0 overflow-x-auto border-b border-white/10 p-2 lg:grid lg:grid-cols-1 lg:gap-2 lg:overflow-visible">
                        {CATEGORY_ORDER.map(category => (
                            <CategoryTab
                                key={category}
                                label={category === 'ALL' ? 'TODAS' : category}
                                count={categoryCounts[category]}
                                active={activeProjectCategory === category}
                                onClick={() => handleProjectCategoryChange(category)}
                            />
                        ))}
                    </div>

                    <div className="hidden shrink-0 border-b border-white/10 px-4 py-3 lg:block">
                        <div className="font-mono text-[9px] font-black uppercase tracking-[0.28em] text-[#00F0FF]">PASO 02</div>
                        <div className="mt-1 font-['Teko'] text-2xl font-black uppercase leading-none tracking-wider text-white">Selecciona una quest</div>
                    </div>

                    <div className="sci-fi-scroll flex min-h-0 gap-2 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
                        {filteredProjectItems.map(project => (
                            <QuestRailItem
                                key={project.id}
                                project={project}
                                active={project.id === selectedProjectId}
                                onClick={() => {
                                    setSelectedProjectId(project.id);
                                    setShowProjectDetails(false);
                                    onInspectProject?.(project);
                                    sfx.play('CLICK');
                                }}
                            />
                        ))}
                    </div>
                </aside>

                <section className="relative h-full min-h-0 overflow-hidden bg-[#060606] lg:pl-[316px]">
                    <ProjectMedia project={selectedProject} />

                    <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle,transparent_72%,rgba(0,0,0,0.65)_100%)]" />
                    <div
                        className="pointer-events-none absolute inset-0 z-20 opacity-10"
                        style={{
                            background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.4) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))',
                            backgroundSize: '100% 2px, 3px 100%'
                        }}
                    />

                    <div className="absolute left-3 top-3 z-40 max-w-[calc(100vw-1.5rem)] border border-[#ffaa00]/35 bg-black/72 p-3 text-white shadow-[0_0_28px_rgba(0,0,0,0.45)] backdrop-blur md:left-[calc(316px+20px)] md:top-5 md:max-w-[420px]">
                        <div className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#00F0FF]">PASO 03 · REVISA O LANZA</div>
                        <h2 className="mt-1 truncate font-['Teko'] text-3xl font-black uppercase leading-none tracking-wide text-[#ffaa00] md:text-4xl">
                            {selectedProject.title}
                        </h2>
                        <p className="mt-2 line-clamp-2 font-['Roboto_Mono'] text-[11px] leading-relaxed text-white/68">
                            {selectedProject.desc}
                        </p>
                    </div>

                    <div className="absolute right-3 top-3 z-40 flex items-center gap-2 md:right-5 md:top-5">
                        <button
                            onClick={() => {
                                sfx.play('CLICK');
                                setShowProjectDetails(value => !value);
                                onInspectProject?.(selectedProject);
                            }}
                            className={`border px-4 py-2 font-['Teko'] text-xl font-black uppercase tracking-widest backdrop-blur transition ${
                                showProjectDetails
                                    ? 'border-[#ffaa00] bg-[#ffaa00] text-black'
                                    : 'border-white/15 bg-black/55 text-white/75 hover:border-[#ffaa00] hover:text-[#ffaa00]'
                            }`}
                        >
                            INFO
                        </button>
                        {selectedProject.url && (
                            <button
                                onClick={() => handleProjectLaunch(selectedProject.url)}
                                className="border border-[#00F0FF]/60 bg-black/55 px-4 py-2 font-['Teko'] text-xl font-black uppercase tracking-widest text-[#00F0FF] backdrop-blur transition hover:bg-[#00F0FF] hover:text-black"
                            >
                                ABRIR
                            </button>
                        )}
                    </div>

                    <div className={`absolute bottom-[42vh] right-0 top-[132px] z-30 w-full max-w-[360px] border-l border-[#ffaa00]/30 bg-black/82 p-5 text-white shadow-[-18px_0_45px_rgba(0,0,0,0.55)] backdrop-blur transition duration-300 lg:bottom-0 lg:top-0 ${
                        showProjectDetails ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-full opacity-0'
                    }`}>
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className="border border-[#ffaa00]/50 bg-[#ffaa00]/10 px-2 py-1 font-mono text-[10px] font-black tracking-[0.2em] text-[#ffaa00]">
                                {selectedProject.type}
                            </span>
                            <span className="border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] font-black tracking-[0.2em] text-white/65">
                                {selectedProject.status}
                            </span>
                        </div>
                        <h2 className="font-['Teko'] text-5xl font-black uppercase leading-[0.86] tracking-wide text-[#ffaa00]">
                            {selectedProject.title}
                        </h2>
                        <p className="mt-4 border-l-4 border-[#ffaa00] pl-4 font-['Roboto_Mono'] text-xs leading-relaxed text-white/72 md:text-sm">
                            {selectedProject.desc}
                        </p>
                        {selectedProject.caseStudy ? (
                            <div className="sci-fi-scroll mt-5 max-h-[calc(100vh-300px)] space-y-5 overflow-y-auto pr-2 font-['Roboto_Mono'] text-xs leading-relaxed text-white/72">
                                <CaseStudySection label="CONTEXTO" value={selectedProject.caseStudy.context} />
                                <CaseStudySection label="CONTRIBUCIÓN" value={selectedProject.caseStudy.contribution} />
                                <CaseStudyList label="PROCESO" values={selectedProject.caseStudy.process} />
                                <CaseStudyList label="EVIDENCIA" values={selectedProject.caseStudy.evidence} />
                                {selectedProject.caseStudy.nextStep && <CaseStudySection label="SIGUIENTE PASO" value={selectedProject.caseStudy.nextStep} />}
                            </div>
                        ) : (
                            <p className="mt-5 border border-white/10 bg-white/5 p-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                                Caso de estudio pendiente de documentar.
                            </p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

const ProjectMedia = ({ project }: { project: Project }) => {
    if (project.embedUrl) {
        return (
            <iframe
                title={`${project.title} live preview`}
                src={project.embedUrl}
                className="absolute inset-0 h-full w-full bg-black"
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

interface QuestRailItemProps {
    project: Project;
    active: boolean;
    onClick: () => void;
}

const QuestRailItem: React.FC<QuestRailItemProps> = ({ project, active, onClick }) => (
    <button
        onClick={onClick}
        className={`group/quest relative grid h-28 w-64 shrink-0 grid-cols-[86px_1fr] overflow-hidden border-2 text-left transition lg:w-full lg:grid-cols-[62px_1fr] ${
            active
                ? 'border-[#ffaa00] bg-[#ffaa00] text-black'
                : 'border-white/10 bg-black/70 text-white/75 hover:border-[#ffaa00] hover:text-[#ffaa00]'
        }`}
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 86%, 94% 100%, 0 100%)' }}
    >
        <img src={project.image} alt="" className="h-full w-full object-cover" loading="lazy" />
        <div className="min-w-0 p-3 opacity-100 transition lg:opacity-0 lg:group-hover/quest:opacity-100 lg:group-focus-within/quest:opacity-100">
            <div className={`mb-1 font-mono text-[9px] font-black tracking-widest ${active ? 'text-black/70' : 'text-[#ffaa00]'}`}>
                {project.type} / {project.status}
            </div>
            <div className="truncate font-['Teko'] text-2xl font-bold uppercase leading-none tracking-wide">
                {project.title}
            </div>
            <div className={`mt-2 truncate font-mono text-[9px] uppercase tracking-[0.12em] ${active ? 'text-black/65' : 'text-white/45'}`}>
                {project.status}
            </div>
        </div>
    </button>
);

interface CategoryTabProps {
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
}

const CategoryTab: React.FC<CategoryTabProps> = ({ label, count, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex shrink-0 items-center justify-between gap-4 overflow-hidden border px-4 py-2 font-['Teko'] text-2xl font-bold uppercase tracking-widest transition lg:w-full ${
            active
                ? 'border-[#ffaa00] bg-[#ffaa00] text-black'
                : 'border-white/10 bg-white/[0.03] text-white/55 hover:border-[#00F0FF] hover:text-[#00F0FF]'
        }`}
    >
        <span>
            {label}
        </span>
        <span className={`font-mono text-[10px] font-black tracking-[0.16em] ${active ? 'text-black/60' : 'text-white/35'}`}>
            {count}
        </span>
    </button>
);

const CaseStudySection = ({ label, value }: { label: string; value: string }) => (
    <section>
        <h3 className="mb-1 font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#00F0FF]">{label}</h3>
        <p>{value}</p>
    </section>
);

const CaseStudyList = ({ label, values }: { label: string; values: string[] }) => (
    <section>
        <h3 className="mb-1 font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#00F0FF]">{label}</h3>
        <ul className="space-y-1">
            {values.map(value => <li key={value}>— {value}</li>)}
        </ul>
    </section>
);
