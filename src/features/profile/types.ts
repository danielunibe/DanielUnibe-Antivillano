export type Locale = 'es' | 'en';

export type LocalizedText = Record<Locale, string>;

export type ProfileSource = 'local' | 'linkedin';

export type SyncStatus = 'fresh' | 'stale' | 'unavailable';

export interface SocialLink {
    id: 'linkedin' | 'artstation' | 'dribbble' | 'codepen';
    label: string;
    url: string;
    handle: string;
}

export interface EmploymentPeriod {
    /** A year-only start means the first partial year is deliberately excluded. */
    start: string;
    end?: string;
}

export interface ProfileData {
    name: string;
    portrait: string;
    worldTargetImage: string;
    role: LocalizedText;
    summary: LocalizedText;
    specialties: LocalizedText[];
    workPeriods: EmploymentPeriod[];
    socialLinks: SocialLink[];
    publicEmail: string;
    source: ProfileSource;
    syncStatus: SyncStatus;
    updatedAt: string;
}

export interface PublicProfileSnapshot {
    name: string;
    title: string;
    level: number;
    specialties: string[];
    links: Pick<SocialLink, 'id' | 'label' | 'url' | 'handle'>[];
    source: ProfileSource;
    syncStatus: SyncStatus;
    updatedAt: string;
}
