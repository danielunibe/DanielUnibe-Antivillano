import React, { useId } from 'react';
import { IconProps } from './ToolIcons.types';

// --- 3D & GAME DEV ---

export const BlenderIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg viewBox="0 0 256 198" className={className} style={style} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
    <path fill="#fff" d="M162.7 122.7c0 23.4-18.9 42.4-42.3 42.4-23.3 0-42.3-19-42.3-42.4 0-23.3 19-42.3 42.3-42.3 23.4.1 42.3 19 42.3 42.3z"/>
    <path fill="#E87D0D" d="M109.9 83.1c-22.1-9.5-35.9-31.9-34.5-56.1C76.9 11.2 88.5 0 88.5 0l39.2 26.8C75.2 65.1 27.6 98.4 27.6 98.4c-9.5 7.1-13.2 19.3-8.9 29.5 4.3 10.1 16.1 15.3 26.5 11.5l50.4-38.9 14.3-17.4z"/>
    <path fill="#265787" d="M141.2 100c-7.9 0-15.3 2.1-21.8 5.7L67.1 142.1c-6.2 4.4-8 12.3-4.7 18.7 3.3 6.3 11.1 9 17.5 5.9l59.6-28.8c.6 0 1.2-.1 1.8-.1 23.3 0 42.3 19 42.3 42.4 0 23.4-18.9 42.4-42.3 42.4-23.3 0-42.3-19-42.3-42.4 0-5.3 1-10.4 2.8-15.2L73 149.7c-9.5 13.9-15.1 30.8-15.1 49.1 0 48.2 39.1 87.3 87.3 87.3 48.2 0 87.3-39.1 87.3-87.3-.1-48.3-39.2-87.3-87.4-87.3l-3.9-1.5z" transform="translate(-15.1 -87.8)"/>
  </svg>
);

export const MayaIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 2288 2500" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
        <path d="M196.78,420.72h2091.22v2048.74H206.92c-5.6,0-10.15-4.54-10.15-10.15V420.72h0Z" fill="#36697f"/>
        <path d="M365.13,1748.6L0,1972.01V252.37L365.13,30.54v1718.06h0Z" fill="#7dc6dd"/>
        <path d="M365.13,30.54h1746.07c5.81,0,10.46,4.65,10.46,10.46v1707.6H365.13V30.54Z" fill="#37a5cc"/>
        <path d="M935.78,830.99c0-35.64-.54-73.74-1.64-114.04-1.1-40.58-3.29-82.79-6.58-127.48h5.76c6.3,34.54,11.79,62.5,16.72,84.16,4.66,21.66,8.49,37.01,11.51,45.78l220.96,644.51h158.73l218.49-650.27c4.66-13.16,9.05-29.88,13.16-50.17s9.05-44.69,14.53-73.47h5.76c-2.47,36.46-4.66,71.83-6.03,105.82-1.37,34-2.19,66.07-2.19,96.5v571.59h194.62V414.85h-280.17l-190.8,567.75c-6.03,17.54-12.06,37.01-18.09,57.84s-12.06,43.59-17.82,67.71h-3.84c-4.39-20.29-9.05-40.57-13.98-61.41-4.93-20.56-11.51-41.67-19.46-62.78l-190.8-569.12h-286.48v948.81h177.64v-532.66Z" fill="#fff"/>
        <polygon points="1779.6 1363.92 1779.58 1363.92 1779.58 1363.93 1779.6 1363.92" fill="#fff"/>
        <path d="M1274.62,2057.72h-.95c-1.59-5.92-61.72-141.61-61.72-141.61h-92.47l113.53,212.51v153.25h79.17v-153.26l114.73-212.4h-84.55s-66.58,137.6-67.74,141.51Z" fill="#fff"/>
        <path d="M975.01,1916.11h-89.83l-127.03,365.76h82.11l23.99-77.78h127.98l24.31,77.78h83.07l-124.6-365.76ZM881.07,2141.63l40.05-130.3c1.27-4.23,2.43-8.35,3.28-12.26s1.69-8.35,2.54-13.32h1.9c.63,5.71,1.47,10.25,2.32,13.95.95,3.6,2.21,7.82,3.8,12.58l39.31,129.35h-93.2Z" fill="#fff"/>
        <path d="M1688.4,1916.11h-89.83l-127.03,365.76h82.11l23.99-77.78h127.98l24.31,77.78h83.07l-124.6-365.76ZM1594.47,2141.63l40.05-130.3c1.27-4.23,2.43-8.35,3.28-12.26s1.69-8.35,2.54-13.32h1.9c.63,5.71,1.47,10.25,2.32,13.95.95,3.6,2.21,7.82,3.8,12.58l39.31,129.35h-93.2Z" fill="#fff"/>
    </svg>
);

