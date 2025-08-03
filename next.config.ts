import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // disable the default Next.js server-side rendering for this project
  devIndicators: false,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;