"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Particles } from "./particles";
import { scene } from "@/lib/scene-store";
import { useReducedMotion } from "@/lib/hooks";

/** Full-viewport WebGL layer fixed behind the home page. */
export default function Backdrop() {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const w = window.innerWidth;
    setCount(w < 768 ? 11000 : w < 1280 ? 20000 : 28000);
    const move = (e: PointerEvent) => {
      scene.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scene.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  if (!count) return null;
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 38 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Particles count={count} reduced={reduced} />
      <EffectComposer>
        <Bloom intensity={0.85} luminanceThreshold={0.12} luminanceSmoothing={0.3} mipmapBlur radius={0.7} />
        <Vignette offset={0.25} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}
