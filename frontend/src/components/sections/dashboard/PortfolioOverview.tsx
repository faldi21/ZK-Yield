// src/components/dashboard/PortfolioOverview.tsx
'use client';
import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Timeframe } from '@/lib/types/dashboard';
import { TIMEFRAME_OPTIONS } from '@/lib/constants/dashboard';

interface PortfolioOverviewProps {
  totalValue: number;
  percentageChange: number;
}

export function PortfolioOverview({ totalValue, percentageChange }: PortfolioOverviewProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1W');

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-text-secondary">Total Value Locked (TVL)</span>
            <TrendingUp size={16} className="text-text-tertiary"/>
          </div>
          <div className="text-5xl md:text-6xl font-bold text-text-primary mb-1">
            0.139 ETH
          </div>
          <div className="text-text-tertiary">
            ≈ ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="h-40 mb-3 relative">
        <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="var(--bg-surface)" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path 
            d="M 0 70 Q 50 60, 100 55 Q 150 50, 200 45 Q 250 35, 300 25 L 300 100 L 0 100 Z" 
            fill="url(#portfolioGradient)"
          />
          <path 
            d="M 0 70 Q 50 60, 100 55 Q 150 50, 200 45 Q 250 35, 300 25" 
            fill="none" 
            stroke="#F59E0B"
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <circle cx="300" cy="25" r="3" fill="#F59E0B"/>
        </svg>
        
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-success/10 border border-success/30 rounded">
          <TrendingUp size={12} className="text-success"/>
          <span className="text-xs font-semibold text-success">+{percentageChange}%</span>
        </div>
      </div>

      <div className="flex gap-4 text-xs border-t border-border-subtle pt-3">
        {TIMEFRAME_OPTIONS.map((period) => (
          <button
            key={period}
            onClick={() => setTimeframe(period)}
            className={`transition-colors ${
              timeframe === period 
                ? 'text-text-primary font-semibold' 
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  );
}