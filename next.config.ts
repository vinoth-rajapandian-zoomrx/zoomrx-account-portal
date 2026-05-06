import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Allow importing JSON files from content directory
  experimental: {
    // Turbo is default in Next 16
  },
  // Resolve aliases for content imports
  serverExternalPackages: ["gray-matter"],
};

export default nextConfig;
