// src/lib/constants/dashboard.ts
import { Position, ChartDataPoint, Activity, DashboardData } from '@/lib/types/dashboard';

// Mock Positions - diperbanyak menjadi 10
export const MOCK_POSITIONS: Position[] = [
  { 
    id: '1',
    name: 'USDC Vault', 
    protocol: 'Spark', 
    network: 'Mantle', 
    collateral: 'USDC', 
    deposited: 5000, 
    apy: 4.5, 
    earned: 56.25,
    status: 'active' as const
  },
  { 
    id: '2',
    name: 'ETH Vault', 
    protocol: 'Aave V3', 
    network: 'Mantle', 
    collateral: 'ETH', 
    deposited: 4000, 
    apy: 3.8, 
    earned: 38.00,
    status: 'active' as const
  },
  { 
    id: '3',
    name: 'LP Position', 
    protocol: 'Uniswap V3', 
    network: 'Mantle', 
    collateral: 'ETH/USDC', 
    deposited: 3345, 
    apy: 12.5, 
    earned: 104.53,
    status: 'active' as const
  },
  { 
    id: '4',
    name: 'wBTC Vault', 
    protocol: 'Compound V3', 
    network: 'Base', 
    collateral: 'wBTC', 
    deposited: 15000, 
    apy: 2.9, 
    earned: 108.75,
    status: 'active' as const
  },
  { 
    id: '5',
    name: 'DAI Savings', 
    protocol: 'MakerDAO', 
    network: 'Ethereum', 
    collateral: 'DAI', 
    deposited: 8000, 
    apy: 5.2, 
    earned: 104.00,
    status: 'active' as const
  },
  { 
    id: '6',
    name: 'LINK Yield', 
    protocol: 'Chainlink Staking', 
    network: 'Arbitrum', 
    collateral: 'LINK', 
    deposited: 2500, 
    apy: 7.8, 
    earned: 48.75,
    status: 'active' as const
  },
  { 
    id: '7',
    name: 'MATIC Pool', 
    protocol: 'Polygon Staking', 
    network: 'Polygon', 
    collateral: 'MATIC', 
    deposited: 3200, 
    apy: 6.3, 
    earned: 50.40,
    status: 'active' as const
  },
  { 
    id: '8',
    name: 'SOL Vault', 
    protocol: 'Marinade Finance', 
    network: 'Solana', 
    collateral: 'SOL', 
    deposited: 12000, 
    apy: 8.5, 
    earned: 255.00,
    status: 'active' as const
  },
  { 
    id: '9',
    name: 'AVAX Yield', 
    protocol: 'Benqi', 
    network: 'Avalanche', 
    collateral: 'AVAX', 
    deposited: 4500, 
    apy: 9.2, 
    earned: 103.50,
    status: 'active' as const
  },
  { 
    id: '10',
    name: 'OP Optimizer', 
    protocol: 'Velodrome', 
    network: 'Optimism', 
    collateral: 'OP', 
    deposited: 2800, 
    apy: 15.3, 
    earned: 107.10,
    status: 'active' as const
  },
];

// Mock Chart Data - diperbanyak menjadi 15 titik data
export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { date: 'Jan 1', value: 8000 },
  { date: 'Jan 8', value: 8500 },
  { date: 'Jan 15', value: 9200 },
  { date: 'Jan 22', value: 8700 },
  { date: 'Jan 29', value: 9500 },
  { date: 'Feb 5', value: 10000 },
  { date: 'Feb 12', value: 10500 },
  { date: 'Feb 19', value: 9800 },
  { date: 'Feb 26', value: 11000 },
  { date: 'Mar 5', value: 11500 },
  { date: 'Mar 12', value: 11200 },
  { date: 'Mar 19', value: 11800 },
  { date: 'Mar 26', value: 12300 },
  { date: 'Apr 2', value: 12500 },
  { date: 'Apr 9', value: 12345 },
];

