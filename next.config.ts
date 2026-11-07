import type { NextConfig } from "next";

// Static export for GitHub Pages: `npm run build` writes plain HTML/JS/CSS to out/.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
