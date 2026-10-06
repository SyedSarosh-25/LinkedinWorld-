// Shared, mutable state between DOM scroll triggers and the WebGL frame loop.
// Plain object on purpose: written by GSAP, read every frame, never triggers React renders.

export const scene = {
  /** 0 globe, 1 chaos, 2 linked rings, 3 network field (scroll-driven target) */
  target: 0,
  /** eased value the shader actually uses */
  progress: 0,
  /** 0..1 particles assemble after the preloader */
  intro: 0,
  /** horizontal offset of the formation in world units (hero sits right of the headline) */
  offsetX: 1.4,
  /** pointer in normalised device coords */
  pointer: { x: 0, y: 0 },
};

export const PRELOADER_DONE = "lw:preloader-done";

export function onPreloaderDone(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if ((window as unknown as { __lwReady?: boolean }).__lwReady) {
    cb();
    return () => {};
  }
  window.addEventListener(PRELOADER_DONE, cb, { once: true });
  return () => window.removeEventListener(PRELOADER_DONE, cb);
}

// handy for debugging the scroll story from the console
if (typeof window !== "undefined") (window as unknown as { __lwScene?: typeof scene }).__lwScene = scene;
