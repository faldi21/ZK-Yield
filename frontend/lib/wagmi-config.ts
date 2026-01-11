// lib/wagmi-config.ts
import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { injected, walletConnect } from "wagmi/connectors";

// Define Mantle Sepolia chain
const mantleSepolia = defineChain({
  id: 5003,
  name: "Mantle Sepolia",
  nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia.mantle.xyz"] },
  },
  blockExplorers: {
    default: { name: "Mantlescan", url: "https://sepolia.mantlescan.xyz" },
  },
  testnet: true,
});

// Get WalletConnect project ID from: https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export const config = createConfig({
  chains: [mantleSepolia],
  connectors: [
    injected(), // MetaMask, Coinbase Wallet, etc.
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [mantleSepolia.id]: http("https://rpc.sepolia.mantle.xyz"),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
