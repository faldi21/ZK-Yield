// ZK-Yield Contract Configuration
// Network: Base Sepolia (Testnet)

export const CONTRACTS = {
  // Core Contracts
  complianceManager: '0xb7f565874DcB0F4B5718490D25f9A7Ebc8240A86',
  strategyVault: '0xcF58A15E61CA885cbb158e8Ea8c2224C59D8BA45',
  
  // Verifiers
  kycVerifier: '0x75aB70aB18665FAf84171952d84A2E122cE12e24',
  balanceVerifier: '0x6B52359bF7Cd14FbCcAcdb4fb1a4F8DEaF147BcA',
} as const;

export const NETWORK = {
  chainId: 84532,
  name: 'Base Sepolia',
  rpc: 'https://sepolia.base.org',
  explorer: 'https://sepolia.basescan.org',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
} as const;

export const DEPLOYMENT_INFO = {
  block: 34594949,
  date: '2025-12-05',
  deployer: '0x1F74796415c43b67230f4FE52549f600D6988A0e',
} as const;

// Contract Links
export const LINKS = {
  complianceManager: `${NETWORK.explorer}/address/${CONTRACTS.complianceManager}`,
  strategyVault: `${NETWORK.explorer}/address/${CONTRACTS.strategyVault}`,
  kycVerifier: `${NETWORK.explorer}/address/${CONTRACTS.kycVerifier}`,
  balanceVerifier: `${NETWORK.explorer}/address/${CONTRACTS.balanceVerifier}`,
} as const;
