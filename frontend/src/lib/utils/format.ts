// src/lib/mockData.ts
import { DashboardData } from '@/lib/types/dashboard';

export const mockDashboardData: DashboardData = {
  summary: {
    tvlEth: 0.139,
    tvlUsd: 12345.87,
    percentageChange: 4.97,
    totalEarnedAllTime: 198.78,
    totalPositions: 3,
    averageApy: 6.93,
    verificationStatus: 'unverified',
  },
  positions: [
    {
      id: 'pos-1',
      name: 'USDC Vault',
      protocol: 'Spark',
      network: 'Mantle',
      collateral: 'USDC',
      deposited: 5000,
      apy: 4.5,
      earned: 56.25,
      status: 'active',
    },
    {
      id: 'pos-2',
      name: 'ETH Vault',
      protocol: 'Aave V3',
      network: 'Mantle',
      collateral: 'ETH',
      deposited: 4000,
      apy: 3.8,
      earned: 38.0,
      status: 'active',
    },
    {
      id: 'pos-3',
      name: 'LP Position',
      protocol: 'Uniswap V3',
      network: 'Mantle',
      collateral: 'ETH/USDC',
      deposited: 3345,
      apy: 12.5,
      earned: 104.53,
      status: 'active',
    },
  ],
  activities: [
    { id: 'act-1', type: 'deposit', vault: 'Aave USDC', amount: 1000, time: '2 hours ago' },
    { id: 'act-2', type: 'earn', vault: 'Spark ETH', amount: 12.5, time: '1 day ago' },
    { id: 'act-3', type: 'deposit', vault: 'Uniswap LP', amount: 500, time: '3 days ago' },
  ],
  chartData: [
    { date: '2024-01', value: 8000 },
    { date: '2024-02', value: 9500 },
    { date: '2024-03', value: 11000 },
    { date: '2024-04', value: 10500 },
    { date: '2024-05', value: 12345 },
  ]
};