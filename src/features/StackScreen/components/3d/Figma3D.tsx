
import React from 'react';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { GenericIcon3D } from './core/GenericIcon3D';

export const Figma3D: React.FC = () => {
    return (
        <GenericIcon3D
            config={{
                boxColor: '#1e1e1e',
                outlineWidth: 0.04,
                lightDir: new THREE.Vector3(1.0, 1.0, 1.0).normalize(),
                hatchingDensity: 10.0,
                hatchingStrength: 0.2
            }}
            onBuildContent={(contentGroup, getMat, outMat) => {
                const figmaGroup = new THREE.Group();
                
                const s = 0.5; 
                const cellRadius = s / 2; 
                const extrudeSettings = { 
                    depth: 0.15, 
                    bevelEnabled: true, 
                    bevelThickness: 0.015, 
                    bevelSize: 0.01, 
                    bevelSegments: 3, 
                    curveSegments: 64 
                };

                const colors = {
                    red: '#F24E1E', 
                    orange: '#FF7262', 
                    purple: '#A259FF', 
                    blue: '#1ABCFE', 
                    green: '#0ACF83'
                };

                function createPart(type: string, color: string, x: number, y: number) {
                    const shape = new THREE.Shape();
                    if (type === 'circle') shape.absarc(0, 0, cellRadius, 0, Math.PI * 2, false);
                    else if (type === 'semicircle-left') { 
                        shape.moveTo(0, -cellRadius); 
                        shape.lineTo(cellRadius, -cellRadius); 
                        shape.lineTo(cellRadius, cellRadius); 
                        shape.absarc(0, 0, cellRadius, Math.PI/2, Math.PI * 1.5, false); 
                    }
                    else if (type === 'semicircle-right') { 
                        shape.moveTo(0, cellRadius); 
                        shape.lineTo(-cellRadius, cellRadius); 
                        shape.lineTo(-cellRadius, -cellRadius); 
                        shape.absarc(0, 0, cellRadius, -Math.PI/2, Math.PI/2, false); 
                    }
                    else if (type === 'teardrop-figma') { 
                        shape.moveTo(cellRadius, 0); 
                        shape.lineTo(cellRadius, cellRadius); 
                        shape.lineTo(0, cellRadius); 
                        shape.absarc(0, 0, cellRadius, Math.PI/2, Math.PI*2, false); 
                    }

                    const sharpGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                    const mesh = new THREE.Mesh(sharpGeo, getMat(color));
                    mesh.position.set(x, y, 0.3);
                    
                    // Create smoother outline
                    let outlineGeo = sharpGeo.clone();
                    outlineGeo = BufferGeometryUtils.mergeVertices(outlineGeo, 0.001);
                    outlineGeo.computeVertexNormals();
                    
                    const outlineMesh = new THREE.Mesh(outlineGeo, outMat.clone());
                    // @ts-ignore
                    outlineMesh.material.uniforms.uT.value = 0.04 * 0.5; // Thinner outline for internal parts
                    outlineMesh.renderOrder = -1;
                    mesh.add(outlineMesh);
                    
                    return mesh;
                }

                const xL = -s/2; 
                const xR = s/2; 
                const yTop = s; 
                const yMid = 0; 
                const yBot = -s; 

                figmaGroup.add(createPart('semicircle-left', colors.red, xL, yTop));
                figmaGroup.add(createPart('semicircle-right', colors.orange, xR, yTop));
                figmaGroup.add(createPart('semicircle-left', colors.purple, xL, yMid));
                figmaGroup.add(createPart('circle', colors.blue, xR, yMid));
                figmaGroup.add(createPart('teardrop-figma', colors.green, xL, yBot));

                contentGroup.add(figmaGroup);
            }}
        />
    );
};
