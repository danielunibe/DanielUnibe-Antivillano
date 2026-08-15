
export type ItemCategory = 'ALL' | 'GRAPHIC' | 'UI_UX' | 'GAME' | 'AI';
export type ViewMode = 'RESOURCES' | 'WEAPONS';

export interface ItemStats {
    knowledge: number;      // Conocimiento del Software
    versatility: number;    // Versatilidad Multiplataforma
    interface: number;      // Dominio de la Interface
    learning: number;       // Arco de Aprendizaje
}

export interface StackItem {
    id: string;
    name: string;
    manufacturer: string;
    category: ItemCategory | 'DEV';
    type: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mystic';
    level: number;
    score: number;
    icon: string;
    iconKey?: string;
    description: string;
    stats: ItemStats;
}

export interface WeaponConfig {
    id: string;
    name: string;
    subtitle: string;
    image: string;
    description: string;
    components: string[];
    stats: ItemStats;
    rarity: string; 
    score: number;
}

// Type Guard
export const isWeapon = (item: any): item is WeaponConfig => {
    return 'components' in item;
};