export const ThreeDsMaxIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 256 256" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
        <path d="M36 51h220v215H35c-1 0-1 0-1-1V51z" fill="#36697f"/>
        <path d="M54 190 15 214V33l39-23v180z" fill="#7dc6dd"/>
        <path d="M54 10h183c1 0 1 0 1 1v179H54V10z" fill="#37a5cc"/>
        <path d="M184 115c-1-3-2-5-3-7-2-2-4-4-6-6-2-1-4-3-7-4 2-1 4-2 6-4 2-2 4-4 5-6 2-2 3-4 3-6 .8-2 1-5 1-7 0-5-1-9-3-13-2-4-5-7-8-10-3-3-8-4-12-6-5-1-10-2-16-2s-10 .7-15 2c-5 1-9 3-12 6-3 3-6 6-8 9-2 4-3 8-3 12v1h23v-1c0-2 .4-3 1-5 .8-1 2-3 3-4 1-1 3-2 5-2 2-1 4-1 6-1 2 0 5 0 7 1 2 1 3 2 5 3 1 1 2 3 3 4 .6 2 1 3 1 5 0 2-.3 4-.9 6-.6 2-2 3-3 4-1 1-3 2-5 3-2 1-5 1-7 1s-5 0-7-1c-2-1-4-2-5-3-1-1-3-2-3-4-.8-2-1-3-1-5v-1H116v1c0 5 1 10 3 13 2 4 5 7 9 9 4 3 8 4 12 6 5 1 9 2 14 2 5 0 11-1 16-2 5-1 9-3 13-6 4-3 6-6 9-10 2-4 3-8 3-13-.1-3-.5-6-1-8zm-55 132H121V224c0-1 0-3 0-4s.1-3 .2-4h-.2c-.2 1-.4 2-.6 3-.2 1-.3 2-.5 2l-9 26H105l-9-26c-.1-.4-.3-1-.5-2-.2-1-.4-2-.7-3h-.2c.1 2 .2 4 .3 5 .1 2 .1 3 .1 5v22H88V209h12l8 23c.3.9.6 2 .8 3 .2.8.4 2 .6 2h.2c.2-1 .5-2 .7-3 .2-.8.5-2 .7-2l8-23h11v38zm5 0 13-38h9l13 38h-9l-3-8h-13l-3 8h-7zm13-15h10l-4-14c-.2-.5-.3-.9-.4-1-.1-.4-.2-.9-.2-1h-.2c-.1.5-.2 1-.3 1-.1.5-.2.9-.3 1l-4 14zm58 15h-9l-6-13c-.1-.2-.2-.6-.4-1-.1-.4-.2-.9-.4-2h-.1c-.1.3-.2.7-.3 1-.1 2-.5 2l-6 13h-10l12-19-11-19h10l5 12c.2.4.4.9.6 1 .2.5.4 1 .5 2h.1c.1-.4.3-.9.5-1 .1-.4.4-1 .7-2l6-12h9l-11 19 11 19z" fill="#fff"/>
    </svg>
);

export const UnrealIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg viewBox="0 0 256 256" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm73.2 145.8c-11 11.2-23.2 22.7-31.4 14.8 0 0-.4-42.3-.4-59.6 0-23.3 22.1-40.6 22.1-40.6a75 75 0 0 0-46.2 26s-5.8-5.1-15.3-3.6a21 21 0 0 1 9.3 16.2v17.4c0 8.8-10.1 22.5-18 9a11 11 0 0 1-5-1.2 11.9 11.9 0 0 1-5.5-6v-74.8c-2.3 1.9-10 3.5-10-9.5 0-8 5.7-17.5 16-23.5a75 75 0 0 0-64.2 75.2s7.5-23.6 17-25.8a9.1 9.1 0 0 1 11.5 9.1v54.2c0 5.7-3.7 6.8-7 6.8-2.3-.2-4.5-.6-6.7-1.2a75.4 75.4 0 0 0 59.6 23.3l20.5-20.5 12 13.6a75 75 0 0 0 41.7-50.7z" fill="#fff"/>
  </svg>
);

