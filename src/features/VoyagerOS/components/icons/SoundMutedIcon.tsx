import React from 'react';
import { VolumeX } from 'lucide-react';

interface SoundMutedIconProps {
  size?: number;
  color?: string;
}

export const SoundMutedIcon: React.FC<SoundMutedIconProps> = ({ size = 20, color = 'currentColor' }) => {
  return <VolumeX size={size} color={color} strokeWidth={2.5} />;
};
