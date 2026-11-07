// Generates lib/world-dots.json: a grid of [lon, lat] points that fall on land.
// Run: node scripts/gen-world-dots.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const topo = JSON.parse(readFileSync("node_modules/world-atlas/land-110m.json", "utf8"));
const land = feature(topo, topo.objects.land);
const STEP = 1.5;
const LAT_TOP = 83, LAT_BOTTOM = -58;
const pts = [];
for (let lat = LAT_TOP - STEP / 2; lat > LAT_BOTTOM; lat -= STEP) {
  for (let lon = -180 + STEP / 2; lon < 180; lon += STEP) {
    if (geoContains(land, [lon, lat])) pts.push(+lon.toFixed(2), +lat.toFixed(2));
  }
}
writeFileSync("lib/world-dots.json", JSON.stringify(pts));
console.log("points:", pts.length / 2);
