import React from 'react';
import App from './App';
import type { Project } from '../ProjectsScreen/types';

export const VoyagerOS: React.FC<{ activeProject?: Project }> = ({ activeProject }) => {
    return <App activeProject={activeProject} />;
};

export default VoyagerOS;
