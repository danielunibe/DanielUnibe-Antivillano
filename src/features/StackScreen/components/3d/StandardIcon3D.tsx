
import React from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { GenericIcon3D, GenericIconConfig } from './core/GenericIcon3D';

export interface IconConfig extends GenericIconConfig {
    logoColor: string;
    accentColor?: string;
    logoColorRef?: string;
    accentColorRef?: string;
    boxColorRef?: string; // Color to ignore in SVG (bg rect)
    
    isVectorLike?: boolean; // Unused in new logic but kept for interface compat
    logoScale?: number;
    depth?: number;
}

interface StandardIcon3DProps {
    svgContent: string;
    config: IconConfig;
}

export const StandardIcon3D: React.FC<StandardIcon3DProps> = ({ svgContent, config }) => {
    return (
        <GenericIcon3D
            config={config}
            onBuildContent={(contentGroup, getMat, outMat) => {
                const loader = new SVGLoader();
                const svgData = loader.parse(svgContent);
                const logoGroup = new THREE.Group();
                
                // 1. Calculate Bounds for Centering
                let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                svgData.paths.forEach((path) => {
                    const shapes = SVGLoader.createShapes(path);
                    shapes.forEach(shape => {
                       shape.getPoints().forEach(p => {
                           if(p.x < minX) minX = p.x; if(p.x > maxX) maxX = p.x;
                           if(p.y < minY) minY = p.y; if(p.y > maxY) maxY = p.y;
                       });
                    });
                });

                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;
                const scale = config.logoScale || 0.012; 

                // 2. Group Geometries by Color to optimize Draw Calls
                const geometriesByColor: Record<string, THREE.BufferGeometry[]> = {};

                svgData.paths.forEach((path) => {
                     const shapes = SVGLoader.createShapes(path);
                     const fillColor = path.userData.style.fill;
                     
                     let useColor = config.logoColor;
                     
                     // Filter out Background Boxes (the big square rects in icons)
                     if (config.boxColorRef && fillColor && fillColor.toLowerCase() === config.boxColorRef.toLowerCase()) return;
                     if (fillColor && (fillColor.toLowerCase() === '#001e36' || fillColor.toLowerCase() === '#330000')) return;

                     // Determine Color (Main or Accent)
                     if (config.accentColor && config.accentColorRef && fillColor && fillColor.toLowerCase() === config.accentColorRef.toLowerCase()) {
                         useColor = config.accentColor;
                     }
                     
                     if (!geometriesByColor[useColor]) {
                         geometriesByColor[useColor] = [];
                     }

                     shapes.forEach((shape) => {
                         const depth = config.depth || 15;
                         const geometry = new THREE.ExtrudeGeometry(shape, { 
                             depth, 
                             bevelEnabled: true, 
                             bevelThickness: 2, 
                             bevelSize: 1, 
                             bevelSegments: 3 
                         });
                         
                         // Pre-Apply Transforms (Scale & Center)
                         geometry.scale(scale, -scale, scale);
                         geometry.translate(-centerX * scale, centerY * scale, 0);
                         
                         geometriesByColor[useColor].push(geometry);
                     });
                });

                // 3. Merge & Create Meshes
                Object.keys(geometriesByColor).forEach(colorKey => {
                    const geometries = geometriesByColor[colorKey];
                    if (geometries.length === 0) return;

                    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
                    geometries.forEach(g => g.dispose()); // Cleanup

                    if (mergedGeometry) {
                        mergedGeometry.computeVertexNormals(); 

                        const mesh = new THREE.Mesh(mergedGeometry, getMat(colorKey));
                        
                        const outlineMesh = new THREE.Mesh(mergedGeometry, outMat.clone());
                        // @ts-ignore
                        outlineMesh.material.uniforms.uT.value = (config.outlineWidth || 0.035) * 0.3;
                        mesh.add(outlineMesh);

                        logoGroup.add(mesh);
                    }
                });

                // 4. Final Centering Adjustment
                const bbox = new THREE.Box3().setFromObject(logoGroup);
                const center = new THREE.Vector3();
                bbox.getCenter(center);
                logoGroup.position.sub(center);
                logoGroup.position.z += 0.2; // Push slightly forward from center

                // 5. Apply Global Scale to fit the generic box
                logoGroup.scale.setScalar(1.5);

                contentGroup.add(logoGroup);
            }}
        />
    );
};
