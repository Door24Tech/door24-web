import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Disable Turbopack for production builds to avoid CI/CD issues
  experimental: {
    turbo: undefined,
  },
};

export default nextConfig;
