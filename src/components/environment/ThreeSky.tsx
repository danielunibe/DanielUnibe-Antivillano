import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ASSETS } from '../../config/assets';
import { Ticker } from '../../utils/GlobalTicker';

interface ThreeSkyProps {
    scrollRef: React.MutableRefObject<number>;
}

export const ThreeSky: React.FC<ThreeSkyProps> = React.memo(({ scrollRef }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const webglFailedRef = useRef(false);
    const skyGradient = 'linear-gradient(180deg, #3aa3dd -24%, #8fc7dc 38%, #e8c48a 78%, #f2d5a4 100%)';
    // Keep clouds mostly in the visible portion of the sky gradient.
    const CLOUD_Y_OFFSET = 30;

    useEffect(() => {
        if (!containerRef.current) return;
        if (webglFailedRef.current) return;
        let contextLost = false;
        let tickCallback: (() => void) | null = null;
        let tickFrame = 0;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // --- SETUP ---
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        const scene = new THREE.Scene();
        
        // Orthographic camera for pixel-perfect 2D control in 3D space
        const frustumSize = 1000;
        const aspect = w / h;
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            1,
            2000
        );
        camera.position.z = 1000;

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: false,
                powerPreference: 'high-performance',
                depth: false,
                stencil: false
            });
        } catch (error) {
            webglFailedRef.current = true;
            console.warn('ThreeSky disabled: WebGL init failed.', error);
            return;
        }
        
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.inset = '0';
        renderer.domElement.style.pointerEvents = 'none';
        containerRef.current.insertBefore(renderer.domElement, containerRef.current.firstChild);

        const handleContextLost = (event: Event) => {
            event.preventDefault();
            contextLost = true;
            if (tickCallback) Ticker.remove(tickCallback);
        };
        renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

        // --- CLOUD CONFIGURATION ---
        const CLOUD_COUNT = 9;
        const dummy = new THREE.Object3D();
        const geometry = new THREE.PlaneGeometry(320, 168);
        
        const loader = new THREE.TextureLoader();
        const texture1 = loader.load(ASSETS.CLOUDS[0]);
        const texture2 = loader.load(ASSETS.CLOUDS[1]);

        // Increased opacity from 0.45 to 0.8 to ensure clouds are clearly visible
        const material1 = new THREE.MeshBasicMaterial({
            map: texture1,
            transparent: true,
            color: 0xffffff,
            opacity: 0.8,
            depthWrite: false,
        });

        const material2 = new THREE.MeshBasicMaterial({
            map: texture2,
            transparent: true,
            color: 0xffffff,
            opacity: 0.8,
            depthWrite: false,
        });

        // Split instances between the two textures (5 for texture1, 4 for texture2)
        const mesh1 = new THREE.InstancedMesh(geometry, material1, 5);
        mesh1.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(mesh1);

        const mesh2 = new THREE.InstancedMesh(geometry, material2, 4);
        mesh2.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(mesh2);

        // --- INITIALIZE CLOUD DATA ---
        const cloudData: { x: number; y: number; z: number; scale: number; speed: number; parallax: number; opacity: number }[] = [];

        const getSceneWidth = () => 1000 * (containerRef.current?.clientWidth || 1000) / (containerRef.current?.clientHeight || 1000);

        for (let i = 0; i < CLOUD_COUNT; i++) {
            const sceneW = getSceneWidth();
            const rangeX = sceneW * 3.5;
            
            // Layers: 0 (Back/Small), 1 (Mid/Center), 2 (Front/Larger)
            const layer = i % 3;
            
            let z = 0, speed = 0, parallax = 0, opacity = 1, scale = 1, y = 0;

            if (layer === 0) {
                // Background Layer
                z = -200; 
                y = (Math.random() * 120) + 120 + CLOUD_Y_OFFSET;
                scale = (1.0 + Math.random() * 0.5) * 1.15; // 15% larger
                opacity = 0.85;
                speed = 0.14; 
                parallax = 0.04;
            } else if (layer === 1) {
                // Mid Layer (Center of the sky vertically) - boosted scale extra 15%
                z = -50; 
                y = (Math.random() * 100) + 60 + CLOUD_Y_OFFSET;
                scale = (0.8 + Math.random() * 0.45) * 1.30; // 15% + extra 15% = 30% larger to make them stand out in the center
                opacity = 0.9;
                speed = 0.24; 
                parallax = 0.15;
            } else {
                // Front Layer
                z = 100; 
                y = (Math.random() * 80) + 20 + CLOUD_Y_OFFSET;
                scale = (0.65 + Math.random() * 0.35) * 1.15; // 15% larger
                opacity = 0.95;
                speed = 0.42; 
                parallax = 0.3;
            }

            cloudData.push({
                x: (Math.random() * rangeX) - (rangeX / 2),
                y, z, scale, speed, parallax, opacity
            });
        }

        // --- ANIMATION LOOP (SYNCED) ---
        const tick = () => {
            if (!containerRef.current || contextLost) return;
            tickFrame++;
            if (tickFrame % 2 !== 0) return;

            const currentW = containerRef.current.clientWidth;
            const currentH = containerRef.current.clientHeight || 1;
            const currentAspect = currentW / currentH;
            const sceneVisibleWidth = 1000 * currentAspect;
            const pixelToUnitRatio = sceneVisibleWidth / (currentW || 1);
            const respawnLimit = sceneVisibleWidth * 2.0;
            const scrollX = scrollRef.current;

            let idx1 = 0;
            let idx2 = 0;

            for (let i = 0; i < CLOUD_COUNT; i++) {
                const data = cloudData[i];
                
                // 1. Move constantly (Wind)
                data.x -= data.speed;

                // 2. Parallax Calculation
                const parallaxOffset = (scrollX - window.innerWidth) * pixelToUnitRatio * data.parallax;
                let displayX = data.x - parallaxOffset;

                // 3. Wrapping Logic
                if (displayX < -respawnLimit) {
                    data.x += (respawnLimit * 2);
                    displayX = data.x - parallaxOffset;
                } else if (displayX > respawnLimit) {
                    data.x -= (respawnLimit * 2);
                    displayX = data.x - parallaxOffset;
                }

                // 4. Update Matrix
                dummy.position.set(displayX, data.y, data.z);
                dummy.scale.set(data.scale, data.scale, 1);
                dummy.updateMatrix();

                if (i % 2 === 0) {
                    mesh1.setMatrixAt(idx1, dummy.matrix);
                    idx1++;
                } else {
                    mesh2.setMatrixAt(idx2, dummy.matrix);
                    idx2++;
                }
            }

            mesh1.instanceMatrix.needsUpdate = true;
            mesh2.instanceMatrix.needsUpdate = true;
            renderer.render(scene, camera);
        };

        // Subscribe to Global Ticker
        tickCallback = tick;
        tick();
        if (!reduceMotion) Ticker.add(tick);

        // --- RESIZE HANDLER ---
        const handleResize = () => {
            if (!containerRef.current) return;
            const newW = containerRef.current.clientWidth;
            const newH = containerRef.current.clientHeight;
            const newAspect = newW / newH;
            camera.left = -frustumSize * newAspect / 2;
            camera.right = frustumSize * newAspect / 2;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (!reduceMotion) Ticker.remove(tick);
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            // Memory Cleanup
            geometry.dispose();
            material1.dispose();
            material2.dispose();
            texture1.dispose();
            texture2.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className="w-full h-full relative overflow-hidden" 
            style={{ 
                background: skyGradient, 
                zIndex: 0 
            }}
        >
            <div className="sky-haze-cloud sky-haze-cloud-a absolute pointer-events-none" aria-hidden="true" />
            <div className="sky-haze-cloud sky-haze-cloud-b absolute pointer-events-none" aria-hidden="true" />
            <div className="sky-haze-cloud sky-haze-cloud-c absolute pointer-events-none" aria-hidden="true" />
            <div
                className="absolute inset-x-0 bottom-0 h-[42vh] pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgba(242,213,164,0) 0%, rgba(230,190,132,0.22) 34%, rgba(218,184,132,0.52) 72%, rgba(235,210,175,0.72) 100%)',
                    zIndex: 0
                }}
            />
            <div 
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 74%, rgba(255,236,192,0.2), transparent 32%), linear-gradient(to bottom, transparent 0%, rgba(210, 225, 225, 0) 48%, rgba(229, 200, 154, 0.2) 78%, rgba(240, 218, 184, 0.52) 100%)',
                    zIndex: 0
                }}
            />
        </div>
    );
});
