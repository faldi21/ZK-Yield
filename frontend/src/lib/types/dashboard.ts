// src/lib/types/dashboard.ts

export interface Position {
  name: string;
  protocol: string;
  network: string;
  collateral: string;
  deposited: number;
  apy: number;
  earned: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface Activity {
  type: 'deposit' | 'earn' | 'withdraw';
  vault: string;
  amount: number;
  time: string;
}

export interface DashboardSummary {
  tvlEth: number;
  tvlUsd: number;
  totalEarnedAllTime: number;
  totalPositions: number;
  averageApy: number;
  percentageChange: number;
  verificationStatus?: 'verified' | 'unverified';
}

// Tambahkan interface baru untuk data dashboard lengkap
export interface DashboardData {
  summary: DashboardSummary;
  positions: Position[];
  activities: Activity[];
  chartData: ChartDataPoint[];
}

export type Timeframe = '1D' | '1W' | '1M' | '1Y' | 'ALL';

export type TabType = 'positions' | 'vaults';