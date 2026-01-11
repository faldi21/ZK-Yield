// components/StrategiesOverview.tsx
'use client';

import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACTS } from '@/lib/contracts';

// Mock strategy ABIs (minimal)
const STRATEGY_ABI = [
  {
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
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
  {
    inputs: [],
    name: 'getPendingYield',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

interface StrategyCardProps {
  name: string;
  address: string;
  icon: string;
  borderColorClass: string;
}

function StrategyCard({ name, address, icon, borderColorClass }: StrategyCardProps) {
  const { data: strategyName } = useReadContract({
    address: address as `0x${string}`,
    abi: STRATEGY_ABI,
    functionName: 'name',
  });
  
  const { data: apy } = useReadContract({
    address: address as `0x${string}`,
    abi: STRATEGY_ABI,
    functionName: 'getAPY',
  });
  
  const { data: balance } = useReadContract({
    address: address as `0x${string}`,
    abi: STRATEGY_ABI,
    functionName: 'getBalance',
  });
  
  const { data: pendingYield } = useReadContract({
    address: address as `0x${string}`,
    abi: STRATEGY_ABI,
    functionName: 'getPendingYield',
  });
  
  const apyPercent = apy ? Number(apy) / 100 : 0;
  const balanceEth = balance ? formatEther(balance as bigint) : '0';
  const yieldEth = pendingYield ? formatEther(pendingYield as bigint) : '0';
  
  return (
    <div className={`bg-card rounded-lg shadow-sm border p-6 hover:shadow-md transition-all ${borderColorClass}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{icon}</div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground">{strategyName as string || 'Loading...'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{apyPercent.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">APY</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-secondary rounded border border-border">
          <span className="text-sm text-muted-foreground">Allocated</span>
          <span className="font-semibold text-foreground">{parseFloat(balanceEth).toFixed(4)} MNT</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-secondary rounded border border-border">
          <span className="text-sm text-muted-foreground">Pending Yield</span>
          <span className="font-semibold text-primary">+{parseFloat(yieldEth).toFixed(6)} MNT</span>
        </div>
        
        <div className="pt-2">
          <a 
           /* href={`https://sepolia.basescan.org/address/${address}`}*/
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
           <span></span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function StrategiesOverview() {
  // Get strategy addresses from env
  const strategies = [
    {
      name: 'Aave V3',
      address: CONTRACTS.mockAaveStrategy,
      icon: '🏦',
      borderColorClass: 'border-purple-500/30 hover:border-purple-500/60',
    },
    {
      name: 'Uniswap V3',
      address: CONTRACTS.mockUniswapStrategy,
      icon: '🦄',
      borderColorClass: 'border-pink-500/30 hover:border-pink-500/60',
    },
    {
      name: 'Lido',
      address: CONTRACTS.mockLidoStrategy,
      icon: '🔷',
      borderColorClass: 'border-blue-500/30 hover:border-blue-500/60',
    },
  ].filter(s => s.address); // Only show if address exists
  
  if (strategies.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 text-center">
        <p className="text-muted-foreground mb-2">No strategies deployed yet</p>
        <p className="text-sm text-muted-foreground/60">Deploy mock strategies to see them here</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Active Strategies</h3>
          <p className="text-sm text-muted-foreground">Automated yield generation across protocols</p>
        </div>
        <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          <span className="text-xs font-medium text-primary">🧪 Mock Strategies</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <StrategyCard key={strategy.address} {...strategy} />
        ))}
      </div>
      
      <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-sm text-yellow-500 font-semibold mb-1">ℹ️ Mock Strategies for Demo</p>
        <p className="text-xs text-yellow-400/80">
          These are simulated strategies for testing. They generate fake yields to demonstrate the platform.
          Real production strategies will integrate with actual DeFi protocols.
        </p>
      </div>
    </div>
  );
}
