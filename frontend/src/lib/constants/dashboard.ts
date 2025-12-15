// src/lib/constants/dashboard.ts
import { Position, ChartDataPoint, Activity } from '@/lib/types/dashboard';

export const MOCK_POSITIONS: Position[] = [
  { 
    name: 'USDC Vault', 
    protocol: 'Spark', 
    network: 'Base', 
    collateral: 'USDC', 
    deposited: 5000, 
    apy: 4.5, 
    earned: 56.25 
  },
  { 
    name: 'ETH Vault', 
    protocol: 'Aave V3', 
    network: 'Ethereum', 
    collateral: 'ETH', 
    deposited: 4000, 
    apy: 3.8, 
    earned: 38.00 
  },
  { 
    name: 'LP Position', 
    protocol: 'Uniswap V3', 
    network: 'Arbitrum', 
    collateral: 'ETH/USDC', 
    deposited: 3345, 
    apy: 12.5, 
    earned: 104.53 
  },
];

export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { date: '2024-01', value: 8000 },
  { date: '2024-02', value: 9500 },
  { date: '2024-03', value: 11000 },
  { date: '2024-04', value: 10500 },
  { date: '2024-05', value: 12345 },
];

export const MOCK_ACTIVITIES: Activity[] = [
  { type: 'deposit', vault: 'Aave USDC', amount: 1000, time: '2 hours ago' },
  { type: 'earn', vault: 'Spark ETH', amount: 12.5, time: '1 day ago' },
  { type: 'deposit', vault: 'Uniswap LP', amount: 500, time: '3 days ago' },
];

export const TIMEFRAME_OPTIONS = ['1D', '1W', '1M', '1Y', 'ALL'] as const;