export const UnityIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg viewBox="0 0 256 263" className={className} style={style} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
      <path d="M166.9 131.2 212.8 52l22.2 79.2-22.2 79.3-46-79.3zm-22.4 13 46 79.2-80-20.5L52.6 144h91.9zm45.9-105.2-45.9 79.3H52.7l57.7-58.8 80-20.5zm65.5 65.2L228 0 123.4 28 107.9 55.2l-31.4-.2L0 131.2l76.5 76.3 31.4-.2 15.5 27.2 104.5 27.9 28-104.2-15.9-27 16-27z" fill="#fff"/>
  </svg>
);

export const ZBrushIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 256 256" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
        <circle cx="128" cy="128" r="128" fill="#000"/>
        <path d="M188 64h-80l-44 128h80l44-128z" fill="#333"/>
        <path d="M50 128h60l-20 60H30l20-60z" fill="#555"/>
        <path d="M206 128H146l20-60h60l-20 60z" fill="#555"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontFamily="Arial" fontWeight="bold" fontSize="140">Z</text>
    </svg>
);

export const ObsIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 24 24" className={className} style={style} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" opacity="0.3"/>
    </svg>
);

// --- ADOBE SUITE ---

export const PhotoshopIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg viewBox="0 0 83 80" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M67.5 0H14.5C6.5 0 0 6.5 0 14.5V65.5C0 73.5 6.5 80 14.5 80H67.5C75.5 80 82 73.5 82 65.5V14.5C82 6.5 75.5 0 67.5 0Z" fill="#001E36"/>
    <path d="M18.5 56.1V20.9c0-.3.1-.4.3-.4.6 0 1.1 0 1.9 0 .8 0 1.7 0 2.6 0 .9 0 1.9 0 3 0 1 0 2.1 0 3.1 0 2.8 0 5.1.3 7.1 1 1.7.6 3.3 1.5 4.6 2.8 1.1 1.1 2 2.4 2.5 3.9.5 1.4.8 2.9.8 4.4 0 2.9-.7 5.4-2 7.3-1.4 1.9-3.3 3.4-5.5 4.1-2.3.9-4.9 1.2-7.7 1.2-.8 0-1.4 0-1.7 0-.3 0-.8 0-1.5 0v11c0 .1 0 .1 0 .2 0 .1-.1.1-.1.2-.1.1-.1.1-.2.1-.1 0-.1 0-.2 0h-6.6c-.3 0-.4-.1-.4-.4zm7.4-29v11.5c.5 0 .9 0 1.3 0h1.8c1.3 0 2.7-.2 3.9-.6 1.1-.3 2.1-1 2.8-1.8.7-.8 1.1-2 1.1-3.5 0-1.1-.3-2.1-.8-3-.6-.9-1.4-1.6-2.4-2-1.3-.5-2.6-.7-4-.7-.9 0-1.7 0-2.3 0-.7 0-1.1.1-1.4.1z" fill="#31A8FF"/>
    <path d="M65.6 36.5c-1-.5-2.1-.9-3.3-1.2-1.3-.3-2.5-.4-3.8-.4-.7 0-1.4.1-2.1.3-.4.1-.8.3-1.1.7-.2.3-.3.6-.3.9 0 .3.1.6.3.9.3.4.7.7 1.2.9.8.4 1.6.8 2.4 1.1 1.8.6 3.6 1.5 5.3 2.5 1.1.7 2 1.7 2.7 2.8.5 1.1.8 2.3.8 3.5 0 1.6-.5 3.2-1.3 4.5-1 1.4-2.3 2.4-3.8 3.1-1.7.7-3.7 1.1-6.2 1.1-1.6 0-3.1-.1-4.7-.5-1.2-.2-2.4-.6-3.5-1.1-.1-.1-.2-.2-.3-.3-.1-.1-.1-.2-.1-.4V49.1c0-.1 0-.1 0-.2 0-.1.1-.1.1-.1.1 0 .1 0 .2 0 .1 0 .1 0 .2 0 1.3.8 2.7 1.3 4.2 1.7 1.3.3 2.7.5 4 .5 1.3 0 2.2-.2 2.8-.5.3-.1.5-.3.7-.6.2-.3.3-.5.3-.8 0-.5-.3-.9-.8-1.4-.6-.4-1.7-1-3.4-1.6-1.7-.6-3.4-1.4-4.9-2.5-1.1-.7-1.9-1.7-2.6-2.9-.5-1.1-.8-2.3-.8-3.5 0-1.5.4-2.9 1.2-4.1.9-1.4 2.1-2.5 3.6-3.2 1.6-.8 3.6-1.2 6.1-1.2 1.4 0 2.8.1 4.2.3 1 .1 2 .4 2.9.8.1 0 .2 0 .2.1s.1.1.1.2.1.2.1.2V36.2c0 .1 0 .1 0 .2 0 .1-.1.1-.1.2-.1 0-.2.1-.2.1-.2-.1-.3-.1-.4-.2z" fill="#31A8FF"/>
  </svg>
);

