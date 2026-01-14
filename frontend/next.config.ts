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
        // Tambahan untuk MetaMask SDK
        "@react-native-async-storage/async-storage": false,
      };

      // Exclude thread-stream test files
      config.module.rules.push({
        test: /node_modules\/thread-stream\/(test|bench)/,
        loader: "ignore-loader",
      });
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

  // FIX: Ganti dari experimental.serverComponentsExternalPackages
  serverExternalPackages: ["pino", "thread-stream", "pino-pretty"],

  // Transpile problematic packages
  transpilePackages: [
    "@walletconnect/ethereum-provider",
    "@walletconnect/universal-provider",
  ],

  // Rewrites to serve docs properly
  async rewrites() {
    return [
      // Redirect /docs to intro page
      {
        source: "/docs",
        destination: "/docs/docs/introduction/context-positioning/index.html",
      },
      {
        source: "/docs/",
        destination: "/docs/docs/introduction/context-positioning/index.html",
      },
      // Handle all internal docs routes (client-side navigation fallback)
      {
        source: "/docs/docs/:path*",
        destination: "/docs/docs/:path*/index.html",
      },
    ];
  },
};

export default nextConfig;
