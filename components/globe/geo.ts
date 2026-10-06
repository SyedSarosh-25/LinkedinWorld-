import { Vector3 } from "three";

export type LatLon = readonly [lat: number, lon: number];

export const ISLAMABAD: LatLon = [33.69, 73.05];

// Arc end points only; they are not labelled and do not imply client locations.
export const ARC_TARGETS: LatLon[] = [
  [25.2, 55.3],
  [51.5, -0.1],
  [24.7, 46.7],
  [1.35, 103.8],
  [43.7, -79.4],
  [-33.9, 151.2],
  [48.1, 11.6],
  [31.2, 121.5],
];

/** y-up sphere, lon 0 facing +z */
export function latLonToVec(lat: number, lon: number, r = 1): Vector3 {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return new Vector3(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo));
}

/** Great-circle arc lifted off the surface; height grows with distance. */
export function arcPoints(from: Vector3, to: Vector3, segments = 72, radius = 1): Vector3[] {
  const a = from.clone().normalize();
  const b = to.clone().normalize();
  const ang = a.angleTo(b);
  const lift = 0.12 + (0.32 * ang) / Math.PI;
  const pts: Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const v = a
      .clone()
      .multiplyScalar(Math.sin((1 - t) * ang) / Math.sin(ang))
      .add(b.clone().multiplyScalar(Math.sin(t * ang) / Math.sin(ang)));
    v.multiplyScalar(radius * (1.01 + lift * Math.sin(Math.PI * t)));
    pts.push(v);
  }
  return pts;
}
