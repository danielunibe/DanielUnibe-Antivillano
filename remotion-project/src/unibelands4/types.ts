export type Lang = 'es' | 'en';

export interface UnibeLandsProps {
  lang: Lang;
  muted: boolean;
  reducedMotion: boolean;
}

export type Phase = 'gate' | 'video' | 'boot' | 'iris' | 'main' | 'exit' | 'next';
