import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createMangaMaterial, createOutlineMaterial } from './SharedMangaMaterial';

export interface GenericIconConfig {
  boxColor: string;
  shadowColor?: string;
  outlineColor?: string;
  outlineWidth?: number;
  lightDir?: THREE.Vector3;
  hatchingDensity?: number;
  hatchingStrength?: number;
  shadowLimit?: number;
  specularLimit?: number;
  spinSpeed?: number;
  floatSpeed?: number;
  floatAmp?: number;
  springStiffness?: number;
  springDamping?: number;
  interactive?: boolean;
}

interface GenericIcon3DProps {
  config: GenericIconConfig;
  onBuildContent: (contentGroup: THREE.Group, materialFactory: (color: string) => THREE.ShaderMaterial, outlineMaterial: THREE.ShaderMaterial) => void | Promise<void>;
}

export const GenericIcon3D: React.FC<GenericIcon3DProps> = ({ config, onBuildContent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    let contextLost = false;
    let disposed = false;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cfg = {
      outlineColor: '#000000', outlineWidth: 0.035, lightDir: new THREE.Vector3(0.5, 0.5, 1.2).normalize(),
      hatchingDensity: 14, hatchingStrength: 0.1, shadowLimit: 0.4, specularLimit: 0.7,
      spinSpeed: 0.1, floatSpeed: 0.002, floatAmp: 0.1, springStiffness: 0.12, springDamping: 0.82, interactive: true,
      ...config
    };

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      setIsLoading(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    const floatGroup = new THREE.Group();
    const bounceGroup = new THREE.Group();
    const spinGroup = new THREE.Group();
    const iconMeshGroup = new THREE.Group();
    scene.add(floatGroup);
    floatGroup.add(bounceGroup);
    bounceGroup.add(spinGroup);
    spinGroup.add(iconMeshGroup);

    const materialCache = new Map<string, THREE.ShaderMaterial>();
    const getMat = (color: string) => {
      if (!materialCache.has(color)) {
        materialCache.set(color, createMangaMaterial({ color, lightDir: cfg.lightDir, hatchingDensity: cfg.hatchingDensity, hatchingStrength: cfg.hatchingStrength, shadowLimit: cfg.shadowLimit, specularLimit: cfg.specularLimit }));
      }
      return materialCache.get(color)!;
    };

    const outMat = createOutlineMaterial(cfg.outlineColor, cfg.outlineWidth);
    const boxGeo = new RoundedBoxGeometry(2.5, 2.5, 0.5, 8, 0.4);
    const boxMesh = new THREE.Mesh(boxGeo, getMat(config.boxColor));
    boxMesh.add(new THREE.Mesh(boxGeo, outMat));
    iconMeshGroup.add(boxMesh);

    const disposeIconTree = () => {
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      iconMeshGroup.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        if (object.geometry) geometries.add(object.geometry);
        const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
        objectMaterials.forEach((material) => material && materials.add(material));
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
    };

    Promise.resolve(onBuildContent(iconMeshGroup, getMat, outMat)).then(() => {
      if (disposed) disposeIconTree();
      else setIsLoading(false);
    });

    let time = 0;
    let animationId = 0;
    let currentScale = 1;
    let scaleVel = 0;
    let isDragging = false;
    let targetRotX = 0;
    let targetRotY = 0;
    let lastSpinTime = 0;
    let targetSpinY = 0;
    let currentSpinY = 0;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);
    const checkIntersection = () => {
      raycaster.setFromCamera(mouse, camera);
      return raycaster.intersectObject(boxMesh).length > 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (isDragging && cfg.interactive) {
        targetRotY = mouse.x * 0.8;
        targetRotX = -mouse.y * 0.8;
      }
    };

    const handleMouseDown = () => {
      if (!cfg.interactive || !checkIntersection()) return;
      isDragging = true;
      currentScale = 0.85;
      document.body.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.body.style.cursor = 'default';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const animate = () => {
      if (!reduceMotion) animationId = requestAnimationFrame(animate);
      if (contextLost) return;
      time += 1;
      if (!isDragging && cfg.interactive && checkIntersection()) {
        const now = Date.now();
        if (now - lastSpinTime > 3000) {
          targetSpinY += Math.PI * 2;
          lastSpinTime = now;
        }
      }

      currentSpinY += (targetSpinY - currentSpinY) * cfg.spinSpeed;
      spinGroup.rotation.y = currentSpinY;
      iconMeshGroup.rotation.x += ((isDragging ? targetRotX : 0) - iconMeshGroup.rotation.x) * (isDragging ? 0.2 : 0.1);
      iconMeshGroup.rotation.y += ((isDragging ? targetRotY : 0) - iconMeshGroup.rotation.y) * (isDragging ? 0.2 : 0.1);

      scaleVel += (1 - currentScale) * cfg.springStiffness;
      scaleVel *= cfg.springDamping;
      currentScale += scaleVel;
      bounceGroup.scale.set(currentScale, currentScale, currentScale);
      floatGroup.position.y = Math.sin(time * cfg.floatSpeed) * cfg.floatAmp;

      try {
        renderer.render(scene, camera);
      } catch {
        contextLost = true;
      }
    };
    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || disposed) return;
      const nextWidth = Math.max(1, entry.contentRect.width);
      const nextHeight = Math.max(1, entry.contentRect.height);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight, false);
      if (reduceMotion) renderer.render(scene, camera);
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationId);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      if (containerRef.current && renderer.domElement) containerRef.current.removeChild(renderer.domElement);
      disposeIconTree();
      renderer.dispose();
    };
  }, [config, onBuildContent]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {isLoading && <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50"><div className="w-8 h-8 border-2 border-t-white border-transparent rounded-full animate-spin" /></div>}
    </div>
  );
};
