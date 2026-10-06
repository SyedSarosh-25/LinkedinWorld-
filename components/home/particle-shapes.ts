import { isLand } from "@/components/globe/land-mask";

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function rand(seed: number) {
  // small deterministic PRNG so server and client agree and shapes are stable
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Earth: land as dense dots, oceans as a sparse shell so the sphere still reads. */
export function globe(n: number, radius = 2): Float32Array {
  const out = new Float32Array(n * 3);
  // over-sample the whole sphere, keep land plus a sparse ocean shell, then thin evenly to n
  const samples = n * 4;
  const kept: number[] = [];
  let ocean = 0;
  for (let i = 0; i < samples; i++) {
    const y = 1 - (2 * (i + 0.5)) / samples;
    const r = Math.sqrt(1 - y * y);
    const th = i * GOLDEN;
    const x = Math.cos(th) * r;
    const z = Math.sin(th) * r;
    const lat = (Math.asin(y) * 180) / Math.PI;
    const lon = (Math.atan2(x, z) * 180) / Math.PI;
    if (!isLand(lat, lon)) {
      ocean++;
      if (ocean % 9 !== 0) continue;
    }
    kept.push(x, y, z);
  }
  const total = kept.length / 3;
  const rnd = rand(7);
  for (let k = 0; k < n; k++) {
    // even stride when we have enough points, otherwise reuse with a tiny jitter
    const src = total >= n ? Math.floor((k * total) / n) : k % total;
    const j = total >= n ? 0 : 0.01;
    out[k * 3] = (kept[src * 3] + (rnd() - 0.5) * j) * radius;
    out[k * 3 + 1] = (kept[src * 3 + 1] + (rnd() - 0.5) * j) * radius;
    out[k * 3 + 2] = (kept[src * 3 + 2] + (rnd() - 0.5) * j) * radius;
  }
  return out;
}

/** Noise: particles flung across the whole frame. */
export function chaos(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const r = rand(11);
  for (let i = 0; i < n; i++) {
    const u = r() * 2 - 1;
    const t = r() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const d = 2.6 + Math.pow(r(), 0.6) * 6.5;
    out[i * 3] = s * Math.cos(t) * d * 1.5;
    out[i * 3 + 1] = u * d * 0.9;
    out[i * 3 + 2] = s * Math.sin(t) * d - 1.5;
  }
  return out;
}

/** Two interlocked rings: the Linkin World mark. */
export function rings(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const r = rand(23);
  const R = 1.45;
  const tube = 0.16;
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const b = r() * Math.PI * 2;
    const rr = tube * Math.sqrt(r());
    const cx = (R + rr * Math.cos(b)) * Math.cos(a);
    const cy = (R + rr * Math.cos(b)) * Math.sin(a);
    const cz = rr * Math.sin(b);
    if (i % 2 === 0) {
      // ring in the XY plane, left
      out[i * 3] = cx - 0.78;
      out[i * 3 + 1] = cy;
      out[i * 3 + 2] = cz;
    } else {
      // ring in the XZ plane, right: passes through the first
      out[i * 3] = cx + 0.78;
      out[i * 3 + 1] = cz;
      out[i * 3 + 2] = cy;
    }
  }
  return out;
}

/** A rolling network field seen in perspective. */
export function field(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const cols = Math.ceil(Math.sqrt(n * 2));
  const rows = Math.ceil(n / cols);
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const rI = Math.floor(i / cols);
    const x = (c / (cols - 1) - 0.5) * 16;
    const z = (rI / Math.max(1, rows - 1) - 0.5) * 9;
    const y = Math.sin(x * 0.55) * 0.35 + Math.cos(z * 0.8 + x * 0.2) * 0.3;
    // tilt toward the camera
    const tilt = -0.42;
    out[i * 3] = x;
    out[i * 3 + 1] = y * Math.cos(tilt) - z * Math.sin(tilt) - 1.6;
    out[i * 3 + 2] = y * Math.sin(tilt) + z * Math.cos(tilt) - 1;
  }
  return out;
}

export function randoms(n: number): Float32Array {
  const out = new Float32Array(n);
  const r = rand(31);
  for (let i = 0; i < n; i++) out[i] = r();
  return out;
}
