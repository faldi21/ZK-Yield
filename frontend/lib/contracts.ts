// Contract addresses and configuration for ZK-Yield
export const CONTRACTS = {
  complianceManager: '0xb7f565874DcB0F4B5718490D25f9A7Ebc8240A86',
  strategyVault: '0xcF58A15E61CA885cbb158e8Ea8c2224C59D8BA45',
  kycVerifier: '0x75aB70aB18665FAf84171952d84A2E122cE12e24',
  balanceVerifier: '0x6B52359bF7Cd14FbCcAcdb4fb1a4F8DEaF147BcA',
} as const;

export const COMPLIANCE_MANAGER_ABI = [
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'isCompliant',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'allowedJurisdiction',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const STRATEGY_VAULT_ABI = [
  {
    inputs: [],
    name: 'totalValueLocked',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
