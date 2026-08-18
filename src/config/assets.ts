export const ASSETS = {
  BG: {
    FLOOR: '/assets/world/base/002_p2lpvcp.jpeg',
    AVION: '/assets/world/base/avion.png',
    MONTAÑA_ESTE: '/assets/world/base/montana-este.png',
    MONTAÑA_NORTE: '/assets/world/base/montana-norte.png',
  },
  CLOUDS: [
    '/assets/world/base/005_jtrvdq3.png',
    '/assets/world/base/006_hcdtnxq.png',
  ],
  STRUCTURES: {
    // West wall — primary interactive target (LOOT_MAP)
    WEST_B: '/assets/world/base/pared-oeste-izquierda.png',
    // East wall — right-side decorative structure
    EAST_WALL: '/assets/world/base/pared-este-derecha.png',
    // Communication & Radar Relay Tower situated between West and North sectors
    COMM_TOWER: '/assets/environment/comm-tower.png',
    // Industrial yellow tech backplate behind the Echo Portal
    PORTAL_PLATE: '/assets/environment/portal-plate.png',
    // West zone sign (letrero)
    LETRERO: '/assets/environment/letrero.png',
    // West zone map
    MAPA: '/assets/environment/mapa.png',
    // Container structure between North and East sectors
    CONTAINER: '/assets/environment/container.png',
    // Missions computer — East sector, right side (visual only)
    COMPUTADOR: '/assets/world/interactive/computador.png',
  },
PROPS: {
        PROPP: '/assets/world/base/011_rlzvshi.png',
        DUST: '/assets/world/base/012_fzslzur.png',
        HERO: '/assets/world/base/caja.png',
        HERO_BACK: '/assets/world/base/caja-trasera.png',
    },
  UI: {
    ICONS: {
      REACT: '/assets/technology/icons/015_react-icon.svg',
      TS: '/assets/technology/icons/016_typescript_logo_2020.svg',
      TAILWIND: '/assets/technology/icons/017_tailwind_css_logo.svg',
      THREE: '/assets/technology/icons/018_three_js_icon.svg',
      NODE: '/assets/technology/icons/043_node.svg',
      NEXT: '/assets/technology/icons/044_next.svg',
    },
    WEAPONS: {
      BLASTER: '/assets/portfolio/projects/024_daniel-unibe-pistola-2.jpg',
      RIFLE: '/assets/portfolio/projects/024_daniel-unibe-pistola-2.jpg',
      SNIPER: '/assets/portfolio/projects/024_daniel-unibe-pistola-2.jpg',
    },
  },
  INTERFACE: {
    DOOR: '/assets/interface/puerta-portada.png',
    ANTI_VILLANO_LOGO: '/assets/interface/anti-villano-logo.png',
    DANIEL_UNIBE: '/assets/interface/daniel-unibe.png',
    CORNER_LOGO: '/assets/interface/logo-corner.png',
    CORNER_LOGO_RIGHT: '/assets/interface/logo-corner-right.png',
    PROFILE_FRAME: '/assets/interface/profile-frame.png',
    NORTH_SOUND: '/assets/interface/north/north.mp3',
    WEST_SOUND: '/assets/interface/west/west.mp3',
    EAST_SOUND: '/assets/interface/east/east.mp3',
    GO_BACK: '/assets/interface/go-back.png',
  },
  SOUNDS: {
    HOVER: '/assets/audio/hover.mp3',
    CLICK: '/assets/audio/click.mp3',
    OPEN: '/assets/audio/open.mp3',
    EQUIP: '/assets/audio/equip.mp3',
  },
} as const;

/** Number of animation frames per sector screen. */
export const SECTOR_FRAME_COUNT = 96;

export const getNorthFrame = (index: number): string =>
  `/assets/interface/north/frames/7_${String(index).padStart(5, '0')}.png`;

export const getWestFrame = (index: number): string =>
  `/assets/interface/west/frames/west_${String(index).padStart(5, '0')}.png`;

export const getEastFrame = (index: number): string =>
  `/assets/interface/east/frames/1_${String(index).padStart(5, '0')}.png`;

export const getSectorFrame = (sector: 'WEST' | 'NORTH' | 'EAST', index: number): string => {
  switch (sector) {
    case 'WEST':  return getWestFrame(index);
    case 'NORTH': return getNorthFrame(index);
    case 'EAST':  return getEastFrame(index);
  }
};

export const getSectorSound = (sector: 'WEST' | 'NORTH' | 'EAST'): string => {
  switch (sector) {
    case 'WEST':  return ASSETS.INTERFACE.WEST_SOUND;
    case 'NORTH': return ASSETS.INTERFACE.NORTH_SOUND;
    case 'EAST':  return ASSETS.INTERFACE.EAST_SOUND;
  }
};

export const getPreloadList = (): string[] =>
  Array.from(new Set([
    ...Object.values(ASSETS.BG),
    ...ASSETS.CLOUDS,
    ...Object.values(ASSETS.STRUCTURES),
    ASSETS.PROPS.PROPP,
    ASSETS.PROPS.DUST,
    ASSETS.PROPS.HERO,
    ASSETS.PROPS.HERO_BACK,
    ASSETS.INTERFACE.DOOR,
    ASSETS.INTERFACE.ANTI_VILLANO_LOGO,
    ASSETS.INTERFACE.DANIEL_UNIBE,
  ]));

/**
 * Carga escalonada ("truqueada") para no saturar la red al mismo tiempo:
 * - critical: lo que se ve de inmediato al entrar (vista NORTE) + los gráficos del intro.
 *   Desbloquea el CTA apenas termina.
 * - secondary: el resto del mundo (oeste/este, estructuras, props). Se carga en
 *   background y sigue drenando durante la pantalla negra de salida.
 */
export const PRELOAD_TIERS: { critical: string[]; secondary: string[] } = {
  critical: [
    ASSETS.BG.FLOOR,
    ASSETS.BG.MONTAÑA_NORTE,
    ...ASSETS.CLOUDS,
    ASSETS.STRUCTURES.COMM_TOWER,
    ASSETS.STRUCTURES.CONTAINER,
    ASSETS.INTERFACE.DOOR,
    ASSETS.INTERFACE.ANTI_VILLANO_LOGO,
    ASSETS.INTERFACE.DANIEL_UNIBE,
  ],
  secondary: [
    ASSETS.BG.AVION,
    ASSETS.BG.MONTAÑA_ESTE,
    ASSETS.STRUCTURES.WEST_B,
    ASSETS.STRUCTURES.EAST_WALL,
    ASSETS.STRUCTURES.PORTAL_PLATE,
    ASSETS.STRUCTURES.LETRERO,
    ASSETS.STRUCTURES.MAPA,
    ASSETS.STRUCTURES.COMPUTADOR,
    ASSETS.PROPS.PROPP,
    ASSETS.PROPS.DUST,
    ASSETS.PROPS.HERO,
    ASSETS.PROPS.HERO_BACK,
  ],
};
