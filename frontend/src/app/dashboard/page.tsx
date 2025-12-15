// src/app/dashboard/page.tsx
'use client'; // Added to use ConnectButton and other hooks
import { ConnectButton } from '@rainbow-me/rainbowkit'; // Import RainbowKit ConnectButton
import { ComplianceBanner } from '@/components/sections/dashboard/ComplianceBanner';
import { PortfolioOverview } from '@/components/sections/dashboard/PortfolioOverview';
import { ActivePositions } from '@/components/sections/dashboard/ActivePositions';
import { QuickActions } from '@/components/sections/dashboard/QuickActions';
import { RecentActivity } from '@/components/sections/dashboard/RecentActivity';
import { MOCK_POSITIONS, MOCK_ACTIVITIES } from '@/lib/constants/dashboard';

export default function DashboardPage() {
  const totalValue = 12345.67;
  const percentageChange = 4.97;
  const totalEarned = 198.78;
  const activePositions = 3;
  const averageApy = 6.93;

  return (
    <div className="min-h-screen bg-bg-primary text-text-secondary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">Dashboard</h1>
            <p className="text-sm text-text-tertiary">Manage your privacy-preserved assets</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Verification Status Badge */}
            <div className="px-3 py-1.5 bg-success/10 border border-success/30 rounded-full flex items-center gap-2">
              <span className="text-xs font-medium text-success">Verified</span>
            </div>
            {/* RainbowKit Connect Button */}
            <ConnectButton 
              label="Connect Wallet"
              accountStatus="address" // Show the address after connecting
              chainStatus="icon" // Show the chain icon
              showBalance={false} // Hide the balance for cleaner look
            />
          </div>
        </div>

        {/* Compliance Banner */}
        <ComplianceBanner />

        {/* Main Content Vertical Stack (Removed grid, now everything stacks with space-y-6) */}
        <div className="space-y-6">
          
          {/* Portfolio Overview & Chart */}
          <PortfolioOverview 
            totalValue={totalValue}
            percentageChange={percentageChange}
          />
          
          {/* Active Positions Table */}
          <ActivePositions positions={MOCK_POSITIONS} />
          
          {/* Quick Actions & Stats */}
          <QuickActions 
            totalEarned={totalEarned}
            activePositions={activePositions}
            averageApy={averageApy}
          />
          
          {/* Recent Activity */}
          <RecentActivity activities={MOCK_ACTIVITIES} />
        </div>
      </div>
    </div>
  );
}