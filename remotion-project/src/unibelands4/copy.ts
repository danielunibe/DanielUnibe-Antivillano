import type { Lang } from './types';

export interface TitlePart {
  t: string;
  k: 'tek' | 'ban';
}

export interface SubSeg {
  t: string;
  hl?: number;
}

export interface CopyDict {
  gateEyebrow: string;
  gateTitle: string;
  gateHint: string;
  bootLines: string[];
  eyebrow: string;
  titleParts: TitlePart[];
  subSegs: SubSeg[];
  tips: string[];
  continueBtn: string;
  volOn: string;
  volOff: string;
  langLabel: string;
  echoId: string;
  nextEyebrow: string;
  nextTitle: string;
  nextSub: string;
  restart: string;
}

const D: Record<Lang, CopyDict> = {
  es: {
    gateEyebrow: 'SEÑAL ENTRANTE',
    gateTitle: 'Toca para iniciar',
    gateHint: 'Recomendado: usa audífonos',
    bootLines: [
      'INICIALIZANDO ECHO-NET...',
      'ENLACE SEGURO ESTABLECIDO',
      'SINCRONIZANDO PERFIL: UNIBELANDS_04',
      'CALIBRANDO HUD...',
      'CARGA COMPLETA',
    ],
    eyebrow: 'TRANSMISIÓN RECIBIDA · CANAL 04',
    titleParts: [
      { t: 'ATENCIÓN ', k: 'tek' },
      { t: 'Buscacámaras', k: 'ban' },
    ],
    subSegs: [
      { t: 'Para una inmersión táctica óptima, se requiere el uso de ' },
      { t: 'audífonos', hl: 1 },
      { t: '.' },
    ],
    tips: [
      'DATO: Unibelands combina renderizado 3D en tiempo real con haptics para crear experiencias sensoriales.',
      'DATO: El pipeline de este portafolio corre en un flujo autónomo de diseño, documentación y código.',
      'DATO: Cada interfaz aquí se diseña pensando en jugabilidad diegética, no solo en estética.',
      'DATO: Pulsa el botón de volumen para activar el audio del sistema ECHO.',
    ],
    continueBtn: 'ENTENDIDO',
    volOn: 'VOL ON',
    volOff: 'VOL OFF',
    langLabel: 'ESPAÑOL',
    echoId: 'ECHO-ID: UNV-2026-04',
    nextEyebrow: 'PERFIL SINCRONIZADO',
    nextTitle: 'Perfil cargado',
    nextSub:
      'Aquí continúa el recorrido por Unibelands 04. Este panel es el punto de enganche para el contenido real del portafolio.',
    restart: 'REINICIAR TRANSMISIÓN',
  },
  en: {
    gateEyebrow: 'INCOMING SIGNAL',
    gateTitle: 'Tap to start',
    gateHint: 'Recommended: use headphones',
    bootLines: [
      'INITIALIZING ECHO-NET...',
      'SECURE LINK ESTABLISHED',
      'SYNCING PROFILE: UNIBELANDS_04',
      'CALIBRATING HUD...',
      'LOAD COMPLETE',
    ],
    eyebrow: 'TRANSMISSION RECEIVED · CHANNEL 04',
    titleParts: [
      { t: 'ATTENTION ', k: 'tek' },
      { t: 'Vault Hunter', k: 'ban' },
    ],
    subSegs: [
      { t: 'For optimal tactical immersion, the use of ' },
      { t: 'headphones', hl: 1 },
      { t: ' is required.' },
    ],
    tips: [
      'FACT: Unibelands blends real-time 3D rendering with haptics to build sensorial experiences.',
      "FACT: This portfolio's pipeline runs on an autonomous design, docs and code workflow.",
      'FACT: Every interface here is designed around diegetic playability, not just looks.',
      'FACT: Tap the volume button to enable the ECHO system audio.',
    ],
    continueBtn: 'ACKNOWLEDGED',
    volOn: 'VOL ON',
    volOff: 'VOL OFF',
    langLabel: 'ENGLISH',
    echoId: 'ECHO-ID: UNV-2026-04',
    nextEyebrow: 'PROFILE SYNCED',
    nextTitle: 'Profile loaded',
    nextSub:
      'This is where the Unibelands 04 tour continues. This panel is the integration hook for the real portfolio content.',
    restart: 'RESTART TRANSMISSION',
  },
};

export function t(lang: Lang): CopyDict {
  return D[lang];
}
