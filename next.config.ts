import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export for GitHub Pages (no Node server at runtime).
  output: "export",
  experimental: {
    // Crossfades page changes. Browsers without support change pages instantly.
    viewTransition: true,
  },
  images: {
    // The image optimization API needs a server; serve files as-is instead.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "better-flow.github.io" },
      { protocol: "https", hostname: "dsec.ifi.uzh.ch" },
    ],
  },
};

export default nextConfig;