export const IllustratorIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg viewBox="0 0 83 80" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M67.5 0H14.5C6.5 0 0 6.5 0 14.5V65.5C0 73.5 6.5 80 14.5 80H67.5C75.5 80 82 73.5 82 65.5V14.5C82 6.5 75.5 0 67.5 0Z" fill="#330000"/>
    <path d="M39.8 48H27L24.5 56c0 .1-.1.3-.2.4-.1.1-.3.1-.4.1H17.4c-.4 0-.5-.2-.4-.6L28 24.2c.1-.3.2-.7.3-1.1.1-.7.2-1.5.2-2.2 0-.1 0-.1 0-.2 0-.1 0-.1.1-.2 0 0 .1-.1.1-.1.1 0 .1 0 .2 0h8.8c.3 0 .4.1.4.3l12.5 35.2c.1.4 0 .5-.3.5h-7.2c-.1 0-.3 0-.4-.1-.1-.1-.2-.2-.2-.3L39.8 48zM29 41.1h8.7c-.2-.7-.5-1.6-.8-2.5-.3-.9-.6-1.9-.9-2.9-.3-1-.7-2.1-1-3.1-.3-1-.6-2.1-.9-3-.3-1-.5-1.9-.7-2.7h-.1c-.3 1.5-.7 3-1.2 4.4-.5 1.7-1 3.3-1.6 5.1-.5 1.7-1 3.3-1.5 4.7z" fill="#FF9A00"/>
    <path d="M58 26.3c-.6 0-1.1-.1-1.6-.3-.5-.2-1-.5-1.4-.9-.4-.4-.7-.9-.9-1.5-.2-.5-.3-1.1-.3-1.6 0-.6.1-1.1.3-1.7.2-.5.5-1 .9-1.4.4-.4.9-.7 1.5.9-.5.2-1.1.3-1.6.4zM54.2 56V29.7c0-.3.1-.5.4-.5h6.8c.3 0 .4.2.4.5V56c0 .4-.1.5-.4.5h-6.7c-.3 0-.5-.2-.5-.5z" fill="#FF9A00"/>
  </svg>
);

