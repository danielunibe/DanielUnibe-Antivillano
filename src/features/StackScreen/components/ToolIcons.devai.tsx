import React, { useId } from 'react';
import { IconProps } from './ToolIcons.types';

// --- DEV & UTILS ---

export const ReactIcon: React.FC<IconProps> = ({ className, style }) => (
     <svg viewBox="-11.5 -10.23174 23 20.46348" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
        <g stroke="#61dafb" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
     </svg>
);

export const TypescriptIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 128 128" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
         <rect width="128" height="128" rx="15" fill="#3178c6"/>
         <path d="M69.5 98.3h-11v-30H46.4v-9h35v9h-12v30zm29 0H88.6c-7 0-7-5-7-7 0-8 15-7 15-16 0-9-9-10-17-9v-8c7 0 8-3 8-6 0-8-15-7-15-16 0-9 9-10 16-10h10z" fill="#fff"/>
    </svg>
);

export const PowerShellIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg viewBox="0 0 256 256" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" rx="50" fill="#29405b"/>
      <path d="M190 60H66c-5 0-9 4-9 9v118c0 5 4 9 9 9h124c5 0 9-4 9-9V69c0-5-4-9-9-9z" fill="#a9c8ff"/>
      <path d="M85 150l50-36-50-36" stroke="#29405b" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M135 150h36" stroke="#29405b" strokeWidth="12" fill="none" strokeLinecap="round"/>
  </svg>
);

// WEAPON COMPONENTS
export const TailwindIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 256 154" className={className} style={style} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
        <path fill="#38bdf8" d="M128 0C93.8 0 72.5 31 66 55.3c-6.5-24.3-27.8-55.3-62-55.3-36 0-64 28.6-64 64 0 35.4 28 64 64 64 36 0 64-28.6 64-64 0 35.4 28 64 64 64 36 0 64-28.6 64-64 0-35.4-28-64-64-64zm-62 108.7c-26.5 0-48-21.5-48-48s21.5-48 48-48c14.2 0 26.9 6.2 35.7 16-11.4 7.6-26.6 9.6-35.7 32z"/>
    </svg>
);

export const NextIcon: React.FC<IconProps> = ({ className, style }) => {
    const maskId = useId();
    return (
        <svg viewBox="0 0 180 180" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180" style={{maskType:'alpha'}}>
                <circle cx="90" cy="90" r="90" fill="black"/>
            </mask>
            <g mask={`url(#${maskId})`}>
                <circle cx="90" cy="90" r="90" fill="white"/>
                <path d="M149.5 177.5L69.5 73.8V119H57.5V59H70L150.3 162.7C150.1 162.8 149.8 163 149.5 177.5Z" fill="black"/>
                <path d="M117.5 119H129.5V59H117.5V119Z" fill="black"/>
            </g>
        </svg>
    );
};

// --- AI & NEW ICONS ---

export const OpenAIIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0843 1.6567-1.2246 2.9165-1.7405 1.5428 1.1402a4.4993 4.4993 0 0 1-3.3815 2.9496zm-7.6687-2.3456a4.47 4.47 0 0 1-.5363-3.0583l.142-.0844 1.8848 1.1164 1.4809.8763.5363 1.7738v1.7169l-1.9576 1.4426a4.456 4.456 0 0 1-1.55-.7983zm-.5363-8.763a4.4946 4.4946 0 0 1 2.3397-2.2031l.142-.0844 1.9576 1.1402.2086 1.7643-.2086 1.7643-2.9165 1.7405-1.5233-.8763a4.4851 4.4851 0 0 1 0-3.2455zm6.575-3.843a4.47 4.47 0 0 1 3.3815-1.0361l-.142.0844-1.6567 1.2246-2.9165 1.7405-1.5428-1.1402a4.4993 4.4993 0 0 1 2.8765-2.8732zm7.6687 2.3456a4.47 4.47 0 0 1 .5363 3.0583l-.142.0844-1.8848 1.1164-1.4809.8763-.5363-1.7738v-1.7169l1.9576-1.4426a4.456 4.456 0 0 1 1.55.7983zm.5363 8.763a4.4946 4.4946 0 0 1-2.3397 2.2031l-.142.0844-1.9576-1.1402-.2086-1.7643.2086-1.7643 2.9165-1.7405 1.5233.8763a4.4851 4.4851 0 0 1 0 3.2455zM12 9.1791a2.84 2.84 0 1 0 0 5.679 2.84 2.84 0 0 0 0-5.679z"/>
    </svg>
);

export const ClaudeIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M18.6 3H5.4C4.1 3 3 4.1 3 5.4v13.2C3 19.9 4.1 21 5.4 21h13.2c1.3 0 2.4-1.1 2.4-2.4V5.4C21 4.1 19.9 3 18.6 3zm-6.6 15c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-10.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5z"/>
    </svg>
);

export const MidjourneyIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M12.007 2c-5.522 0-9.998 4.476-9.998 9.998 0 5.522 4.476 9.998 9.998 9.998 5.522 0 9.998-4.476 9.998-9.998 0-5.522-4.476-9.998-9.998-9.998Zm0 1.5c4.693 0 8.498 3.805 8.498 8.498 0 4.693-3.805 8.498-8.498 8.498-4.693 0-8.498-3.805-8.498-8.498 0-4.693 3.805-8.498 8.498-8.498Zm3.5 5.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5Zm-7 0c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5Z"/>
    </svg>
);

export const AiBrainIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9.5 2c-1.7 0-3 1.3-3 3 0 .7.3 1.4.7 1.9-.3.1-.7.1-1.2.1C4.3 7 3 8.3 3 10c0 1.2.7 2.2 1.7 2.7-.2.4-.2.9-.2 1.3 0 1.7 1.3 3 3 3 .6 0 1.1-.2 1.6-.5.6 1.4 2 2.5 3.9 2.5s3.3-1.1 3.9-2.5c.5.3 1 .5 1.6.5 1.7 0 3-1.3 3-3 0-.4-.1-.9-.2-1.3 1-.5 1.7-1.5 1.7-2.7 0-1.7-1.3-3-3-3-.5 0-.9 0-1.2.1.4-.5.7-1.2.7-1.9 0-1.7-1.3-3-3-3-1.4 0-2.5.9-2.9 2.1C12 3 10.9 2 9.5 2zM12 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const AiVideoIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round"/>
        <path d="M7 8l10 4-10 4V8z" fill="currentColor" fillOpacity="0.2"/>
        <path d="M15 4v16" strokeDasharray="2 2" strokeOpacity="0.5"/>
    </svg>
);

export const AiAudioIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round"/>
        <line x1="12" y1="19" x2="12" y2="22" strokeLinecap="round"/>
    </svg>
);

export const PythonIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M14.25.75A2.75 2.75 0 0 0 11.5 3.5h-2a4.5 4.5 0 0 0-4.5 4.5v1h4v-1a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-5a4.5 4.5 0 0 0-4.5 4.5v2a2.75 2.75 0 0 0 2.75 2.75h2a4.5 4.5 0 0 0 4.5-4.5v-1h-4v1a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h5a4.5 4.5 0 0 0 4.5-4.5v-2A2.75 2.75 0 0 0 14.25.75zM8 19.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm8-15a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>
);

export const TerminalIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 17l6-6-6-6M12 19h8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const DatabaseIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 5c0 1.66-4 3-9 3s-9-1.34-9-3 4-3 9-3 9 1.34 9 3z"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
    </svg>
);

export const CanvaIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
       <circle cx="12" cy="12" r="10" fillOpacity="0.2"/>
       <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="bold" fontFamily="sans-serif">C</text>
    </svg>
);
