import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Disable some experimental features that might cause issues
    optimizePackageImports: [],
  },
  // Ensure proper module resolution
  typescript: {
    ignoreBuildErrors: false,
  },
  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  turbopack: {},
  async rewrites() {
    return [];
  },
};

export default nextConfig;