export const InDesignIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg viewBox="0 0 83 80" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M67.5 0H14.5C6.5 0 0 6.5 0 14.5V65.5C0 73.5 6.5 80 14.5 80H67.5C75.5 80 82 73.5 82 65.5V14.5C82 6.5 75.5 0 67.5 0Z" fill="#49021F"/>
    <path d="M29.8 20.9V56c0 .4-.2.5-.5.5h-6.7c-.3 0-.4-.2-.4-.5V20.9c0-.3.2-.4.5-.4h6.7c.1 0 .1 0 .2 0 .1 0 .1 0 .1.1.1 0 .1.1.1.1 0 .1 0 .1 0 .2z" fill="#FF3366"/>
    <path d="M49.5 57.1c-2.5 0-5.1-.5-7.3-1.5-2.1-1-3.9-2.6-5.2-4.7-1.2-2.1-1.9-4.7-1.9-7.8 0-2.5.6-5 1.9-7.2 1.3-2.2 3.2-4.1 5.4-5.3 2.4-1.3 5.3-2 8.6-2 .2 0 .4 0 .7.1.3 0 .6.1 1 .1V17.9c0-.3.1-.4.3-.4h6.9c.1 0 .1 0 .2 0 0 0 .1 0 .1.1 0 0 .1 0 .1.1 0 0 0 .1 0 .1v32.5c0 .6 0 1.3.1 2 .1.7.1 1.4.1 2 0 .1 0 .2-.1.3-.1.1-.1.2-.2.2-1.8.7-3.6 1.3-5.5 1.6-1.7.4-3.5.6-5.3.6zm3.4-6.8V35.2c-.3-.1-.6-.1-.9-.2-.4 0-.8-.1-1.1-.1-1.3 0-2.7.3-3.9.9-1.2.6-2.2 1.5-2.9 2.5-.8 1.1-1.1 2.6-1.1 4.3 0 1.2.2 2.4.6 3.5.3.9.9 1.7 1.5 2.4.7.6 1.4 1.1 2.3 1.4.9.3 1.9.4 2.8.4.5 0 1 0 1.4-.1.4 0 .8-.1 1.3-.2z" fill="#FF3366"/>
  </svg>
);

export const AfterEffectsIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg viewBox="0 0 83 80" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M67.5 0H14.5C6.5 0 0 6.5 0 14.5V65.5C0 73.5 6.5 80 14.5 80H67.5C75.5 80 82 73.5 82 65.5V14.5C82 6.5 75.5 0 67.5 0Z" fill="#00005B"/>
    <path d="M33 47.9H20.2L17.7 56c0 .1-.1.3-.2.4-.1.1-.3.1-.4.1H10.6c-.4 0-.5-.2-.4-.6L21.2 24.2c.1-.3.2-.7.3-1.1.1-.7.2-1.5.2-2.2 0-.1 0-.1 0-.2 0-.1 0-.1.1-.1.1-.1.2-.1h8.8c.3 0 .4.1.4.3l12.5 35c.1.4 0 .5-.3.5h-7.2c-.1 0-.3 0-.4-.1-.1-.1-.1-.2-.2-.3l-2.8-8zm-10.7-6.8h8.7c-.2-.7-.5-1.6-.8-2.5-.3-.9-.6-1.9-.9-2.9-.3-1-.7-2.1-1-3.1-.3-1-.6-2.1-.9-3-.3-1-.5-1.9-.7-2.7h-.1c-.3 1.5-.7 3-1.2 4.4-.5 1.7-1 3.3-1.6 5.1-.5 1.6-1 3.3-1.5 4.7z" fill="#9999FF"/>
    <path d="M64.1 44.7H53.2c.1 1.1.5 2.1 1 3 .6.9 1.5 1.6 2.5 2.1 1.4.6 2.9.9 4.4.9 1.2 0 2.4-.1 3.5-.4 1-.1 2.1-.4 3.1-.8.2-.1.3 0 .3.3V55c0 .1 0 .3-.1.4-.1.1-.2.2-.3.2-1.1.5-2.2.8-3.4 1-1.6.3-3.2.4-4.8.4-2.6 0-4.8-.4-6.5-1.2-1.7-.7-3.1-1.8-4.3-3.2-1.1-1.3-1.9-2.8-2.4-4.5-.5-1.6-.7-3.3-.7-5 0-1.8.3-3.7.9-5.4.5-1.7 1.4-3.3 2.6-4.7 1.1-1.4 2.5-2.5 4.1-3.2 1.6-.8 3.5-1.2 5.7-1.2 1.8 0 3.6.4 5.3 1.1 1.4.6 2.6 1.5 3.6 2.7.9 1.2 1.6 2.5 2 3.9.4 1.4.7 2.8.7 4.2 0 .8 0 1.5-.1 2.2-.1.7-.1 1.1-.2 1.4 0 .1-.1.2-.2.3-.1.1-.2.1-.3.1h-.2c-.3 0-.7 0-1.2.1-.6 0-1.2.1-2 .1zm-10.8-5h7.2c.9 0 1.5 0 2-.1.3 0 .5-.1.8-.2v-.3c0-.4-.1-.8-.2-1.2-.3-.9-.9-1.8-1.7-2.3-.8-.6-1.8-.8-2.8-.8-.9-.1-1.8.1-2.7.6-.8.5-1.4 1.1-1.9 2-.4.8-.6 1.6-.7 2.3z" fill="#9999FF"/>
  </svg>
);

