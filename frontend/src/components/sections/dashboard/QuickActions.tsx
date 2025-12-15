// src/components/dashboard/QuickActions.tsx
import { Wallet, DollarSign } from 'lucide-react';

interface QuickActionsProps {
  totalEarned: number;
  activePositions: number;
  averageApy: number;
}

export function QuickActions({ totalEarned, activePositions, averageApy }: QuickActionsProps) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
      <h2 className="text-lg font-bold text-text-primary mb-4">Quick Actions</h2>
      
      <div className="space-y-3">
        <button className="w-full px-4 py-3 bg-accent hover:bg-accent-hover text-text-primary font-semibold rounded-md flex items-center justify-center gap-2 transition-all duration-base">
          <Wallet size={18}/>
          Deposit Funds
        </button>

        <button disabled className="w-full px-4 py-3 bg-bg-elevated border border-border-subtle text-text-tertiary font-semibold rounded-md flex items-center justify-center gap-2 cursor-not-allowed">
          <DollarSign size={18}/>
          Withdraw All (Coming Soon)
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-border-subtle">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Portfolio Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-text-tertiary">Total Earned (All Time)</span>
            <span className="text-sm font-semibold text-success">${totalEarned.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-text-tertiary">Active Positions</span>
            <span className="text-sm font-semibold text-text-primary">{activePositions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-text-tertiary">Average APY</span>
            <span className="text-sm font-semibold text-text-primary">{averageApy.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}