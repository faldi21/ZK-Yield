import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable strict mode for wallet compatibility
  reactStrictMode: false,

  // Ignore build errors for faster deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

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

    // Exclude problematic packages from bundling
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push({
        pino: "pino",
        "thread-stream": "thread-stream",
      });
    }

    return config;
  },

  // Transpile problematic packages
  transpilePackages: [
    "@walletconnect/ethereum-provider",
    "@walletconnect/universal-provider",
  ],
};

export default nextConfig;
