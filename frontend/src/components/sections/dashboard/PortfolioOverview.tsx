// src/components/dashboard/PortfolioOverview.tsx
'use client';
import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Timeframe } from '@/lib/types/dashboard';
import { TIMEFRAME_OPTIONS, MOCK_DASHBOARD_SUMMARY } from '@/lib/constants/dashboard';

interface PortfolioOverviewProps {
  totalValue?: number; // Menjadi optional karena akan menggunakan data dari mock
  percentageChange?: number; // Menjadi optional karena akan menggunakan data dari mock
}

export function PortfolioOverview({ 
  totalValue = MOCK_DASHBOARD_SUMMARY.tvlUsd, // Default ke data mock
  percentageChange = MOCK_DASHBOARD_SUMMARY.percentageChange // Default ke data mock
}: PortfolioOverviewProps) {
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
            {MOCK_DASHBOARD_SUMMARY.tvlEth.toFixed(3)} ETH
          </div>
          <div className="text-text-tertiary">
            ≈ ${totalValue.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
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
          {/* Area fill dengan lebih banyak titik/lekukan */}
          <path 
            d="M 0 70 
               Q 25 65, 50 62
               Q 75 58, 100 55
               Q 125 52, 150 48
               Q 175 42, 200 45
               Q 225 38, 250 35
               Q 275 30, 300 25
               L 300 100 
               L 0 100 Z" 
            fill="url(#portfolioGradient)"
          />
          {/* Garis dengan lebih banyak lekukan */}
          <path 
            d="M 0 70 
               Q 25 65, 50 62
               Q 75 58, 100 55
               Q 125 52, 150 48
               Q 175 42, 200 45
               Q 225 38, 250 35
               Q 275 30, 300 25" 
            fill="none" 
            stroke="#F59E0B"
            strokeWidth="2" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-success/10 border border-success/30 rounded">
          <TrendingUp size={12} className="text-success"/>
          <span className="text-xs font-semibold text-success">+{percentageChange}%</span>
        </div>
      </div>

      <div className="flex gap-2 text-xs border-t border-border-subtle pt-3">
        {TIMEFRAME_OPTIONS.map((period) => (
          <button
            key={period}
            onClick={() => setTimeframe(period)}
            className={`px-3 py-1.5 rounded-md cursor-pointer ${
              timeframe === period 
                ? 'bg-bg-elevated text-text-primary font-semibold border border-border-medium' 
                : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-elevated/50'
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  );
}