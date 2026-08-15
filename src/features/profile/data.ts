import type { EmploymentPeriod, Locale, ProfileData, PublicProfileSnapshot } from './types';

export const PROFILE_DATA: ProfileData = {
    name: 'Daniel Unibe',
    portrait: '/assets/profile/daniel-unibe-portrait.webp',
    // This is intentionally separate from portrait so the world character can change independently.
    worldTargetImage: '/assets/world/interactive/041_ulhz9on.png',
    role: {
        es: 'Diseñador UI/UX, creative technologist y artista 3D',
        en: 'UI/UX designer, creative technologist and 3D artist',
    },
    summary: {
        es: 'Conecto jerarquía visual, prototipado interactivo y frontend para convertir ideas complejas en experiencias claras.',
        en: 'I connect visual hierarchy, interactive prototyping and frontend work to turn complex ideas into clear experiences.',
    },
    specialties: [
        { es: 'Sistemas UI/UX', en: 'UI/UX systems' },
        { es: 'Tecnología creativa', en: 'Creative technology' },
        { es: 'Frontend interactivo', en: 'Interactive frontend' },
        { es: 'UI para videojuegos', en: 'Game UI' },
        { es: 'Mundos y arte 3D', en: '3D worlds and art' },
    ],
    // The documented independent period only gives a year. The level calculation
    // excludes that partial first year rather than claiming months that are not recorded.
    workPeriods: [{ start: '2020' }],
    socialLinks: [
        { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/daniel-unibe-ui', handle: 'daniel-unibe-ui' },
        { id: 'artstation', label: 'ArtStation', url: 'https://www.artstation.com/unibe', handle: 'unibe' },
        { id: 'dribbble', label: 'Dribbble', url: 'https://dribbble.com/danielalexisis', handle: 'danielalexisis' },
        { id: 'codepen', label: 'CodePen', url: 'https://codepen.io/Daniel-Unibe', handle: 'Daniel-Unibe' },
    ],
    publicEmail: 'contact@unibelands.com',
    source: 'local',
    syncStatus: 'unavailable',
    updatedAt: '2026-08-09',
};

const yearFrom = (value: string | undefined, fallback: number) => {
    const match = value?.match(/^(\d{4})/);
    return match ? Number(match[1]) : fallback;
};

/**
 * Counts only complete, non-overlapping calendar years. A year-only start is
 * treated conservatively: its first complete year is the following calendar year.
 */
export const calculateFullVerifiedYears = (periods: EmploymentPeriod[], asOf = new Date()): number => {
    const currentYear = asOf.getUTCFullYear();
    const occupiedYears = new Set<number>();

    periods.forEach(period => {
        const startIsYearOnly = /^\d{4}$/.test(period.start);
        const startYear = yearFrom(period.start, currentYear) + (startIsYearOnly ? 1 : 0);
        const endYear = Math.min(yearFrom(period.end, currentYear), currentYear);
        for (let year = startYear; year < endYear; year += 1) occupiedYears.add(year);
    });

    return occupiedYears.size;
};

export const getLocalized = (value: Record<Locale, string>, locale: Locale) => value[locale];

export const createPublicProfileSnapshot = (
    profile: ProfileData,
    locale: Locale,
    asOf = new Date(),
): PublicProfileSnapshot => ({
    name: profile.name,
    title: getLocalized(profile.role, locale),
    level: calculateFullVerifiedYears(profile.workPeriods, asOf),
    specialties: profile.specialties.map(specialty => getLocalized(specialty, locale)),
    links: profile.socialLinks,
    source: profile.source,
    syncStatus: profile.syncStatus,
    updatedAt: profile.updatedAt,
});
