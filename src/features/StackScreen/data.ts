
import { ASSETS } from '../../config/assets';
import { StackItem, WeaponConfig, ItemCategory } from './types';

export interface ExtendedStackItem extends StackItem {
    iconKey?: string;
}

const mapCategory = (userCat: string): ItemCategory => {
    const uc = userCat.toUpperCase();
    if (uc === 'AI') return 'AI';
    if (uc === '3D' || uc === 'GAME') return 'GAME';
    if (uc === 'UI' || uc === 'UI_UX') return 'UI_UX';
    if (uc === 'VIDEO' || uc === 'GRAPHIC' || uc === '2D') return 'GRAPHIC';
    return 'ALL';
};

// Generador de stats ajustados a la rareza
const generateStats = (seed: number, rarity: string) => {
    let base = 50;
    if (rarity === 'common') base = 60;
    if (rarity === 'rare') base = 75;
    if (rarity === 'epic') base = 85;
    if (rarity === 'legendary') base = 92;
    if (rarity === 'mystic') base = 96;

    // Aleatoriedad controlada
    const r = (n: number) => Math.min(99, Math.max(40, base + (n % 10) - 5));

    return {
        knowledge: r(seed),    
        versatility: r(seed * 2), 
        interface: r(seed * 3),  
        learning: r(seed * 4)   
    };
};

export const STACK_DATABASE: ExtendedStackItem[] = [
    // --- GRAPHIC / 2D ---
    { 
        id: 'ps', name: 'Adobe Photoshop', manufacturer: 'ADOBE', cat: '2D', rarity: 'legendary',
        description: "El Manipulador de Fotones. Estándar indiscutible de la industria para manipulación rasterizada compleja. Su dominio requiere años, pero otorga control total sobre la realidad visual."
    },
    { 
        id: 'ai', name: 'Adobe Illustrator', manufacturer: 'ADOBE', cat: '2D', rarity: 'epic',
        description: "El Arquitecto Vectorial. Complejidad matemática oculta tras una pluma. Esencial para branding y diseño escalable, con una curva de aprendizaje técnica elevada."
    },
    { 
        id: 'id', name: 'Adobe InDesign', manufacturer: 'ADOBE', cat: '2D', rarity: 'rare',
        description: "El Ordenador de Glyphs. Herramienta de nicho editorial. Altamente especializada en maquetación masiva y sistemas de grilla rígidos. Vital para la industria impresa."
    },
    { 
        id: 'affinity', name: 'Affinity Designer', manufacturer: 'SERIF', cat: '2D', rarity: 'rare',
        description: "La Hoja Ligera. Una alternativa ágil y optimizada. Menos extendida que Adobe pero con una base de usuarios técnica leal por su rendimiento en hardware moderno."
    },
    
    // --- UI / UX ---
    { 
        id: 'figma', name: 'Figma', manufacturer: 'FIGMA', cat: 'UI', rarity: 'mystic',
        description: "El Nexo Neuronal. La herramienta definitiva de diseño de sistemas. Colaboración en tiempo real a escala global. Su complejidad radica en la gestión de sistemas de diseño atómicos masivos."
    },
    { 
        id: 'xd', name: 'Adobe XD', manufacturer: 'ADOBE', cat: 'UI', rarity: 'common',
        description: "Prototipador de Flujos. Una herramienta introductoria y ligera para diseño de interfaces. Fácil de aprender, ampliamente accesible, pero limitada en sistemas complejos."
    },

    // --- 3D / GAME ---
    { 
        id: 'blender', name: 'Blender', manufacturer: 'FND', cat: '3D', rarity: 'mystic',
        description: "La Forja del Omniverso. Software de código abierto con profundidad infinita: Esculpido, Rigging, Animación, Simulación, Composición y Scripting en Python. Una vida no basta para dominarlo todo."
    },
    { 
        id: 'unreal', name: 'Unreal Engine 5', manufacturer: 'EPIC', cat: 'Game', rarity: 'mystic',
        description: "El Motor de Dios. La cúspide de la renderización en tiempo real. Nanite y Lumen redefinen la física de la luz. Curva de aprendizaje vertical reservada para desarrolladores técnicos de élite."
    },
    { 
        id: 'unity', name: 'Unity', manufacturer: 'UNITY', cat: 'Game', rarity: 'epic',
        description: "El Ensamblador Universal. El motor más versátil del mercado. Desde móviles hasta VR. Requiere dominio de C# y arquitectura de componentes para proyectos a gran escala."
    },
    { 
        id: 'zbrush', name: 'ZBrush', manufacturer: 'MAXON', cat: '3D', rarity: 'epic',
        description: "Escultor de Materia Digital. Interface alienígena única que ignora estándares de la industria para ofrecer libertad orgánica absoluta. El estándar para criaturas y personajes de cine."
    },
    { 
        id: 'sub-pt', name: 'Substance Painter', manufacturer: 'ADOBE', cat: '3D', rarity: 'rare',
        description: "Texturizador Alquímico. Herramienta especializada para PBR (Physically Based Rendering). Esencial en el pipeline moderno de juegos AAA."
    },
    { 
        id: '3dsmax', name: '3ds Max', manufacturer: 'AUTODESK', cat: '3D', rarity: 'rare',
        description: "El Veterano Estructural. Un pilar histórico en visualización arquitectónica. Robusto, técnico y preciso, aunque con una base de código antigua."
    },

    // --- VIDEO ---
    { 
        id: 'ae', name: 'After Effects', manufacturer: 'ADOBE', cat: 'Video', rarity: 'legendary',
        description: "Manipulador del Espacio-Tiempo. Profundidad técnica abismal. Combina código (expresiones) con composición visual. El estándar para Motion Graphics de alto nivel."
    },
    { 
        id: 'prem', name: 'Premiere Pro', manufacturer: 'ADOBE', cat: 'Video', rarity: 'rare',
        description: "Secuenciador de Memorias. Editor no lineal estándar. Potente pero accesible. Su complejidad radica en el manejo de codecs y flujos de trabajo de color profesional."
    },
    { 
        id: 'audition', name: 'Adobe Audition', manufacturer: 'ADOBE', cat: 'Video', rarity: 'common',
        description: "Resonador de Frecuencias. Herramienta de audio directa y destructiva. Especializada en restauración y mezcla básica. Uso específico y directo."
    },

    // --- AI ---
    { 
        id: 'gpt', name: 'ChatGPT', manufacturer: 'OPENAI', cat: 'AI', rarity: 'mystic',
        description: "El Oráculo Sintético. LLM de propósito general que reescribe paradigmas de codificación y generación de texto. Una 'caja negra' de conocimiento infinito."
    },
    { 
        id: 'claude', name: 'Claude', manufacturer: 'ANTHROPIC', cat: 'AI', rarity: 'legendary',
        description: "Analista de Contexto Profundo. Especializado en retención de memoria masiva y razonamiento complejo. Herramienta superior para análisis de código extenso."
    },
    { 
        id: 'mj', name: 'Midjourney', manufacturer: 'MJ', cat: 'AI', rarity: 'epic',
        description: "El Soñador Visual. Generación de imágenes estocástica de alta fidelidad. Requiere ingeniería de prompts precisa para controlar su naturaleza caótica."
    },

    // --- DEV ---
    { 
        id: 'react', name: 'REACT CORE', manufacturer: 'META', cat: 'DEV', rarity: 'legendary',
        description: "El Reactor de Componentes. La librería más dominante de la web moderna. Su ecosistema masivo y patrones de gestión de estado definen el desarrollo frontend actual."
    },
    { 
        id: 'ts', name: 'TYPESCRIPT', manufacturer: 'MS', cat: 'DEV', rarity: 'epic',
        description: "Armadura de Sintaxis. Añade tipado estático estricto a JavaScript. Indispensable para escalar aplicaciones empresariales sin deuda técnica."
    },
    { 
        id: 'powershell', name: 'POWERSHELL', manufacturer: 'MS', cat: 'DEV', rarity: 'common',
        description: "Terminal de Comando. Acceso directo de bajo nivel al kernel. Poderoso para automatización, pero una herramienta utilitaria básica en el arsenal del desarrollador."
    },
    { 
        id: 'next', name: 'NEXT.JS', manufacturer: 'VERCEL', cat: 'DEV', rarity: 'epic',
        description: "El Acelerador de Fotones. Framework meta para React. Abstrae la complejidad del renderizado híbrido (SSR/CSR). El estándar para aplicaciones web de producción."
    },
    { 
        id: 'tailwind', name: 'TAILWIND CSS', manufacturer: 'LABS', cat: 'DEV', rarity: 'rare',
        description: "Estilizador Atómico. Utilidad de bajo nivel que permite prototipado ultrarrápido directamente en el markup. Polarizante pero altamente efectivo."
    },
].map(item => {
    return {
        id: item.id,
        name: item.name.toUpperCase(),
        manufacturer: item.manufacturer || 'UNKNOWN',
        category: mapCategory(item.cat),
        type: item.cat,
        rarity: item.rarity as any,
        level: 1, 
        score: 0, 
        icon: '',
        iconKey: item.id,
        description: item.description,
        stats: generateStats(item.name.length, item.rarity)
    };
});

