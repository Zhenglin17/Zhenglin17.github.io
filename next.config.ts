import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export for GitHub Pages (no Node server at runtime).
  output: "export",
  // Dev server only: let the Mac load dev resources over the LAN and Tailscale.
  allowedDevOrigins: ["192.168.1.188", "100.71.203.67"],
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
