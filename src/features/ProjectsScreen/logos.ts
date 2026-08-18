import type { Project } from './types';

const PROJECT_EMOJI: Record<string, string> = {
    '601': '📡',
    '501': '🤖',
    '401': '🖥️',
    '301': '🗺️',
};

const CATEGORY_EMOJI: Record<string, string> = {
    featured: '⭐',
    'systems-ai': '🤖',
    'tech-ai': '⚙️',
    'ux-product': '📱',
    'game-ui-3d': '🎮',
    '3d-game-art': '🎨',
    archive: '📦',
    UX_PRODUCT: '📱',
    UI_UX: '📱',
    SYSTEMS_AI: '⚙️',
    TECH_AI: '⚙️',
    CODE: '⚙️',
    GAME_UI_3D: '🎮',
    THREE_D_ART: '🎨',
    '3D': '🎮',
    ARCHIVE: '📦',
    DESTACADOS: '⭐',
    FEATURED: '⭐',
};

export const getProjectEmoji = (project: Project): string => {
    const byId = PROJECT_EMOJI[String(project.id)];
    if (byId) return byId;
    for (const category of project.categories ?? []) {
        if (CATEGORY_EMOJI[category]) return CATEGORY_EMOJI[category];
    }
    if (project.category && CATEGORY_EMOJI[project.category]) return CATEGORY_EMOJI[project.category];
    if (CATEGORY_EMOJI[project.type]) return CATEGORY_EMOJI[project.type];
    return '📁';
};