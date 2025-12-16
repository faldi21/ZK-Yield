// src/lib/types/dashboard.ts

export interface Position {
  id: string;
  name: string;
  protocol: string;
  network: string;
  collateral: string;
  deposited: number;
  apy: number;
  earned: number;
  status: 'active' | 'inactive' | 'closed';
  createdAt?: Date;
  lastUpdated?: Date;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  change?: number;
}

export interface Activity {
  id: string;
  type: 'deposit' | 'earn' | 'withdraw' | 'claim' | 'stake' | 'unstake';
  vault: string;
  amount: number;
  time: string;
  txHash?: string;
  status?: 'completed' | 'pending' | 'failed';
}

export interface DashboardSummary {
  tvlEth: number;
  tvlUsd: number;
  totalEarnedAllTime: number;
  totalPositions: number;
  averageApy: number;
  percentageChange: number;
  verificationStatus?: 'verified' | 'unverified' | 'pending';
  totalDeposits?: number;
  pendingRewards?: number;
  totalWithdrawals?: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  positions: Position[];
  activities: Activity[];
  chartData: ChartDataPoint[];
  protocolDistribution?: ProtocolDistribution[];
  networkDistribution?: NetworkDistribution[];
}

export type Timeframe = '1D' | '1W' | '1M' | '1Y' | 'ALL';

export type TabType = 'positions' | 'vaults' | 'activities' | 'analytics';

// Tambahan tipe data baru
export interface ProtocolDistribution {
  protocol: string;
  percentage: number;
  amount: number;
  color?: string;
}

export interface NetworkDistribution {
  network: string;
  percentage: number;
  amount: number;
  color?: string;
}

export interface QuickActionStats {
  totalEarned: number;
  activePositions: number;
  averageApy: number;
  totalDeposits: number;
  pendingRewards: number;
}

export interface VaultStats {
  totalVaults: number;
  activeVaults: number;
  totalTVL: number;
  avgApy: number;
  bestPerforming?: string;
  worstPerforming?: string;
}