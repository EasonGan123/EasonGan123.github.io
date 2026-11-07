import { site, type Project } from "@/content/site";

// Axis for the experience timeline: Jan 2023 to Jan 2027.
export const AXIS_START = 2023;
export const AXIS_END = 2027;
export const YEARS = [2023, 2024, 2025, 2026];

const ym = (s: string) => {
  const [y, m] = s.split("-").map(Number);
  return y + (m - 1) / 12;
};

// Month granularity keeps server and client renders identical.
const now = new Date();
export const NOW = now.getFullYear() + now.getMonth() / 12;

export const frac = (v: number) => (v - AXIS_START) / (AXIS_END - AXIS_START);

export type Span = { p: Project; left: number; width: number; ongoing: boolean };

export function spans(): Span[] {
  return [...(site.projects as readonly Project[])]
    .sort((a, b) => ym(a.start) - ym(b.start))
    .map((p) => {
      const s = ym(p.start);
      const e = p.end ? ym(p.end) + 1 / 12 : NOW;
      return { p, left: frac(s), width: Math.max(0.02, frac(e) - frac(s)), ongoing: !p.end };
    });
}
