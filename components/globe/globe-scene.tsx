"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { isLand } from "./land-mask";
import { ARC_TARGETS, ISLAMABAD, arcPoints, latLonToVec } from "./geo";

export type GlobeControl = {
  /** extra rotation driven by page scroll (GSAP writes this) */
  scrollSpin: number;
  userSpin: number;
  userTilt: number;
  velocity: number;
  dragging: boolean;
  /** pointer position over the globe, -0.5..0.5 */
  px: number;
  py: number;
};

export type GlobeColors = {
  base: string;
  dot: string;
  accent: string;
  steel: string;
};

const SEG = 72;
const DOT_COUNT = 16000;

function useLandDots() {
  return useMemo(() => {
    const pos: number[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < DOT_COUNT; i++) {
      const y = 1 - (2 * (i + 0.5)) / DOT_COUNT;
      const r = Math.sqrt(1 - y * y);
      const th = i * golden;
      const x = Math.cos(th) * r;
      const z = Math.sin(th) * r;
      const lat = (Math.asin(y) * 180) / Math.PI;
      const lon = (Math.atan2(x, z) * 180) / Math.PI;
      if (isLand(lat, lon)) pos.push(x * 1.002, y * 1.002, z * 1.002);
    }
    return new Float32Array(pos);
  }, []);
}

