import { NextConfig } from "next";

const nextConfig: NextConfig = {
  future: { webpack5: true },
  webpack: (config) => {
    config.resolve!.alias = {
      ...(config.resolve!.alias || {}),
      canvas: false,
      encoding: false,
    };
    return config;
  },
};

export default nextConfig;
