const readBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
};

export const RUNTIME_FLAGS = {
  ENABLE_WEBGL_SKY: readBool(import.meta.env.VITE_ENABLE_WEBGL_SKY, true),
  ENABLE_3D_VIEWERS: readBool(import.meta.env.VITE_ENABLE_3D_VIEWERS, true),
  ENABLE_FOG: readBool(import.meta.env.VITE_ENABLE_FOG, true),
  ENABLE_PARTICLES: readBool(import.meta.env.VITE_ENABLE_PARTICLES, false),
} as const;
