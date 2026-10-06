import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three ships modern ESM; let Next transpile it with the app
  transpilePackages: ["three"],
};

export default nextConfig;
