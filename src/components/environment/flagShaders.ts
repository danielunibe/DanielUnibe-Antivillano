import * as THREE from 'three';

export const flagConfig = {
  windForce: 0.28,
  baseColor: new THREE.Color(0x222222)
};

export const flagVertexShader = `
uniform float uTime;
uniform float uWindStrength;
varying vec2 vUv;
varying vec3 vNormal;
varying float vDisplacement;
void main() {
  vUv = uv;
  vec3 pos = position;
  float pinWeight = pow(1.0 - uv.y, 1.5);
  float w1 = sin(pos.x * 1.5 + uTime * 2.0) * cos(pos.y * 1.0 + uTime * 0.5);
  float w2 = sin(pos.y * 3.0 + uTime * 3.5) * 0.4;
  float w3 = sin(uTime * 5.0 + (pos.x + pos.y) * 2.0) * 0.15;
  float displacement = (w1 + w2 + w3) * uWindStrength * pinWeight;
  pos.z += displacement;
  pos.y += abs(displacement) * 0.15 * pinWeight;
  pos.x -= abs(displacement) * 0.05 * pinWeight;
  vNormal = normalize(normalMatrix * normal);
  vDisplacement = displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const flagFragmentShader = `
uniform sampler2D uTexture;
uniform vec3 uBaseColor;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying float vDisplacement;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) { vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hash(i+vec2(0,0)),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y); }
void main() {
  float edgeNoise = noise(vUv * 45.0 + uTime * 0.05);
  float holeNoise = noise(vUv * 15.0);
  float distToLeft = vUv.x; float distToRight = 1.0 - vUv.x; float distToBottom = vUv.y;
  float frayAmount = 0.06 + edgeNoise * 0.08;
  if (vUv.y < 0.96 && (distToLeft < frayAmount || distToRight < frayAmount || distToBottom < frayAmount)) discard;
  if (holeNoise > 0.88 && vUv.y < 0.85) discard;
  vec4 mapTex = texture2D(uTexture, vUv);
  float clothGrain = noise(vUv * 400.0) * 0.15;
  float dirt = noise(vUv * 8.0) * 0.4;
  vec3 albedo = mix(uBaseColor, mapTex.rgb, mapTex.a) - clothGrain - dirt * 0.2;
  vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
  vec3 n = normalize(vNormal + vec3(0.0, 0.0, vDisplacement * 0.5));
  float diff = max(dot(n, lightDir), 0.0);
  vec3 finalColor = albedo * mix(0.4, 1.1, smoothstep(0.35, 0.38, diff));
  float edgeHighlight = smoothstep(frayAmount, frayAmount + 0.02, min(distToLeft, min(distToRight, distToBottom)));
  finalColor = mix(finalColor * 1.3, finalColor, edgeHighlight);
  gl_FragColor = vec4(finalColor, 1.0);
}
`;
