// lib/contracts.ts
import StrategyVaultABI from "./abis/StrategyVaultV2Multi.json";

export const CONTRACTS = {
  // Phase 0 - Core contracts (Mantle Sepolia)
  complianceManager:
    (process.env.NEXT_PUBLIC_COMPLIANCE_MANAGER as `0x${string}`) ||
    "0x29f904256DbbaD523316e2de65203351E2D07291",
  balanceVerifier: "0x1C43248802896b172Aa804dc3FAb1cFF2277a078",

  // Phase 1 - Vault V2 (current active vault)
  strategyVault: "0x466d0cd933A966D22577b55f2e9e5b67080E6938",

  // Strategies
  mockAaveStrategy:
    (process.env.NEXT_PUBLIC_MOCK_AAVE_STRATEGY as `0x${string}`) ||
    "0x1f0Dc2345eb99F37807C21015DA1074c18E39242",
  mockUniswapStrategy:
    (process.env.NEXT_PUBLIC_MOCK_UNISWAP_STRATEGY as `0x${string}`) ||
    "0x4d1F12114FB2a350B99d2457c62695105E74a775",
  mockLidoStrategy:
    (process.env.NEXT_PUBLIC_MOCK_LIDO_STRATEGY as `0x${string}`) ||
    "0x1aa398947928C2Bd1Cf322A7DcA80Cd4b03Ac14b",

  // Feature flags
  useVaultV2: process.env.NEXT_PUBLIC_USE_VAULT_V2 === "true",
} as const;

// Network config
export const NETWORK = {
  chainId: 5003, // Mantle Sepolia
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.sepolia.mantle.xyz",
  name: "Mantle Sepolia",
  explorer: "https://sepolia.mantlescan.xyz",
} as const;

// ABI exports - import full ABI from generated JSON
export const STRATEGY_VAULT_ABI = StrategyVaultABI.abi;

// Compliance Manager ABI (minimal for check functions)
export const COMPLIANCE_MANAGER_ABI = [
  {
    inputs: [{ name: "user", type: "address" }],
    name: "isCompliant",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "allowedJurisdiction",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "selfApprove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "a", type: "uint256[2]" },
      { name: "b", type: "uint256[2][2]" },
      { name: "c", type: "uint256[2]" },
      { name: "publicSignals", type: "uint256[3]" },
    ],
    name: "grantCompliance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Helper functions
export const getExplorerUrl = (address: string) => {
  return `${NETWORK.explorer}/address/${address}`;
};

export const getExplorerTxUrl = (txHash: string) => {
  return `${NETWORK.explorer}/tx/${txHash}`;
};

export const ADMIN_ADDRESS = "0x1F74796415c43b67230f4FE52549f600D6988A0e";
