import type { LocalizedText } from '../profile/types';

export type HeroChapterId = 'ORIGIN' | 'CALL' | 'TRIALS' | 'SPECIALIZATION' | 'TRANSFORMATION' | 'RETURN';
export type CareerMilestoneType = 'education' | 'experience' | 'recognition' | 'project';
export type CareerEvidenceState = 'available' | 'verified';
export type CareerMapAction = 'STACK' | 'PROJECTS' | null;
export type CareerMapVisualState = 'available' | 'selected' | 'verified';

export interface CareerMilestonePosition {
    x: number;
    y: number;
}

export interface HeroChapter {
    id: HeroChapterId;
    title: LocalizedText;
    shortTitle: LocalizedText;
}

export interface CareerMilestone {
    id: string;
    type: CareerMilestoneType;
    chapter: HeroChapterId;
    startYear: number;
    endYear?: number;
    date: LocalizedText;
    title: LocalizedText;
    role?: LocalizedText;
    evidence: LocalizedText;
    evidenceState: CareerEvidenceState;
    sourceDocumentCount: number;
    action: CareerMapAction;
    thumbnail?: string;
    thumbnailAlt?: LocalizedText;
    x: number;
    y: number;
}

export const CAREER_MAP_BACKGROUND = '/assets/capability-map/mapa.png';

/**
 * Tres carriles de tiempo: cada tipo vive en una banda horizontal propia.
 * Los valores son porcentajes de la altura del mapa (0-100).
 */
export const CAREER_MAP_LANE_Y: Record<CareerMilestoneType, number> = {
    education: 28,
    experience: 56,
    recognition: 84,
    project: 56,
};

const CAREER_MAP_X_MARGIN = 8;

export const HERO_CHAPTERS: readonly HeroChapter[] = [
    { id: 'ORIGIN', title: { es: 'Origen y formación', en: 'Origins and formation' }, shortTitle: { es: 'Origen', en: 'Origins' } },
    { id: 'CALL', title: { es: 'Llamado profesional', en: 'Professional call' }, shortTitle: { es: 'Llamado', en: 'Call' } },
    { id: 'TRIALS', title: { es: 'Pruebas y práctica', en: 'Trials and practice' }, shortTitle: { es: 'Pruebas', en: 'Trials' } },
    { id: 'SPECIALIZATION', title: { es: 'Especialización', en: 'Specialization' }, shortTitle: { es: 'Especialización', en: 'Specialization' } },
    { id: 'TRANSFORMATION', title: { es: 'Transformación', en: 'Transformation' }, shortTitle: { es: 'Transformación', en: 'Transformation' } },
    { id: 'RETURN', title: { es: 'Reconocimiento y siguiente misión', en: 'Recognition and next mission' }, shortTitle: { es: 'Reconocimiento', en: 'Recognition' } },
] as const;

/**
 * Public milestones are limited to statements repeated in the local CV set.
 * Source counts are an editorial corroboration guard, not a proficiency score.
 */
