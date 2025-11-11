import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  eslint: {
    // Don't fail build on ESLint errors - we'll fix them incrementally
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't fail build on TypeScript errors during build
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
