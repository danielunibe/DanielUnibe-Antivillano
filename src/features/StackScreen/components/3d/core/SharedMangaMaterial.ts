
import * as THREE from 'three';

// --- MANGA / ANIME SHADER DEFINITIONS ---

export const MANGA_VERTEX_SHADER = `
    varying vec3 vN; 
    varying vec3 vV; 
    varying vec4 vWorldPos;
    
    void main() {
        vN = normalize(normalMatrix * normal);
        vec4 mvP = modelViewMatrix * vec4(position, 1.0);
        vV = -mvP.xyz;
        vWorldPos = modelMatrix * vec4(position, 1.0); 
        gl_Position = projectionMatrix * mvP;
    }
`;

export const MANGA_FRAGMENT_SHADER = `
    uniform vec3 uCol; 
    uniform vec3 uLDir; 
    uniform float uHatchD; 
    uniform float uHatchS;
    uniform float uShadowL; 
    uniform float uSpecL;
    
    varying vec3 vN; 
    varying vec3 vV; 
    varying vec4 vWorldPos;
    
    void main() {
        vec3 n = normalize(vN); 
        if (!gl_FrontFacing) n = -n;
        
        vec3 l = normalize(uLDir); 
        vec3 v = normalize(vV);
        
        float NdotL = (dot(n, l) + 1.0) * 0.5; // Half-Lambert
        
        // Hard cut shadow
        float shadowMask = smoothstep(uShadowL - 0.05, uShadowL + 0.05, NdotL);
        
        vec3 baseColor = mix(uCol * 0.5, uCol, shadowMask);
        
        // Hatching Effect
        float hatch = sin((vWorldPos.x + vWorldPos.y) * uHatchD);
        hatch = step(0.0, hatch);
        float hatchEffect = mix(1.0 - (uHatchS * hatch), 1.0, shadowMask);
        
        vec3 shadedColor = baseColor * hatchEffect;
        
        // Specular
        float specRaw = pow(max(0.0, dot(n, normalize(l + v))), 40.0);
        float spec = step(uSpecL, specRaw);
        
        // Rim Light
        float rim = step(0.65, 1.0 - dot(v, n)) * 0.5;
        
        // Final Mix
        gl_FragColor = vec4(shadedColor + (vec3(0.8) * spec) + (vec3(0.5, 0.8, 1.0) * rim), 1.0);
    }
`;

// Helper to create the ShaderMaterial with default config
export interface MangaMaterialConfig {
    color: string;
    lightDir?: THREE.Vector3;
    hatchingDensity?: number;
    hatchingStrength?: number;
    shadowLimit?: number;
    specularLimit?: number;
}

export const createMangaMaterial = (config: MangaMaterialConfig) => {
    return new THREE.ShaderMaterial({
        uniforms: {
            uCol: { value: new THREE.Color(config.color) },
            uLDir: { value: config.lightDir || new THREE.Vector3(0.5, 0.5, 1.0).normalize() },
            uHatchD: { value: config.hatchingDensity ?? 14.0 },
            uHatchS: { value: config.hatchingStrength ?? 0.1 },
            uShadowL: { value: config.shadowLimit ?? 0.4 },
            uSpecL: { value: config.specularLimit ?? 0.7 }
        },
        vertexShader: MANGA_VERTEX_SHADER,
        fragmentShader: MANGA_FRAGMENT_SHADER,
        side: THREE.DoubleSide
    });
};

// Outline Material Helper
export const createOutlineMaterial = (color: string, width: number) => {
    return new THREE.ShaderMaterial({
        uniforms: {
            uT: { value: width },
            uC: { value: new THREE.Color(color) }
        },
        vertexShader: `
            uniform float uT; 
            void main() { 
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * uT, 1.0); 
            }
        `,
        fragmentShader: `
            uniform vec3 uC; 
            void main() {
                gl_FragColor = vec4(uC, 1.0);
            }
        `,
        side: THREE.BackSide
    });
};