export const PremiereIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg viewBox="0 0 83 80" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 0H67.5C75.6 0 82.1 6.5 82.1 14.5V65.5C82.1 73.5 75.6 80 67.5 80H14.5C6.5 80 0 73.5 0 65.5V14.5C0 6.5 6.5 0 14.5 0Z" fill="#00005B"/>
    <path d="M19.5 56.1V20.9c0-.2.1-.4.3-.4.6 0 1.1 0 1.9 0 .8 0 1.7 0 2.6 0 .9 0 1.9 0 3 0 1 0 2.1 0 3.1 0 2.8 0 5.1.3 7.1 1 1.7.6 3.3 1.6 4.6 2.9 1.1 1.1 1.9 2.4 2.5 3.9.5 1.4.8 2.9.8 4.4 0 2.9-.7 5.4-2.1 7.3-1.4 1.9-3.3 3.3-5.5 4.1-2.3.9-4.9 1.2-7.7 1.2-.8 0-1.4 0-1.7 0-.3 0-.8 0-1.5 0v11c0 .2-.2.4-.4.5h-6.5c-.3 0-.4-.1-.4-.4zm7.4-29v11.5c.5 0 .9 0 1.3 0H30c1.3 0 2.7-.2 3.9-.6 1.1-.3 2.1-1 2.8-1.8.7-.8 1.1-2 1.1-3.5 0-1.1-.3-2.1-.8-3-.6-.9-1.4-1.6-2.4-2-1.3-.5-2.6-.7-4-.7-.9 0-1.7 0-2.3 0-.6-.1-1.1-.1-1.4 0z" fill="#9999FF"/>
    <path d="M50.1 29.1H56.1c.3 0 .6.2.7.5.1.3.2.5.2.9.1.3.1.7.2 1 .0.4.1.8.1 1.2 1-1.2 2.3-2.2 3.7-2.9 1.6-.9 3.4-1.3 5.2-1.3.2 0 .5.2.5.4v6.7c0 .3-.2.4-.5.4-1.2 0-2.5.1-3.7.4-1 .2-1.9.5-2.9.9-.6.3-1.3.7-1.7 1.3V56c0 .3-.1.5-.5.5h-6.7c-.3 0-.5-.2-.5-.5V37.1c0-.8 0-1.7 0-2.6 0-.9 0-1.8-.1-2.7 0-.8-.1-1.5-.1-2.3 0-.2.1-.3.2-.4z" fill="#9999FF"/>
  </svg>
);

export const AdobeXDIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg viewBox="0 0 256 256" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <path fill="#470137" d="M16 0h224a16 16 0 0 1 16 16v224a16 16 0 0 1-16 16H16a16 16 0 0 1-16-16V16A16 16 0 0 1 16 0z"/>
    <path fill="#FF61F6" d="M72.5 88.5h26l18.8 36.5 22.9-36.5h25.2l-36.9 47.5 39 52h-26.3l-22.5-40-23 40H70l26.2-46.8zM174.5 88.5h24.8v56.2c0 11.8 7.2 16.2 16.5 16.2a21.4 21.4 0 0 0 13.2-5v18.5a38.4 38.4 0 0 1-19.2 5.2c-22.5 0-35.2-12.8-35.2-36.2z"/>
  </svg>
);

