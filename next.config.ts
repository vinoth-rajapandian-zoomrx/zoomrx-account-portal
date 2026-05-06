import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? "/zoomrx-account-portal" : "",
  // Allow importing JSON files from content directory
  experimental: {
    // Turbo is default in Next 16
  },
  // Resolve aliases for content imports
  serverExternalPackages: ["gray-matter"],
};

export default nextConfig;
