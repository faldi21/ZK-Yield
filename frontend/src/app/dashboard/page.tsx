// src/app/dashboard/page.tsx
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComplianceBanner } from '@/components/sections/dashboard/ComplianceBanner';
import { PortfolioOverview } from '@/components/sections/dashboard/PortfolioOverview';
import { ActivePositions } from '@/components/sections/dashboard/ActivePositions';
import { QuickActions } from '@/components/sections/dashboard/QuickActions';
import { RecentActivity } from '@/components/sections/dashboard/RecentActivity';
import { MOCK_POSITIONS, MOCK_ACTIVITIES } from '@/lib/constants/dashboard';

export default function DashboardPage() {
  // Mock data - Replace with real API calls
  const totalValue = 12345.67;
  const percentageChange = 4.97;
  const totalEarned = 198.78;
  const activePositions = 3;
  const averageApy = 6.93;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">Dashboard</h1>
            <p className="text-sm text-text-tertiary">Manage your privacy-preserved assets</p>
          </div>
        </div>

        {/* Compliance Banner */}
        <ComplianceBanner />

        {/* Main Content Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Row 1: TVL (3/4) | Quick Actions (1/4) */}
          <div className="lg:col-span-3">
            <PortfolioOverview 
              totalValue={totalValue}
              percentageChange={percentageChange}
            />
          </div>
          
          <div className="lg:col-span-1">
            <QuickActions 
              totalEarned={totalEarned}
              activePositions={activePositions}
              averageApy={averageApy}
            />
          </div>
          
          {/* Row 2: Active Position (2/4) | Recent Activity (2/4) */}
          <div className="lg:col-span-2">
            <ActivePositions positions={MOCK_POSITIONS} />
          </div>
          
          <div className="lg:col-span-2">
            <RecentActivity activities={MOCK_ACTIVITIES} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}