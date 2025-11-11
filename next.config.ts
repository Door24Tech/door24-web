import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Disable Turbopack for production builds to avoid build errors
  experimental: {
    turbo: undefined,
  },
};

export default nextConfig;
