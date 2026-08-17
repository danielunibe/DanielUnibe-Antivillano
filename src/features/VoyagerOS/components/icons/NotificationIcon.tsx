import React from 'react';

interface NotificationIconProps {
  size?: number;
  color?: string;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ size = 26, color = '#ffffff' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-200"
    >
      {/* Bell body */}
      <path 
        d="M12 2.5C8.41 2.5 5.5 5.41 5.5 9v4.2l-1.6 2.8a1 1 0 0 0 .87 1.5h14.46a1 1 0 0 0 .87-1.5L18.5 13.2V9c0-3.59-2.91-6.5-6.5-6.5Z" 
        stroke={color} 
        strokeWidth="2.1" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Clapper / bell bottom */}
      <path 
        d="M9.5 18a2.5 2.5 0 0 0 5 0" 
        stroke={color} 
        strokeWidth="2.1" 
        strokeLinecap="round" 
      />
    </svg>
  );
};
