
import React from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { GenericIcon3D } from './core/GenericIcon3D';

const SVG_CONTENT = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 11.567343 15.03298">
  <g transform="translate(-115.93625,-150.07138)">
    <g transform="translate(-3.8788837,214.53487)">
      <g transform="matrix(0.04039667,0,0,0.04039667,81.604348,-55.892386)">
        <g transform="matrix(3.3451117,0,0,3.3451075,277.7359,1100.2048)">
          <path style="fill:#265787;" d="m 243.13,-333.715 c 0.106,-1.891 1.032,-3.557 2.429,-4.738 1.37,-1.16 3.214,-1.869 5.226,-1.869 2.01,0 3.854,0.709 5.225,1.869 1.396,1.181 2.322,2.847 2.429,4.736 0.106,1.943 -0.675,3.748 -2.045,5.086 -1.397,1.361 -3.384,2.215 -5.609,2.215 -2.225,0 -4.216,-0.854 -5.612,-2.215 -1.371,-1.338 -2.15,-3.143 -2.043,-5.084 z"/>
        </g>
        <g transform="matrix(3.3451117,0,0,3.3451075,277.7359,1100.2048)">
          <path style="fill:#e87d0d;" d="m 230.94,-329.894 c 0.106,-1.891 1.032,-3.557 2.429,-4.738 1.37,-1.16 3.214,-1.869 5.226,-1.869 2.01,0 3.854,0.709 5.225,1.869 1.396,1.181 2.322,2.847 2.429,4.736 0.106,1.943 -0.675,3.748 -2.045,5.086 -1.397,1.361 -3.384,2.215 -5.609,2.215 -2.225,0 -4.216,-0.854 -5.612,-2.215 -1.371,-1.338 -2.15,-3.143 -2.043,-5.084 z m 28.559,4.112 c -2.29,2.333 -5.496,3.656 -8.965,3.663 -3.474,0.006 -6.68,-1.305 -8.97,-3.634 -1.119,-1.135 -1.941,-2.441 -2.448,-3.832 -0.497,-1.367 -0.69,-2.818 -0.562,-4.282 0.121,-1.431 0.547,-2.796 1.227,-4.031 0.668,-1.214 1.588,-2.311 2.724,-3.239 2.226,-1.814 5.06,-2.796 8.024,-2.8 2.967,-0.004 5.799,0.969 8.027,2.777 1.134,0.924 2.053,2.017 2.721,3.229 0.683,1.234 1.106,2.594 1.232,4.029 0.126,1.462 -0.067,2.911 -0.564,4.279 -0.508,1.395 -1.327,2.701 -2.446,3.841 z"/>
        </g>
      </g>
    </g>
  </g>
</svg>`;

export const Blender3D: React.FC = () => {
    return (
        <GenericIcon3D
            config={{
                boxColor: '#262626',
                lightDir: new THREE.Vector3(0.3, 0.5, 1.0).normalize(),
                hatchingDensity: 12.0,
                hatchingStrength: 0.3,
                outlineWidth: 0.03
            }}
            onBuildContent={(contentGroup, getMat, outMat) => {
                // --- SVG LOADING LOGIC ---
                const loader = new SVGLoader();
                const svgData = loader.parse(SVG_CONTENT);
                const tempGroup = new THREE.Group();
                let maxShapeSize = 0;

                // 1. Calculate Bounds
                svgData.paths.forEach((path) => {
                    const shapes = SVGLoader.createShapes(path);
                    shapes.forEach(shape => {
                        shape.getPoints().forEach(p => {
                            if (Math.abs(p.x) > maxShapeSize) maxShapeSize = Math.abs(p.x);
                            if (Math.abs(p.y) > maxShapeSize) maxShapeSize = Math.abs(p.y);
                        });
                    });
                });

                const dynamicDepth = maxShapeSize * 0.1;
                const bevelThickness = dynamicDepth * 0.05;

                // 2. Extrude & Color
                svgData.paths.forEach((path) => {
                    const shapes = SVGLoader.createShapes(path);
                    const fillColor = path.userData.style.fill;
                    
                    let matColor = '#ea7600'; // Blender Orange
                    let isEye = false;
                    
                    if (fillColor && (String(fillColor).includes('265787'))) {
                        matColor = '#2361a0'; // Blender Blue
                        isEye = true;
                    }
                    
                    const material = getMat(matColor);

                    shapes.forEach((shape) => {
                        const geometry = new THREE.ExtrudeGeometry(shape, {
                            depth: dynamicDepth, 
                            bevelEnabled: true, 
                            bevelThickness, 
                            bevelSize: bevelThickness * 0.5, 
                            bevelSegments: 6, 
                            curveSegments: 48
                        });
                        
                        const mesh = new THREE.Mesh(geometry, material);
                        mesh.scale.y = -1; // Flip Y for SVG
                        
                        // Push the blue eye slightly forward
                        if (isEye) mesh.position.z = dynamicDepth * 0.1;
                        
                        // Add Outline
                        const outlineMesh = new THREE.Mesh(geometry, outMat.clone());
                        mesh.add(outlineMesh);
                        
                        tempGroup.add(mesh);
                    });
                });

                // 3. Center and Add to Scene
                const boxBounds = new THREE.Box3().setFromObject(tempGroup);
                const center = new THREE.Vector3();
                boxBounds.getCenter(center);
                const size = new THREE.Vector3();
                boxBounds.getSize(size);

                const logoGroup = new THREE.Group();
                // Move children to center
                for (let i = tempGroup.children.length - 1; i >= 0; i--) {
                    const child = tempGroup.children[i];
                    child.position.x -= center.x;
                    child.position.y -= center.y;
                    logoGroup.add(child);
                }

                // Scale to fit nicely in the box
                const scaleFactor = (2.5 * 0.65) / Math.max(size.x, size.y);
                logoGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
                logoGroup.position.z = 0.30; // Push forward from box face

                contentGroup.add(logoGroup);
            }}
        />
    );
};
