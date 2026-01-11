import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable strict mode for wallet compatibility
  reactStrictMode: false,

  // Handle node modules that are problematic with bundlers
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }

    // Ignore test files in node_modules
    config.module.rules.push({
      test: /node_modules[\/\\]thread-stream[\/\\](test|bench)/,
      use: "null-loader",
    });

    return config;
  },

  // Transpile problematic packages
  transpilePackages: [
    "@walletconnect/ethereum-provider",
    "@walletconnect/universal-provider",
  ],

  // Experimental settings for better compatibility
  experimental: {
    serverActions: {},
  },
};

export default nextConfig;
