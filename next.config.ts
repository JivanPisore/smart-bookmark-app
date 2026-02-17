import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Build ke waqt TypeScript errors ignore karne ke liye
    ignoreBuildErrors: true,
  },
  eslint: {
    // Build ke waqt ESLint errors ignore karne ke liye
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;