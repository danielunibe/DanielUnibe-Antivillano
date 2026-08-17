import React from 'react';
import { Wifi } from 'lucide-react';

interface WifiIconProps {
  size?: number;
  color?: string;
}

export const WifiIcon: React.FC<WifiIconProps> = ({ size = 20, color = 'currentColor' }) => {
  return <Wifi size={size} color={color} strokeWidth={2.5} />;
};
