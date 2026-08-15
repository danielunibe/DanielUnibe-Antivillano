import React from 'react';

export const SpeakerIcon: React.FC<{
  size?: number;
  color?: string;
  muted?: boolean;
}> = ({ size = 20, color = '#000', muted = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill={color} />
    {!muted ? (
      <>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </>
    ) : (
      <>
        <line x1="16" y1="9" x2="22" y2="15" />
        <line x1="22" y1="9" x2="16" y2="15" />
      </>
    )}
  </svg>
);

export const GlobeIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 20, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="4" ry="9" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="4.2" y1="7.5" x2="19.8" y2="7.5" />
    <line x1="4.2" y1="16.5" x2="19.8" y2="16.5" />
  </svg>
);

export const ArrowRightIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 20, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13,6 19,12 13,18" fill={color} />
  </svg>
);

export const HeadphonesIcon: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 46, color = '#00f0ff' }) => {
  const r = size * 0.4;
  const cw = r * 0.38;
  const ch = r * 0.62;
  return (
    <svg
      width={size}
      height={size}
      viewBox="-30 -30 60 60"
      fill="none"
      stroke={color}
      strokeWidth={r * 0.15}
      strokeLinecap="round"
    >
      <path
        d={`M${-r},${r * 0.1} A${r},${r} 0 0,1 ${r},${r * 0.1}`}
        fill="none"
      />
      <rect
        x={-r - cw / 2}
        y={r * 0.05}
        width={cw}
        height={ch}
        rx={cw * 0.3}
        fill={color}
      />
      <rect
        x={r - cw / 2}
        y={r * 0.05}
        width={cw}
        height={ch}
        rx={cw * 0.3}
        fill={color}
      />
    </svg>
  );
};
