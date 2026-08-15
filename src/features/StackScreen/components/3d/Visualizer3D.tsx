
import React, { useMemo, useState, useEffect } from 'react';
import { Blender3D } from './Blender3D'; // Custom Geometry Logic
import { Figma3D } from './Figma3D'; // Custom Constructed Geometry
import { Audition3D } from './Audition3D'; // Text Geometry Logic
import { StandardIcon3D, IconConfig } from './StandardIcon3D';
import { SVG_ASSETS } from './assets/IconAssets';

interface Visualizer3DProps {
    itemId: string;
}

export const Visualizer3D: React.FC<Visualizer3DProps> = React.memo(({ itemId }) => {
    // State to track the ID that is currently allowed to be rendered.
    // If renderedId is null or doesn't match itemId, we show the placeholder.
    const [renderedId, setRenderedId] = useState<string | null>(null);

    useEffect(() => {
        // 1. AGGRESSIVE UNMOUNT
        // Immediately clear the current 3D view when the prop changes.
        // This forces React to unmount the previous 3D component, triggering its 
        // cleanup (renderer.dispose(), geometry.dispose()) BEFORE starting the new timer.
        setRenderedId(null);

        // 2. EXTENDED DEBOUNCE
        // We wait 450ms. If the user moves the mouse again within this window,
        // this timer is cleared and the component never mounts.
        // This prevents creating heavy WebGL contexts during rapid hovering.
        const timer = setTimeout(() => {
            setRenderedId(itemId);
        }, 450);

        return () => clearTimeout(timer);
    }, [itemId]);

    // Compute config only for the item we are ABOUT to render
    const standardConfig = useMemo((): { svg: string, config: IconConfig } | null => {
        // Use renderedId here to prevent calculation for items we skipped
        const targetId = renderedId; 
        if (!targetId) return null;

        switch (targetId) {
            case 'ps': return {
                svg: SVG_ASSETS.PHOTOSHOP,
                config: { boxColor: '#001e36', shadowColor: '#001020', logoColor: '#31a8ff', boxColorRef: '#001e36' }
            };
            case 'xd': return { 
                svg: SVG_ASSETS.ADOBE_XD, 
                config: { boxColor: '#2e001f', shadowColor: '#1a0011', logoColor: '#ff2bc2', boxColorRef: '#470137' } 
            };
            case 'ae': return { 
                svg: SVG_ASSETS.AFTER_EFFECTS, 
                config: { boxColor: '#000045', shadowColor: '#000020', logoColor: '#cf8aff', boxColorRef: '#00005b' } 
            };
            case 'prem':
            case 'premiere': return { 
                svg: SVG_ASSETS.PREMIERE, 
                config: { boxColor: '#000045', shadowColor: '#000020', logoColor: '#d896ff', boxColorRef: '#00005b' } 
            };
            case 'ai': return { 
                svg: SVG_ASSETS.ILLUSTRATOR, 
                config: { boxColor: '#330000', shadowColor: '#1a0000', logoColor: '#ff9a00', boxColorRef: '#330000' } 
            };
            case 'sub-pt':
            case 'sub_painter': return { 
                svg: SVG_ASSETS.SUBSTANCE_PAINTER, 
                config: { 
                    boxColor: '#60912f', shadowColor: '#304a18', logoColor: '#ffffff', accentColor: '#60912f', 
                    boxColorRef: '#7cb342', accentColorRef: '#7cb342' 
                } 
            };
            case 'sub-ds':
            case 'sub_designer': return { 
                svg: SVG_ASSETS.SUBSTANCE_DESIGNER, 
                config: { boxColor: '#c44214', shadowColor: '#63210a', logoColor: '#ffffff', boxColorRef: '#f15b22' } 
            };
            case 'powershell': return { 
                svg: SVG_ASSETS.POWERSHELL, 
                config: { 
                    boxColor: '#012456', shadowColor: '#000810', logoColor: '#3d5c85', accentColor: '#a9c8ff', 
                    isVectorLike: true, outlineWidth: 0.02, logoScale: 0.0055 
                } 
            };
            case 'affinity': return { 
                svg: SVG_ASSETS.AFFINITY, 
                config: { 
                    boxColor: '#a7f175', shadowColor: '#5e8c3d', logoColor: '#1f2e15', 
                    isVectorLike: true, outlineWidth: 0.02, logoScale: 0.0055, depth: 20 
                } 
            };
            case 'id': return {
                svg: SVG_ASSETS.INDESIGN,
                config: { boxColor: '#49021f', shadowColor: '#2a0010', logoColor: '#ff3366', boxColorRef: '#49021f' }
            };
            default: return null;
        }
    }, [renderedId]);

    // LOADING / WAITING STATE
    if (renderedId !== itemId) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center animate-pulse">
                <div className="w-16 h-16 border-2 border-t-[#F2D019] border-r-transparent border-b-[#F2D019] border-l-transparent rounded-full animate-spin opacity-50 mb-4" />
                <span className="font-mono text-[10px] text-[#F2D019] tracking-widest">INITIALIZING 3D ASSET...</span>
            </div>
        );
    }

    // RENDER LOGIC
    // We use a key here to ensure React treats different items as completely different component trees,
    // forcing a full teardown/setup cycle for the 3D context.
    const componentKey = `viz-${renderedId}`;

    if (standardConfig) {
        return <StandardIcon3D key={componentKey} svgContent={standardConfig.svg} config={standardConfig.config} />;
    }

    switch (renderedId) {
        case 'blender': return <Blender3D key={componentKey} />;
        case 'figma': return <Figma3D key={componentKey} />;
        case 'audition': return <Audition3D key={componentKey} />;
        default: return (
            <div className="w-full h-full flex items-center justify-center opacity-30">
                <span className="font-mono text-xs">NO 3D MODEL</span>
            </div>
        ); 
    }
});