export const CAREER_MILESTONES: readonly CareerMilestone[] = [
    {
        id: 'morelia-2013', type: 'recognition', chapter: 'ORIGIN', startYear: 2013,
        date: { es: '2013', en: '2013' },
        title: { es: 'Cortometraje premiado', en: 'Award-winning short film' },
        role: { es: 'Colaboración audiovisual', en: 'Audiovisual collaboration' },
        evidence: { es: 'Colaboración documentada en un cortometraje premiado presentado en el Festival de Cine de Morelia.', en: 'Documented collaboration on an award-winning short film presented at the Morelia Film Festival.' },
        evidenceState: 'verified', sourceDocumentCount: 10, action: null, x: 10, y: 69,
    },
    {
        id: 'threadless-2014', type: 'recognition', chapter: 'ORIGIN', startYear: 2014,
        date: { es: '2014', en: '2014' },
        title: { es: 'Finalista internacional', en: 'International finalist' },
        role: { es: 'Threadless × GAP Kids Design Challenge', en: 'Threadless × GAP Kids Design Challenge' },
        evidence: { es: 'Finalista internacional documentado en el Threadless × GAP Kids Design Challenge.', en: 'Documented international finalist in the Threadless × GAP Kids Design Challenge.' },
        evidenceState: 'verified', sourceDocumentCount: 10, action: null, x: 21, y: 48,
    },
    {
        id: 'vitalfarma-2018', type: 'experience', chapter: 'CALL', startYear: 2018, endYear: 2020,
        date: { es: '2018–2020', en: '2018–2020' },
        title: { es: 'Vitalfarma', en: 'Vitalfarma' },
        role: { es: 'Branding y estrategia visual', en: 'Branding and visual strategy' },
        evidence: { es: 'Experiencia documentada en identidad, posicionamiento visual, merchandising y comunicación para expansión local.', en: 'Documented experience in identity, visual positioning, merchandising, and communication for local expansion.' },
        evidenceState: 'verified', sourceDocumentCount: 9, action: null, x: 31, y: 70,
    },
    {
        id: 'uniat-2019', type: 'education', chapter: 'TRIALS', startYear: 2019, endYear: 2024,
        date: { es: '2019–ago. 2024', en: '2019–Aug. 2024' },
        title: { es: 'UNIAT', en: 'UNIAT' },
        role: { es: 'Desarrollo de Videojuegos · especialidad Arte', en: 'Video Game Development · Art specialization' },
        evidence: { es: 'Formación universitaria completada; la titulación permanece en proceso según el registro local.', en: 'University coursework completed; the degree process remains in progress according to the local record.' },
        evidenceState: 'verified', sourceDocumentCount: 10, action: 'STACK', x: 42, y: 37,
    },
    {
        id: 'independent-lab-2020', type: 'experience', chapter: 'TRIALS', startYear: 2020,
        date: { es: '2020–presente', en: '2020–present' },
        title: { es: 'Laboratorio independiente de I+D', en: 'Independent R&D lab' },
        role: { es: 'UI/UX, Game UI y prototipado asistido por IA', en: 'UI/UX, Game UI, and AI-assisted prototyping' },
        evidence: { es: 'Prototipos e interfaces documentados para sistemas visuales, narrativa interactiva, productividad e IA aplicada.', en: 'Documented prototypes and interfaces for visual systems, interactive narrative, productivity, and applied AI.' },
        evidenceState: 'verified', sourceDocumentCount: 9, action: 'PROJECTS', x: 53, y: 60,
    },
    {
        id: 'dtif-2021', type: 'experience', chapter: 'SPECIALIZATION', startYear: 2021, endYear: 2023,
        date: { es: 'oct. 2021–oct. 2023', en: 'Oct. 2021–Oct. 2023' },
        title: { es: 'Secretaría de Hacienda Pública · DTIF', en: 'Public Finance Ministry · DTIF' },
        role: { es: 'Diseñador digital', en: 'Digital designer' },
        evidence: { es: 'Diseño UX/UI, comunicación visual y recursos institucionales para sistemas internos de información.', en: 'UX/UI design, visual communication, and institutional assets for internal information systems.' },
        evidenceState: 'verified', sourceDocumentCount: 9, action: 'STACK', x: 64, y: 35,
    },
    {
        id: 'game-jam-2023', type: 'recognition', chapter: 'TRANSFORMATION', startYear: 2023,
        date: { es: '2023', en: '2023' },
        title: { es: '1er lugar · Mejor Interfaz Innovadora', en: '1st place · Most Innovative Interface' },
        role: { es: 'Game Jam UNIAT · producción de 72 horas', en: 'UNIAT Game Jam · 72-hour production' },
        evidence: { es: 'Reconocimiento documentado por una interfaz innovadora en la Game Jam UNIAT 2023.', en: 'Documented recognition for an innovative interface at the 2023 UNIAT Game Jam.' },
        evidenceState: 'verified', sourceDocumentCount: 9, action: 'PROJECTS', thumbnail: '/assets/portfolio/projects/037_dihgfh6.jpeg',
        thumbnailAlt: { es: 'Proyecto vinculado a la Game Jam', en: 'Project linked to the Game Jam' }, x: 74, y: 56,
    },
    {
        id: 'dtif-2025', type: 'experience', chapter: 'RETURN', startYear: 2025,
        date: { es: 'ene.–may. 2025', en: 'Jan.–May 2025' },
        title: { es: 'Secretaría de Hacienda Pública · DTIF', en: 'Public Finance Ministry · DTIF' },
        role: { es: 'Especialista en Diseño Digital e Innovación Interactiva', en: 'Digital Design and Interactive Innovation Specialist' },
        evidence: { es: 'Etapa documentada de diseño digital, optimización visual y refinamiento UX para flujos institucionales.', en: 'Documented stage of digital design, visual optimization, and UX refinement for institutional flows.' },
        evidenceState: 'verified', sourceDocumentCount: 9, action: null, x: 85, y: 37,
    },
    {
        id: 'excellence-2025', type: 'recognition', chapter: 'RETURN', startYear: 2025,
        date: { es: '2025', en: '2025' },
        title: { es: 'Premio Excelencia Institucional', en: 'Institutional Excellence Award' },
        role: { es: 'Secretaría de Hacienda Pública, Jalisco', en: 'Public Finance Ministry, Jalisco' },
        evidence: { es: 'Reconocimiento local documentado por calidad sostenida y contribución al área de innovación.', en: 'Local record documents recognition for sustained quality and contribution to the innovation area.' },
        evidenceState: 'verified', sourceDocumentCount: 10, action: null, x: 92, y: 68,
    },
] as const;

/**
 * Indice cronologico del hito dentro de la trayectoria ordenada.
 */
export const getCareerMapLanePosition = (milestone: CareerMilestone, sorted: readonly CareerMilestone[]): CareerMilestonePosition => {
    const total = sorted.length;
    const laneIndex = sorted.findIndex(item => item.id === milestone.id);
    const safeIndex = Math.max(0, laneIndex);
    if (total <= 1) return { x: 50, y: CAREER_MAP_LANE_Y[milestone.type] };
    const x = CAREER_MAP_X_MARGIN + (safeIndex / (total - 1)) * (100 - CAREER_MAP_X_MARGIN * 2);
    return { x: Math.round(x * 10) / 10, y: CAREER_MAP_LANE_Y[milestone.type] };
};

export const getSortedCareerMilestones = (): CareerMilestone[] => [...CAREER_MILESTONES]
    .sort((first, second) => first.startYear - second.startYear || first.id.localeCompare(second.id));

export const getHeroChapter = (id: HeroChapterId): HeroChapter => HERO_CHAPTERS.find(chapter => chapter.id === id) ?? HERO_CHAPTERS[0];

export const isCareerMapCoordinate = (value: number): boolean => Number.isFinite(value) && value >= 0 && value <= 100;

export const getCareerMapVisualState = (milestone: CareerMilestone, selectedId: string): CareerMapVisualState => {
    if (milestone.id === selectedId) return 'selected';
    return milestone.evidenceState === 'verified' ? 'verified' : 'available';
};

export const getAdjacentCareerMilestone = (currentId: string, direction: -1 | 1): CareerMilestone => {
    const sorted = getSortedCareerMilestones();
    const currentIndex = Math.max(0, sorted.findIndex(milestone => milestone.id === currentId));
    return sorted[Math.min(sorted.length - 1, Math.max(0, currentIndex + direction))];
};
