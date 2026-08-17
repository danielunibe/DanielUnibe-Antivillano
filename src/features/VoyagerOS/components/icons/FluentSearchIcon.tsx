import React from 'react';

interface FluentSearchIconProps {
  size?: number;
  color?: string;
}

export const FluentSearchIcon: React.FC<FluentSearchIconProps> = ({ size = 26, color = 'white' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="transition-transform duration-200"
    >
      {/* Search glass lens circle */}
      <circle 
        cx="10.5" 
        cy="10.5" 
        r="6.5" 
        stroke={color} 
        strokeWidth="2.4" 
        strokeLinecap="round"
      />
      {/* Search lens specular inner shine */}
      <path
        d="M8 7.5a4 4 0 0 1 4-1"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Modern Search handle */}
      <line 
        x1="15.5" 
        y1="15.5" 
        x2="21" 
        y2="21" 
        stroke={color} 
        strokeWidth="2.6" 
        strokeLinecap="round" 
      />
    </svg>
  );
};