export function GlobeScene({
  colors,
  reduced,
  control,
  label,
}: {
  colors: GlobeColors;
  reduced: boolean;
  control: MutableRefObject<GlobeControl>;
  /** DOM label positioned over the Islamabad marker */
  label: MutableRefObject<HTMLSpanElement | null>;
}) {
  const { camera, size } = useThree();
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const holderA = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const pulseMat = useRef<THREE.MeshBasicMaterial>(null);
  const marker = useRef<THREE.Mesh>(null);

  const dots = useLandDots();
  const isb = useMemo(() => latLonToVec(ISLAMABAD[0], ISLAMABAD[1], 1.01), []);
  const baseSpin = (-ISLAMABAD[1] * Math.PI) / 180;
  const baseTilt = ((ISLAMABAD[0] * Math.PI) / 180) * 0.55;

  // arcs are plain THREE.Line objects so we can animate their draw range
  const arcs = useMemo(
    () =>
      ARC_TARGETS.map((t, k) => {
        const pts = arcPoints(isb, latLonToVec(t[0], t[1]), SEG);
        const geometry = new THREE.BufferGeometry().setFromPoints(pts);
        geometry.setDrawRange(0, 0);
        return { geometry, end: pts[SEG], offset: k * 0.9 };
      }),
    [isb],
  );
  const arcMaterial = useMemo(() => new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9 }), []);
  const arcLines = useMemo(() => arcs.map((a) => new THREE.Line(a.geometry, arcMaterial)), [arcs, arcMaterial]);
  const endRefs = useRef<(THREE.Mesh | null)[]>([]);

  useEffect(() => {
    arcMaterial.color.set(colors.accent);
  }, [arcMaterial, colors.accent]);

  useEffect(
    () => () => {
      arcs.forEach((a) => a.geometry.dispose());
      arcMaterial.dispose();
    },
    [arcs, arcMaterial],
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const nrm = useMemo(() => new THREE.Vector3(), []);
  const toCam = useMemo(() => new THREE.Vector3(), []);
  const time = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    time.current += dt;
    const t = time.current;
    const c = control.current;

    if (!c.dragging) {
      c.velocity *= 0.94;
      c.userSpin += c.velocity;
      if (!reduced) c.userSpin += dt * 0.06;
    }
    if (spin.current) spin.current.rotation.y = baseSpin + c.userSpin + c.scrollSpin;
    if (tilt.current) {
      tilt.current.rotation.x = baseTilt + c.userTilt;
      tilt.current.rotation.z = reduced ? 0 : -c.px * 0.12;
    }
    camera.position.x += ((reduced ? 0 : c.px * 0.5) - camera.position.x) * 0.05;
    camera.position.y += ((reduced ? 0 : -c.py * 0.35) - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    if (!reduced) {
      if (ringA.current) ringA.current.rotation.z += dt * 0.25;
      if (ringB.current) ringB.current.rotation.z -= dt * 0.18;
      if (holderA.current) holderA.current.rotation.y = 0.32 + Math.sin(t * 0.3) * 0.06;
    }

    const phase = (t * 0.8) % 1;
    pulse.current?.scale.setScalar(1 + phase * 1.6);
    if (pulseMat.current) pulseMat.current.opacity = 0.85 * (1 - phase);

    arcs.forEach((a, i) => {
      const cyc = 6.5;
      const ph = (t + a.offset) % cyc;
      let start = 0;
      let end = 0;
      if (reduced) end = SEG + 1;
      else if (ph < 1.6) end = Math.floor((ph / 1.6) * (SEG + 1));
      else if (ph < 3.6) end = SEG + 1;
      else if (ph < 4.6) {
        start = Math.floor(((ph - 3.6) / 1.0) * (SEG + 1));
        end = SEG + 1;
      }
      a.geometry.setDrawRange(start, Math.max(0, end - start));
      const on = reduced || (ph >= 1.5 && ph < 4.4);
      endRefs.current[i]?.scale.setScalar(on ? 1 : 0.001);
    });

    // hide the Islamabad label when the marker turns to the far side
    if (marker.current && label.current) {
      marker.current.getWorldPosition(tmp);
      nrm.copy(tmp).normalize();
      toCam.copy(camera.position).sub(tmp).normalize();
      label.current.style.opacity = nrm.dot(toCam) > 0.2 ? "1" : "0";
      tmp.project(camera);
      label.current.style.transform = `translate(${(tmp.x * 0.5 + 0.5) * size.width}px, ${(-tmp.y * 0.5 + 0.5) * size.height}px) translate(-50%, -160%)`;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />

      <group ref={tilt} rotation={[baseTilt, 0, 0]}>
        <group ref={spin} rotation={[0, baseSpin, 0]}>
          <mesh>
            <sphereGeometry args={[0.992, 72, 72]} />
            <meshBasicMaterial color={colors.base} />
          </mesh>

          <points>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[dots, 3]} />
            </bufferGeometry>
            <PointMaterial size={0.021} sizeAttenuation transparent opacity={0.85} color={colors.dot} depthWrite={false} />
          </points>

          <mesh ref={marker} position={isb}>
            <sphereGeometry args={[0.03, 24, 24]} />
            <meshBasicMaterial color={colors.accent} />
          </mesh>

          <mesh
            ref={pulse}
            position={isb}
            onUpdate={(m) => m.lookAt(isb.clone().multiplyScalar(2))}
          >
            <ringGeometry args={[0.045, 0.06, 48]} />
            <meshBasicMaterial ref={pulseMat} color={colors.accent} transparent side={THREE.DoubleSide} depthWrite={false} />
          </mesh>

          {arcLines.map((line, i) => (
            <primitive key={i} object={line} />
          ))}
          {arcs.map((a, i) => (
            <mesh
              key={i}
              position={a.end}
              scale={0.001}
              ref={(m) => {
                endRefs.current[i] = m;
              }}
            >
              <sphereGeometry args={[0.018, 16, 16]} />
              <meshBasicMaterial color={colors.accent} />
            </mesh>
          ))}
        </group>
      </group>

      {/* two linked rings, the Linkin World mark in 3D */}
      <group ref={holderA} rotation={[1.22, 0.32, 0]}>
        <mesh ref={ringA}>
          <torusGeometry args={[1.36, 0.028, 32, 240]} />
          <meshStandardMaterial color={colors.steel} metalness={0.65} roughness={0.3} />
        </mesh>
      </group>
      <group rotation={[1.86, -0.62, 0.5]}>
        <mesh ref={ringB}>
          <torusGeometry args={[1.36, 0.028, 32, 240]} />
          <meshStandardMaterial color={colors.accent} metalness={0.15} roughness={0.32} />
        </mesh>
      </group>
    </>
  );
}
