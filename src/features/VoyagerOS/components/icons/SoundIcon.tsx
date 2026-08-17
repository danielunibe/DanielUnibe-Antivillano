import React from 'react';
import { Volume2 } from 'lucide-react';

interface SoundIconProps {
  size?: number;
  color?: string;
}

export const SoundIcon: React.FC<SoundIconProps> = ({ size = 20, color = 'currentColor' }) => {
  return <Volume2 size={size} color={color} strokeWidth={2.5} />;
};
