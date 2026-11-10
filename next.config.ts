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
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=300' },
      ],
    }];
  },

  // Configure webpack to handle server-only modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle jsdom for client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        jsdom: false,
      };
    }
    return config;
  },
};

export default nextConfig;
