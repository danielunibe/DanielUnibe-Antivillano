import React from 'react';

export const OverlayEffects: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[100] pointer-events-none select-none">
            {/* 1. Vignette: Oscurece las esquinas para centrar la atención */}
            <div 
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.4) 100%)'
                }}
            />

            {/* 2. Noise Overlay: Ruido estático muy sutil para textura */}
            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg_viewBox=%270_0_200_200%27_xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter_id=%27noiseFilter%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%270.8%27_numOctaves=%273%27_stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect_width=%27100%25%27_height=%27100%25%27_filter=%27url(%23noiseFilter)%27_opacity=%271%27/%3E%3C/svg%3E')] animate-grain pointer-events-none"></div>
        </div>
    );
};