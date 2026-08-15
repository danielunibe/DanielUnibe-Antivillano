import type { Project, ProjectCategory } from './types.ts';

export const filterProjects = (projects: Project[], category: ProjectCategory): Project[] => {
    if (category === 'ALL') return projects;
    if (category === 'FEATURED') return projects.filter(project => project.featured);
    return projects.filter(project => project.category === category);
};

export const countProjects = (projects: Project[], category: ProjectCategory): number => filterProjects(projects, category).length;
