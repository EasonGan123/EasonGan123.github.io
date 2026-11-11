export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/projects", "/about", "/life", ...site.projects.map((p) => `/projects/${p.id}`)];
  return paths.map((p) => ({ url: `${site.url}${p}`, lastModified: new Date(), changeFrequency: "monthly", priority: p === "" ? 1 : 0.7 }));
}
