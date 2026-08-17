import React from 'react';
import { Bluetooth } from 'lucide-react';

interface BluetoothIconProps {
  size?: number;
  color?: string;
}

export const BluetoothIcon: React.FC<BluetoothIconProps> = ({ size = 20, color = 'currentColor' }) => {
  return <Bluetooth size={size} color={color} strokeWidth={2.5} />;
};
