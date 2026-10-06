"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scene } from "@/lib/scene-store";
import { chaos, field, globe, randoms, rings } from "./particle-shapes";

const vertex = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uIntro;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uMouse;
attribute vec3 aChaos;
attribute vec3 aRings;
attribute vec3 aField;
attribute float aRand;
varying float vAlpha;
varying float vHot;

float ease(float t) { return t * t * (3.0 - 2.0 * t); }

void main() {
  float seg = min(floor(uProgress), 2.0);
  float local = clamp((uProgress - seg) * 1.35 - aRand * 0.35, 0.0, 1.0);
  local = ease(local);
  vec3 from = position;
  vec3 to = aChaos;
  if (seg == 1.0) { from = aChaos; to = aRings; }
  if (seg == 2.0) { from = aRings; to = aField; }
  vec3 p = mix(from, to, local);

  // particles drift; more loosely while in the noise state
  float loose = 1.0 - clamp(abs(uProgress - 1.0), 0.0, 1.0);
  float amp = 0.025 + loose * 0.35;
  p += amp * vec3(
    sin(uTime * 0.7 + aRand * 43.0),
    cos(uTime * 0.6 + aRand * 31.0),
    sin(uTime * 0.5 + aRand * 17.0)
  );

  // assemble from scattered on first load
  p = mix(aChaos * 1.6, p, ease(clamp(uIntro * 1.4 - aRand * 0.4, 0.0, 1.0)));

  vec4 world = modelMatrix * vec4(p, 1.0);

  // push away from the pointer
  vec2 d = world.xy - uMouse.xy;
  float dist = length(d);
  float force = smoothstep(1.3, 0.0, dist);
  world.xy += normalize(d + 0.0001) * force * 0.55;
  vHot = force;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.55 + aRand * 0.9) * (1.0 / -mv.z);
  vAlpha = 0.35 + aRand * 0.55;
}
`;

const fragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vAlpha;
varying float vHot;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = pow(1.0 - d * 2.0, 1.7);
  vec3 col = mix(uColorA, uColorB, clamp(vAlpha * 0.6 + vHot, 0.0, 1.0));
  gl_FragColor = vec4(col, a * vAlpha);
}
`;

export function Particles({ count, reduced }: { count: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, gl, camera } = useThree();

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(globe(count), 3));
    g.setAttribute("aChaos", new THREE.BufferAttribute(chaos(count), 3));
    g.setAttribute("aRings", new THREE.BufferAttribute(rings(count), 3));
    g.setAttribute("aField", new THREE.BufferAttribute(field(count), 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(randoms(count), 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uIntro: { value: 0 },
          uSize: { value: 40 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
          uMouse: { value: new THREE.Vector3(99, 99, 0) },
          uColorA: { value: new THREE.Color("#dbe7ee") },
          uColorB: { value: new THREE.Color("#3fd4e4") },
        },
      }),
    [gl],
  );

  const mouse = useMemo(() => new THREE.Vector3(), []);
  const ray = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const u = material.uniforms;
    if (!reduced) u.uTime.value += dt;
    scene.progress += (scene.target - scene.progress) * Math.min(1, dt * 3.2);
    u.uProgress.value = scene.progress;
    u.uIntro.value = scene.intro;

    // pointer projected onto the z=0 plane
    ray.set(scene.pointer.x, scene.pointer.y, 0.5).unproject(camera).sub(camera.position).normalize();
    const t = -camera.position.z / ray.z;
    mouse.copy(camera.position).add(ray.multiplyScalar(t));
    u.uMouse.value.lerp(mouse, 0.15);

    const g = group.current;
    if (!g) return;
    const narrow = viewport.width < 7;
    const targetX = narrow ? 0 : scene.offsetX;
    g.position.x += (targetX - g.position.x) * Math.min(1, dt * 2.5);
    // on narrow screens lift the globe above the headline in the hero
    const ringsFocus = Math.max(0, 1 - Math.abs(scene.progress - 2));
    const targetY = narrow ? 1.1 * Math.max(0, 1 - scene.progress) : 0.75 * ringsFocus;
    g.position.y += (targetY - g.position.y) * Math.min(1, dt * 2.5);
    if (!reduced) g.rotation.y += dt * (0.06 + 0.1 * Math.max(0, 1 - Math.abs(scene.progress - 2)));
    g.rotation.x = 0.25 * Math.max(0, 1 - Math.abs(scene.progress - 2)) + state.pointer.y * 0.06;
    const heroScale = 0.74 + 0.26 * Math.min(1, scene.progress);
    g.scale.setScalar((narrow ? 0.72 : 1) * heroScale);
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
