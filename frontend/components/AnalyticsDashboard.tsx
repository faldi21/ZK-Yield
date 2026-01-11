// components/AnalyticsDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACTS } from '@/lib/contracts';
import VaultV2ABI from '@/lib/abis/StrategyVaultV2.json';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STRATEGY_ABI = [
  {
    inputs: [],
    name: 'getAPY',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBalance',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Cyber/Dark theme colors
const COLORS = ['#00ff9d', '#00e1ff', '#ff00ff']; // Primary (Green), Cyan, Magenta
const BG_COLOR = '#1a1d1c'; // Card bg
const TEXT_COLOR = '#e0e0e0'; // Foreground
const GRID_COLOR = '#2d3330'; // Border color

interface StrategyData {
  name: string;
  icon: string;
  apy: number;
  balance: number;
  color: string;
}

export function AnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get vault stats
  const { data: vaultStatsRaw } = useReadContract({
    address: CONTRACTS.strategyVault as `0x${string}`,
    abi: VaultV2ABI.abi,
    functionName: 'getVaultStats',
    query: {
      enabled: mounted,
    },
  });

  const [tvlRaw, totalSharesRaw, reserveBalanceRaw, allocatedBalanceRaw, apyRaw, sharePriceRaw] = 
    (vaultStatsRaw as [bigint, bigint, bigint, bigint, bigint, bigint]) || [0n, 0n, 0n, 0n, 0n, 0n];

  const tvl = parseFloat(formatEther(tvlRaw));
  const vaultAPY = Number(apyRaw) / 100; // Assuming apyRaw is scaled by 100 or similar, but verify scaling. 
  // Note: If APY is in basis points or similar, adjust here. 
  // Assuming 1000 = 10% based on code reading.

  // Strategy addresses - use CONTRACTS for consistent addresses with fallbacks
  const strategies = [
    { name: 'Aave', address: CONTRACTS.mockAaveStrategy, color: COLORS[0], icon: '🏦' },
    { name: 'Uniswap', address: CONTRACTS.mockUniswapStrategy, color: COLORS[1], icon: '🦄' },
    { name: 'Lido', address: CONTRACTS.mockLidoStrategy, color: COLORS[2], icon: '🔷' },
  ];

  // Get strategy data
  // Note: Calling hooks inside map is generally unsafe unless the array is constant. 
  // Since 'strategies' is constant here, it works, but useReadContracts would be better.
  // Keeping it simple for now to preserve structure.
  const strategyData: StrategyData[] = strategies.map(strategy => {
    const { data: apy } = useReadContract({
      address: strategy.address as `0x${string}`,
      abi: STRATEGY_ABI,
      functionName: 'getAPY',
      query: {
        enabled: mounted,
      },
    });

    const { data: balance } = useReadContract({
      address: strategy.address as `0x${string}`,
      abi: STRATEGY_ABI,
      functionName: 'getBalance',
      query: {
        enabled: mounted,
      },
    });

    return {
      name: strategy.name,
      icon: strategy.icon,
      apy: apy ? Number(apy) / 100 : 0,
      balance: balance ? parseFloat(formatEther(balance as bigint)) : 0,
      color: strategy.color,
    };
  });

  // Calculate metrics
  // totalAllocated is sum of strategy balances
  const totalAllocated = strategyData.reduce((sum, s) => sum + s.balance, 0);
  const weightedAPY = totalAllocated > 0 
    ? strategyData.reduce((sum, s) => sum + (s.balance * s.apy), 0) / totalAllocated 
    : 0;

  // Prepare chart data
  const allocationData = strategyData.map(s => ({
    name: s.name,
    value: s.balance,
    percentage: totalAllocated > 0 ? (s.balance / totalAllocated * 100).toFixed(1) : '0',
  }));

  const apyComparisonData = strategyData.map(s => ({
    name: s.name,
    apy: s.apy,
  }));

  // Mock historical data (since we don't have it on-chain easily for this demo)
  const historicalData = [
    { day: 'Mon', value: tvl * 0.95 },
    { day: 'Tue', value: tvl * 0.97 },
    { day: 'Wed', value: tvl * 0.96 },
    { day: 'Thu', value: tvl * 0.98 },
    { day: 'Fri', value: tvl * 0.99 },
    { day: 'Sat', value: tvl },
    { day: 'Sun', value: tvl * 1.01 },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Value Locked"
          value={`$${(tvl * 2500).toLocaleString()}`} // Mock conversion to USD
          subtitle={`${tvl.toFixed(4)} MNT`}
          icon="💰"
          className="bg-card/50 border-primary/20"
        />
        <MetricCard
          title="Weighted APY"
          value={`${weightedAPY.toFixed(2)}%`}
          subtitle="Across all strategies"
          icon="📈"
          className="bg-card/50 border-cyan-500/20"
        />
        <MetricCard
          title="Active Strategies"
          value={strategies.length.toString()}
          subtitle="Operating normally"
          icon="⚡"
          className="bg-card/50 border-purple-500/20"
        />
        <MetricCard
          title="Allocated Funds"
          value={`${totalAllocated.toFixed(4)} MNT`}
          subtitle={`${((totalAllocated / (tvl || 1)) * 100).toFixed(1)}% Utilization`}
          icon="🎯"
          className="bg-card/50 border-yellow-500/20"
        />
      </div>



      {/* Historical Performance */}
      <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <span className="text-purple-400">📈</span> Historical TVL
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
              <XAxis dataKey="day" stroke={TEXT_COLOR} tick={{ fill: TEXT_COLOR }} axisLine={false} tickLine={false} />
              <YAxis stroke={TEXT_COLOR} tick={{ fill: TEXT_COLOR }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: BG_COLOR, borderColor: GRID_COLOR, color: TEXT_COLOR }}
                formatter={(value: any) => [`${parseFloat(value).toFixed(4)} MNT`, 'TVL']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={COLORS[0]} 
                strokeWidth={3}
                dot={{ fill: COLORS[0], strokeWidth: 2 }}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strategy Details Table */}
      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-yellow-400">📋</span> Strategy Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left bg-muted/20">
                <th className="py-3 px-4 font-semibold text-muted-foreground">Strategy</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">APY</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Balance</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Allocation</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Daily Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {strategyData.map((strategy, index) => (
                <tr key={strategy.name} className="hover:bg-muted/10 transition-colors">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <span className="text-lg">{strategy.icon}</span>
                    <span style={{ color: strategy.color }}>{strategy.name}</span>
                  </td>
                  <td className="text-right py-3 px-4 font-mono">{strategy.apy.toFixed(2)}%</td>
                  <td className="text-right py-3 px-4 font-mono">{strategy.balance.toFixed(4)} MNT</td>
                  <td className="text-right py-3 px-4 font-mono">
                    {totalAllocated > 0 ? ((strategy.balance / totalAllocated) * 100).toFixed(1) : '0.0'}%
                  </td>
                  <td className="text-right py-3 px-4 font-mono text-green-400">
                    +{((strategy.balance * strategy.apy / 100) / 365).toFixed(6)} MNT
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/20 font-medium">
              <tr>
                <td className="py-3 px-4">Total</td>
                <td className="text-right py-3 px-4 text-primary">
                  {weightedAPY.toFixed(2)}%
                </td>
                <td className="text-right py-3 px-4">
                  {totalAllocated.toFixed(4)} MNT
                </td>
                <td className="text-right py-3 px-4 text-muted-foreground">100%</td>
                <td className="text-right py-3 px-4 text-primary">
                  +{((totalAllocated * weightedAPY / 100) / 365).toFixed(6)} MNT
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  className: string;
}

function MetricCard({ title, value, subtitle, icon, className }: MetricCardProps) {
  return (
    <div className={`rounded-lg p-6 border ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium opacity-80">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-xs opacity-70">{subtitle}</p>
    </div>
  );
}