// Mock Activities - diperbanyak menjadi 15 aktivitas
export const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', type: 'deposit', vault: 'Aave USDC', amount: 1000, time: '2 hours ago' },
  { id: '2', type: 'earn', vault: 'Spark ETH', amount: 12.5, time: '1 day ago' },
  { id: '3', type: 'deposit', vault: 'Uniswap LP', amount: 500, time: '3 days ago' },
  { id: '4', type: 'withdraw', vault: 'Compound wBTC', amount: 1500, time: '1 week ago' },
  { id: '5', type: 'deposit', vault: 'MakerDAO DAI', amount: 2000, time: '1 week ago' },
  { id: '6', type: 'earn', vault: 'Chainlink LINK', amount: 8.75, time: '2 weeks ago' },
  { id: '7', type: 'deposit', vault: 'Polygon MATIC', amount: 1200, time: '2 weeks ago' },
  { id: '8', type: 'earn', vault: 'Marinade SOL', amount: 25.5, time: '3 weeks ago' },
  { id: '9', type: 'withdraw', vault: 'Benqi AVAX', amount: 800, time: '3 weeks ago' },
  { id: '10', type: 'deposit', vault: 'Velodrome OP', amount: 1500, time: '1 month ago' },
  { id: '11', type: 'earn', vault: 'Spark USDC', amount: 15.25, time: '1 month ago' },
  { id: '12', type: 'deposit', vault: 'Aave V3 ETH', amount: 2500, time: '1 month ago' },
  { id: '13', type: 'earn', vault: 'Uniswap V3 LP', amount: 45.75, time: '2 months ago' },
  { id: '14', type: 'withdraw', vault: 'Compound V3', amount: 3000, time: '2 months ago' },
  { id: '15', type: 'deposit', vault: 'MakerDAO', amount: 5000, time: '3 months ago' },
];

export const TIMEFRAME_OPTIONS = ['1D', '1W', '1M', '1Y', 'ALL'] as const;

// Mock Dashboard Summary
export const MOCK_DASHBOARD_SUMMARY = {
  tvlEth: 0.139,
  tvlUsd: 48734.56,
  totalEarnedAllTime: 987.65,
  totalPositions: 10,
  averageApy: 7.45,
  percentageChange: 4.97,
  verificationStatus: 'verified' as const,
};

// Mock Complete Dashboard Data
export const MOCK_DASHBOARD_DATA: DashboardData = {
  summary: MOCK_DASHBOARD_SUMMARY,
  positions: MOCK_POSITIONS,
  activities: MOCK_ACTIVITIES,
  chartData: MOCK_CHART_DATA,
};

// Mock untuk Quick Actions Stats
export const QUICK_ACTIONS_STATS = {
  totalEarned: 987.65,
  activePositions: 10,
  averageApy: 7.45,
  totalDeposits: 65432.10,
  pendingRewards: 156.78,
};

// Mock untuk Protocol Distribution
export const PROTOCOL_DISTRIBUTION = [
  { protocol: 'Spark', percentage: 25, amount: 12500 },
  { protocol: 'Aave V3', percentage: 20, amount: 10000 },
  { protocol: 'Compound', percentage: 15, amount: 7500 },
  { protocol: 'Uniswap', percentage: 12, amount: 6000 },
  { protocol: 'MakerDAO', percentage: 10, amount: 5000 },
  { protocol: 'Others', percentage: 18, amount: 9000 },
];

// Mock untuk Network Distribution
export const NETWORK_DISTRIBUTION = [
  { network: 'Mantle', percentage: 40, amount: 20000 },
  { network: 'Ethereum', percentage: 25, amount: 12500 },
  { network: 'Base', percentage: 15, amount: 7500 },
  { network: 'Arbitrum', percentage: 10, amount: 5000 },
  { network: 'Polygon', percentage: 10, amount: 5000 },
];