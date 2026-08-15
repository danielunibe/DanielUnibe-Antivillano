export type ProjectCategory = 'ALL' | 'FEATURED' | 'UI_UX' | '3D' | 'CODE' | 'ARCHIVE';

export interface ProjectCaseStudy {
    context: string;
    contribution: string;
    process: string[];
    evidence: string[];
    nextStep?: string;
}

export interface Project {
    id: number;
    title: string;
    category: Exclude<ProjectCategory, 'ALL'>;
    type: string;
    status: string;
    desc: string;
    lvl: number;
    image: string;
    url?: string;
    embedUrl?: string;
    videoUrl?: string;
    mediaKind?: 'image' | 'video' | 'embed';
    featured?: boolean;
    caseStudy?: ProjectCaseStudy;
}