export const AuditionIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 256 256" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
        <rect width="256" height="256" rx="50" fill="#002b23"/>
        <path d="M78 88l30 80h-24l-6-18h-28l-6 18H20l30-80h28zm-14 44l-8-24-8 24h16z" fill="#00ffca"/>
        <path d="M138 128v40h22v-12a20 20 0 000-28v-12h-22zm22 28a10 10 0 010-16v16z" fill="#00ffca"/>
    </svg>
);

// --- DESIGN & OTHERS ---

export const FigmaIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg viewBox="0 0 54 80" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3 80c7.4 0 13.3-6 13.3-13.3V53.3H13.3C6 53.3 0 59.3 0 66.7S6 80 13.3 80z" fill="#0ACF83"/>
    <path d="M0 40c0-7.4 6-13.3 13.3-13.3h13.3v26.7H13.3C6 53.3 0 47.4 0 40z" fill="#A259FF"/>
    <path d="M0 13.3C0 6 6 0 13.3 0h13.3v26.7H13.3C6 26.7 0 20.7 0 13.3z" fill="#F24E1E"/>
    <path d="M26.7 0H40C47.4 0 53.3 6 53.3 13.3s-6 13.3-13.3 13.3H26.7V0z" fill="#FF7262"/>
    <path d="M53.3 40c0 7.4-6 13.3-13.3 13.3-7.4 0-13.3-6-13.3-13.3s6-13.3 13.3-13.3 13.3 6 13.3 13.3z" fill="#1ABCFE"/>
  </svg>
);

export const AffinityIcon: React.FC<IconProps> = ({ className, style }) => {
  const gradientId = useId();
  return (
    <svg viewBox="0 0 256 256" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" rx="55" fill="#134881"/>
      <path d="M128 48L64 192h32l16-40h64l16 40h32L160 48h-32zm16 40l24 64H88l24-64h32z" fill={`url(#${gradientId})`}/>
      <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6be1fb"/>
              <stop offset="100%" stopColor="#38bdfa"/>
          </linearGradient>
      </defs>
    </svg>
  );
};