export const WEAPONS_DATABASE: WeaponConfig[] = [
    {
        id: 'frontend_blaster', name: 'FRONTEND BLASTER', subtitle: 'RIFLE DE ASALTO WEB',
        image: ASSETS.UI.WEAPONS.BLASTER,
        description: 'Combinación letal de React, TypeScript y Tailwind. Domina el DOM con precisión quirúrgica y velocidad de renderizado optimizada.',
        components: ['react', 'ts', 'tailwind', 'next'],
        stats: { knowledge: 95, versatility: 90, interface: 98, learning: 85 },
        rarity: 'legendary', score: 0
    },
    {
        id: 'pixel_cannon', name: 'PIXEL CANNON', subtitle: 'CAÑÓN DE DISEÑO',
        image: ASSETS.UI.WEAPONS.RIFLE,
        description: 'Figma y Photoshop unidos. Genera interfaces de usuario de alto impacto y assets visuales con fidelidad absoluta.',
        components: ['figma', 'ps', 'ai'],
        stats: { knowledge: 85, versatility: 65, interface: 100, learning: 92 },
        rarity: 'epic', score: 0
    },
    {
        id: 'ai_architect', name: 'AI ARCHITECT', subtitle: 'BACULO GENERATIVO',
        image: ASSETS.UI.WEAPONS.SNIPER,
        description: 'Utiliza el poder de los modelos de lenguaje y visión para automatizar y elevar la calidad de cualquier proyecto técnico.',
        components: ['gpt', 'claude', 'mj'],
        stats: { knowledge: 99, versatility: 80, interface: 75, learning: 100 },
        rarity: 'mystic', score: 0
    }
];
