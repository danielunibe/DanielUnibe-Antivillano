import React from 'react';
import { SectorNavButton, type SectorNavButtonProps } from './SectorNavButton';

export interface NorthButtonProps extends Omit<SectorNavButtonProps, 'sector'> {}

export const NorthButton: React.FC<NorthButtonProps> = (props) => {
    return <SectorNavButton sector="NORTH" {...props} />;
};

export { SectorNavButton };