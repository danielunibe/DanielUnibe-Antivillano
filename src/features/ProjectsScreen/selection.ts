import type { Project, ProjectCategory } from './types.ts';

export const filterProjects = (projects: Project[], category: ProjectCategory): Project[] => {
    if (category === 'TODOS' || category === 'ALL') return projects;
    if (category === 'DESTACADOS' || category === 'FEATURED') {
        return projects.filter(project => project.featured || project.categories?.includes('featured'));
    }
    if (category === 'UX_PRODUCT' || category === 'UI_UX') {
        return projects.filter(project => project.categories?.includes('ux-product') || project.category === 'UI_UX' || project.category === 'UX_PRODUCT');
    }
    if (category === 'GAME_UI_3D' || category === 'THREE_D_ART' || category === '3D') {
        return projects.filter(project => project.categories?.includes('game-ui-3d') || project.categories?.includes('3d-game-art') || project.category === '3D' || project.category === 'THREE_D_ART');
    }
    if (category === 'SYSTEMS_AI' || category === 'TECH_AI' || category === 'CODE') {
        return projects.filter(project => project.categories?.includes('systems-ai') || project.categories?.includes('tech-ai') || project.category === 'CODE' || project.category === 'TECH_AI');
    }
    if (category === 'ARCHIVE') {
        return projects.filter(project => project.categories?.includes('archive') || project.category === 'ARCHIVE');
    }
    return projects;
};

export const countProjects = (projects: Project[], category: ProjectCategory): number => filterProjects(projects, category).length;


