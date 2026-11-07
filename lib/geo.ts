// Equirectangular projection shared by the particle map, the SVG route
// overlay and the static fallback, so all three line up exactly.
export const LAT_TOP = 83;
export const LAT_BOTTOM = -58;
export const MAP_W = 360;
export const MAP_H = LAT_TOP - LAT_BOTTOM; // 141
export const MAP_ASPECT = MAP_W / MAP_H;

/** lon/lat to map units in a 360 x 141 viewBox. */
export function project(lon: number, lat: number): [number, number] {
  return [lon + 180, LAT_TOP - lat];
}
