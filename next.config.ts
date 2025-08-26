import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: true,
    // ...other config
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json'
    });
    return config;
  }
};

export default nextConfig;
