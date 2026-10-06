"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** CSS custom property for the resting dot colour */
  colorVar?: string;
  /** CSS custom property for dots near the pointer */
  activeVar?: string;
  spacing?: number;
  className?: string;
};

/**
 * Canvas grid of dots behind a section. Dots near the pointer grow and take the accent colour;
 * a slow wave keeps the field breathing. Pauses off screen, static with reduced motion.
 */
export function DotField({ colorVar = "--dot", activeVar = "--accent", spacing = 28, className = "" }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let base = "#8c959e";
    let active = "#0e6f80";

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      base = cs.getPropertyValue(colorVar).trim() || base;
      active = cs.getPropertyValue(activeVar).trim() || active;
    };

    const resize = () => {
      const r = el.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      const R = 150;
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      const ox = (w - (cols - 1) * spacing) / 2;
      const oy = (h - (rows - 1) * spacing) / 2;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = ox + i * spacing;
          const y = oy + j * spacing;
          const wave = reduced ? 0.5 : 0.5 + 0.5 * Math.sin(x * 0.012 + y * 0.008 + t * 0.0009);
          const d = Math.hypot(x - pointer.x, y - pointer.y);
          const near = d < R ? 1 - d / R : 0;
          const size = 0.9 + wave * 0.5 + near * 2.2;
          ctx.globalAlpha = 0.28 + wave * 0.22 + near * 0.5;
          ctx.fillStyle = near > 0.15 ? active : base;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (visible) draw(t);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.tx = e.clientX - r.left;
      pointer.ty = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
    };

    readColors();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      readColors();
      if (reduced) draw(0);
    };
    mq.addEventListener("change", onScheme);

    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mq.removeEventListener("change", onScheme);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [colorVar, activeVar, spacing]);

  return <canvas ref={canvas} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
