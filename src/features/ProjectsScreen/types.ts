export type CanonicalCategory = 'featured' | 'ux-product' | 'game-ui-3d' | 'systems-ai' | 'archive' | '3d-game-art' | 'tech-ai';

export type ProjectCategory = 'DESTACADOS' | 'TODOS' | 'UX_PRODUCT' | 'GAME_UI_3D' | 'SYSTEMS_AI' | 'ARCHIVE' | 'THREE_D_ART' | 'TECH_AI' | 'ALL' | 'FEATURED' | 'UI_UX' | '3D' | 'CODE';

export interface ProjectCaseStudy {
    context: string;
    contribution: string;
    process: string[];
    evidence: string[];
    nextStep?: string;
}

export type ViewerProfile = 'webapp' | 'codepen' | 'media' | 'archive';

export interface Project {
    id: number | string;
    title: string;
    category?: string;
    categories?: CanonicalCategory[];
    type: string;
    status: 'LIVE' | 'DEV' | 'COMPLETE' | 'ARCHIVE' | 'ACTIVE' | 'BETA' | 'CONCEPT' | 'GAME JAM' | 'GDD' | 'IN DEVELOPMENT' | 'UNCLASSIFIED' | string;
    desc: string;
    lvl: number;
    image: string;
    viewerMode?: 'live' | 'media' | 'archive';
    viewerProfile?: ViewerProfile;
    launchApp?: 'browser' | 'gallery';
    launchId?: string;
    url?: string;
    embedUrl?: string;
    videoUrl?: string;
    mediaKind?: 'image' | 'video' | 'embed';
    featured?: boolean;
    caseStudy?: ProjectCaseStudy;
}