export const AsepriteIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 16 16" className={className} style={style} xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
        <rect x="1" y="0" width="1" height="1" fill="#828282" />
        <rect x="2" y="0" width="12" height="1" fill="#655561" />
        <rect x="14" y="0" width="1" height="1" fill="#828282" />
        <rect x="0" y="1" width="1" height="1" fill="#828282" />
        <rect x="1" y="1" width="1" height="1" fill="#655561" />
        <rect x="2" y="1" width="12" height="1" fill="#e5e5e5" />
        <rect x="14" y="1" width="1" height="1" fill="#655561" />
        <rect x="15" y="1" width="1" height="1" fill="#828282" />
        <rect x="0" y="2" width="1" height="1" fill="#655561" />
        <rect x="1" y="2" width="14" height="1" fill="#e5e5e5" />
        <rect x="15" y="2" width="1" height="1" fill="#655561" />
        <rect x="0" y="3" width="1" height="1" fill="#655561" />
        <rect x="1" y="3" width="14" height="1" fill="#e5e5e5" />
        <rect x="15" y="3" width="1" height="1" fill="#655561" />
        <rect x="0" y="4" width="1" height="1" fill="#655561" />
        <rect x="1" y="4" width="4" height="1" fill="#e5e5e5" />
        <rect x="5" y="4" width="1" height="1" fill="#655561" />
        <rect x="6" y="4" width="4" height="1" fill="#e5e5e5" />
        <rect x="10" y="4" width="1" height="1" fill="#655561" />
        <rect x="11" y="4" width="4" height="1" fill="#e5e5e5" />
        <rect x="15" y="4" width="1" height="1" fill="#655561" />
        <rect x="0" y="5" width="1" height="1" fill="#655561" />
        <rect x="1" y="5" width="4" height="1" fill="#e5e5e5" />
        <rect x="5" y="5" width="1" height="1" fill="#655561" />
        <rect x="6" y="5" width="4" height="1" fill="#e5e5e5" />
        <rect x="10" y="5" width="1" height="1" fill="#655561" />
        <rect x="11" y="5" width="4" height="1" fill="#e5e5e5" />
        <rect x="15" y="5" width="1" height="1" fill="#655561" />
        <rect x="0" y="6" width="1" height="1" fill="#655561" />
        <rect x="1" y="6" width="4" height="1" fill="#e5e5e5" />
        <rect x="5" y="6" width="1" height="1" fill="#655561" />
        <rect x="6" y="6" width="4" height="1" fill="#e5e5e5" />
        <rect x="10" y="6" width="1" height="1" fill="#655561" />
        <rect x="11" y="6" width="4" height="1" fill="#e5e5e5" />
        <rect x="15" y="6" width="1" height="1" fill="#655561" />
        <rect x="0" y="7" width="1" height="1" fill="#655561" />
        <rect x="1" y="7" width="4" height="1" fill="#e5e5e5" />
        <rect x="5" y="7" width="1" height="1" fill="#655561" />
        <rect x="6" y="7" width="4" height="1" fill="#e5e5e5" />
        <rect x="10" y="7" width="1" height="1" fill="#655561" />
        <rect x="11" y="7" width="4" height="1" fill="#e5e5e5" />
        <rect x="15" y="7" width="1" height="1" fill="#655561" />
        <rect x="0" y="8" width="1" height="1" fill="#655561" />
        <rect x="1" y="8" width="4" height="1" fill="#e5e5e5" />
        <rect x="5" y="8" width="1" height="1" fill="#655561" />
        <rect x="6" y="8" width="4" height="1" fill="#e5e5e5" />
        <rect x="10" y="8" width="1" height="1" fill="#655561" />
        <rect x="11" y="8" width="4" height="1" fill="#e5e5e5" />
        <rect x="15" y="8" width="1" height="1" fill="#655561" />
        <rect x="0" y="9" width="1" height="1" fill="#655561" />
        <rect x="1" y="9" width="14" height="1" fill="#e5e5e5" />
        <rect x="15" y="9" width="1" height="1" fill="#655561" />
        <rect x="0" y="10" width="1" height="1" fill="#655561" />
        <rect x="1" y="10" width="14" height="1" fill="#e5e5e5" />
        <rect x="15" y="10" width="1" height="1" fill="#655561" />
        <rect x="0" y="11" width="1" height="1" fill="#655561" />
        <rect x="1" y="11" width="14" height="1" fill="#e5e5e5" />
        <rect x="15" y="11" width="1" height="1" fill="#655561" />
        <rect x="0" y="12" width="1" height="1" fill="#655561" />
        <rect x="1" y="12" width="1" height="1" fill="#7d929e" />
        <rect x="2" y="12" width="12" height="1" fill="#e5e5e5" />
        <rect x="14" y="12" width="1" height="1" fill="#7d929e" />
        <rect x="15" y="12" width="1" height="1" fill="#655561" />
        <rect x="0" y="13" width="1" height="1" fill="#655561" />
        <rect x="1" y="13" width="14" height="1" fill="#7d929e" />
        <rect x="15" y="13" width="1" height="1" fill="#655561" />
        <rect x="0" y="14" width="1" height="1" fill="#828282" />
        <rect x="1" y="14" width="1" height="1" fill="#655561" />
        <rect x="2" y="14" width="12" height="1" fill="#7d929e" />
        <rect x="14" y="14" width="1" height="1" fill="#655561" />
        <rect x="15" y="14" width="1" height="1" fill="#828282" />
        <rect x="1" y="15" width="1" height="1" fill="#828282" />
        <rect x="2" y="15" width="12" height="1" fill="#655561" />
        <rect x="14" y="15" width="1" height="1" fill="#828282" />
    </svg>
);

export const SubstancePainterIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 256 256" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
        <rect width="256" height="256" rx="50" fill="#7cb342"/>
        <circle cx="128" cy="128" r="80" fill="#fff"/>
        <path d="M128 78v100a50 50 0 000-100z" fill="#7cb342"/>
    </svg>
);

export const SubstanceDesignerIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg viewBox="0 0 256 256" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
        <rect width="256" height="256" rx="50" fill="#f15b22"/>
        <path d="M128 48l80 40-80 40-80-40 80-40z" fill="#fff"/>
        <path d="M48 108l80 40v80l-80-40v-80z" fill="#fff"/>
        <path d="M128 148l80-40v80l-80 40v-80z" fill="#fff"/>
    </svg>
);

