"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { GlobeScene, type GlobeControl } from "./globe-scene";
import { useReducedMotion, useTokens } from "@/lib/hooks";

const TOKENS = ["globe-base", "globe-dot", "accent", "steel"] as const;

export default function Globe({ control }: { control: MutableRefObject<GlobeControl> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const tokens = useTokens(TOKENS);
  const [visible, setVisible] = useState(true);
  const last = useRef({ x: 0, y: 0 });
  const label = useRef<HTMLSpanElement>(null);

  // stop rendering when the globe is off screen
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onDown = (e: React.PointerEvent) => {
    control.current.dragging = true;
    last.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    control.current.px = (e.clientX - r.left) / r.width - 0.5;
    control.current.py = (e.clientY - r.top) / r.height - 0.5;
    if (!control.current.dragging) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    control.current.velocity = dx * 0.005;
    control.current.userSpin += dx * 0.005;
    control.current.userTilt = Math.max(-0.6, Math.min(0.6, control.current.userTilt + dy * 0.003));
  };
  const onUp = () => {
    control.current.dragging = false;
  };
  const onLeave = () => {
    control.current.px = 0;
    control.current.py = 0;
  };

  return (
    <div
      ref={wrap}
      role="img"
      aria-label="Interactive globe showing Islamabad connected to the world. Drag to rotate."
      className="relative mx-auto aspect-[1/0.86] w-full max-w-[760px] cursor-grab touch-pan-y active:cursor-grabbing"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={onLeave}
    >
      {tokens && (
        <Canvas
          camera={{ position: [0, 0, 6.4], fov: 30 }}
          flat
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          frameloop={visible ? "always" : "never"}
          style={{ position: "absolute", inset: 0 }}
        >
          {/* local studio lighting for the metal ring, no network HDR */}
          <Environment resolution={256} frames={1}>
            <Lightformer intensity={2} position={[0, 6, 1]} scale={[7, 7, 1]} />
            <Lightformer intensity={1.2} position={[6, 1, 4]} scale={[5, 5, 1]} />
            <Lightformer intensity={0.25} position={[-6, -1, 2]} scale={[6, 6, 1]} />
            <Lightformer intensity={1.5} position={[-3, 3, 6]} scale={[3, 3, 1]} />
          </Environment>
          <GlobeScene
            reduced={reduced}
            control={control}
            label={label}
            colors={{
              base: tokens["globe-base"],
              dot: tokens["globe-dot"],
              accent: tokens.accent,
              steel: tokens.steel,
            }}
          />
        </Canvas>
      )}
      <span
        ref={label}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 rounded-full border border-line bg-surface px-2.5 py-1 text-sm font-semibold whitespace-nowrap text-fg opacity-0 transition-opacity duration-300"
      >
        Islamabad
      </span>
    </div>
  );
}
