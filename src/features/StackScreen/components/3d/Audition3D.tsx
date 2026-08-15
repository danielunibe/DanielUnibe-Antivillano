
import React from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { GenericIcon3D } from './core/GenericIcon3D';

export const Audition3D: React.FC = () => {
    return (
        <GenericIcon3D
            config={{
                boxColor: '#00e4bd',
                lightDir: new THREE.Vector3(0.8, 0.8, 1.0).normalize(),
                outlineWidth: 0.03
            }}
            onBuildContent={(contentGroup, getMat, outMat) => {
                const loader = new FontLoader();
                
                // Using helper function logic from GenericIcon3D structure implicitly via closure
                loader.load('/assets/fonts/helvetiker_bold.typeface.json', function (font) {
                    const textGeo = new TextGeometry('Au', { 
                        font: font, 
                        size: 1.2, 
                        height: 0.1, 
                        curveSegments: 8, 
                        bevelEnabled: true, 
                        bevelThickness: 0.05, 
                        bevelSize: 0.03, 
                        bevelOffset: 0, 
                        bevelSegments: 5 
                    });
                    
                    textGeo.center();
                    
                    const smoothTextGeo = BufferGeometryUtils.mergeVertices(textGeo, 0.001);
                    smoothTextGeo.computeVertexNormals();
                    
                    const textMesh = new THREE.Mesh(textGeo, getMat('#002e26'));
                    textMesh.position.z = 0.3; 
                    textMesh.position.y = 0.1;
                    
                    const textOutline = new THREE.Mesh(smoothTextGeo, outMat.clone());
                    // @ts-ignore
                    textOutline.material.uniforms.uT.value = 0.03 * 0.5;
                    textMesh.add(textOutline);
                    
                    contentGroup.add(textMesh);
                });
            }}
        />
    );
};
