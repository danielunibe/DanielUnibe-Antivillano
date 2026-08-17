import React from 'react';
import { BatteryMedium } from 'lucide-react';

interface BatteryIconProps {
  size?: number;
  color?: string;
}

export const BatteryIcon: React.FC<BatteryIconProps> = ({ size = 20, color = 'currentColor' }) => {
  return <BatteryMedium size={size} color={color} strokeWidth={2.5} />;
};
