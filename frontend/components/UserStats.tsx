// components/UserStats.tsx
'use client';

import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACTS } from '@/lib/contracts';
import VaultV2ABI from '@/lib/abis/StrategyVaultV2.json';

export function UserStats() {
  const { address, isConnected } = useAccount();
  
  // Get user stats from contract
  const { data: userStats, isLoading, refetch } = useReadContract({
    address: "0x466d0cd933A966D22577b55f2e9e5b67080E6938",
    abi: VaultV2ABI.abi,
    functionName: 'getUserStats',
    args: [address],
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 10000, // Refresh every 10s
    },
  });
  
  if (!isConnected) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 text-center h-full flex flex-col justify-center">
        <p className="text-muted-foreground mb-4">Connect your wallet to see your stats</p>
        <p className="text-sm text-muted-foreground/60">Connect using the button in the header</p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-secondary rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-secondary rounded"></div>
            <div className="h-20 bg-secondary rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!userStats) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-yellow-500 font-semibold">Unable to load user stats</p>
        <button 
          onClick={() => refetch()}
          className="mt-2 text-sm text-yellow-400 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }
  
  // Parse user stats
  const [userShares, userValue, totalDeposited, totalWithdrawn, netProfit] = userStats as [bigint, bigint, bigint, bigint, bigint];
  
  const stats = {
    shares: formatEther(userShares),
    value: formatEther(userValue),
    deposited: formatEther(totalDeposited),
    withdrawn: formatEther(totalWithdrawn),
    profit: formatEther(netProfit),
  };
  
  const hasDeposits = parseFloat(stats.value) > 0;
  
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Your Portfolio</h3>
        <button 
          onClick={() => refetch()}
          className="text-sm text-primary hover:underline"
        >
          Refresh
        </button>
      </div>
      
      {!hasDeposits ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-2">No deposits yet</p>
          <p className="text-sm text-muted-foreground/60">Make your first deposit to start earning yields</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Current Balance */}
          <div className="bg-secondary/50 rounded-lg p-4 border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5 text-4xl">💰</div>
            <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
            <p className="text-3xl font-bold text-primary">
              {parseFloat(stats.value).toFixed(4)} MNT
            </p>
            <p className="text-xs text-primary/70 mt-1">
              {parseFloat(stats.shares).toFixed(2)} shares
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatBox
              label="Total Deposited"
              value={`${parseFloat(stats.deposited).toFixed(4)} MNT`}
            />
            <StatBox
              label="Total Withdrawn"
              value={`${parseFloat(stats.withdrawn).toFixed(4)} MNT`}
            />
          </div>
          
          {/* Net Profit/Loss */}
          <div className={`rounded-lg p-4 border ${
            parseFloat(stats.profit) > 0 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-secondary border-border'
          }`}>
            <p className="text-sm text-muted-foreground mb-1">Net Profit/Loss</p>
            <p className={`text-2xl font-bold ${
              parseFloat(stats.profit) > 0 ? 'text-green-500' : 'text-foreground'
            }`}>
              {parseFloat(stats.profit) > 0 ? '+' : ''}
              {parseFloat(stats.profit) === 0 ? '0.0000' : parseFloat(stats.profit).toFixed(8)} MNT
            </p>
            {parseFloat(stats.profit) > 0 && (
              <p className="text-xs text-green-400 mt-1">
                🎉 You're earning yields!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary rounded-lg p-3 border border-border">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
