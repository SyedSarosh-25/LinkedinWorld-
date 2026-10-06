"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type * as THREE from "three";
import { useReducedMotion, useTokens } from "@/lib/hooks";

const TOKENS = ["accent", "steel"] as const;

function LinkedRings({ accent, steel, reduced }: { accent: string; steel: string; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.06;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.06;
    if (!group.current) return;
    if (!reduced) {
      group.current.rotation.y += dt * 0.25;
      if (a.current) a.current.rotation.x += dt * 0.12;
      if (b.current) b.current.rotation.y -= dt * 0.1;
    }
    group.current.rotation.x = 0.35 - pointer.current.y * 0.35;
    group.current.rotation.z = pointer.current.x * 0.25;
  });

  return (
    <group ref={group}>
      <mesh ref={a} position={[-0.62, 0, 0]} rotation={[0.2, 0.4, 0]}>
        <torusGeometry args={[1.1, 0.2, 64, 200]} />
        <meshStandardMaterial color={steel} metalness={0.65} roughness={0.32} />
      </mesh>
      <mesh ref={b} position={[0.62, 0, 0]} rotation={[Math.PI / 2 + 0.2, 0.1, 0.3]}>
        <torusGeometry args={[1.1, 0.2, 64, 200]} />
        <meshStandardMaterial color={accent} metalness={0.1} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** Small interactive 3D mark used in page headers. */
export default function Rings() {
  const tokens = useTokens(TOKENS);
  const reduced = useReducedMotion();
  return (
    <div aria-hidden="true" className="relative aspect-square w-full max-w-[420px]">
      {tokens && (
        <Canvas flat camera={{ position: [0, 0, 7], fov: 35 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }} style={{ position: "absolute", inset: 0 }}>
          <Environment resolution={256} frames={1}>
            <Lightformer intensity={2} position={[0, 6, 1]} scale={[7, 7, 1]} />
            <Lightformer intensity={1.2} position={[6, 1, 4]} scale={[5, 5, 1]} />
            <Lightformer intensity={0.25} position={[-6, -1, 2]} scale={[6, 6, 1]} />
            <Lightformer intensity={1.5} position={[-3, 3, 6]} scale={[3, 3, 1]} />
          </Environment>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 4, 5]} intensity={1.2} />
          <LinkedRings accent={tokens.accent} steel={tokens.steel} reduced={reduced} />
        </Canvas>
      )}
    </div>
  );
}
