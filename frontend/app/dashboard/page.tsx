import { UserStats } from '@/components/UserStats';
import { DepositForm } from '@/components/DepositForm';
import { WithdrawForm } from '@/components/WithdrawForm';
import { StrategiesOverview } from '@/components/StrategiesOverview';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

import ComplianceStatus from '@/components/ComplianceStatus';
import { CONTRACTS, getExplorerUrl } from '@/lib/contracts';

import { ConnectButton } from '@/components/ConnectButton';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <ConnectButton />
      </div>

      {/* Analytics Dashboard */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Analytics</h2>
        <AnalyticsDashboard />
      </section>
      
      {/* Compliance Status */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">KYC Compliance</h2>
        <ComplianceStatus />
      </section>

      {/* User Section (Your Position) */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Your Position</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <UserStats />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <DepositForm />
            <WithdrawForm />
          </div>
        </div>
      </section>
      


      {/* Yield Strategies */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Yield Strategies</h2>
        <StrategiesOverview />
      </section>

      {/* Contract Addresses */}
     {/* <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Smart Contracts</h2>
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-3">
            <ContractLink 
              name="StrategyVault V2" 
              address={CONTRACTS.strategyVault} 
            />
          <ContractLink 
            name="ComplianceManager" 
            address={CONTRACTS.complianceManager} 
          />
          <ContractLink 
            name="BalanceVerifier" 
            address={CONTRACTS.balanceVerifier} 
          />
        </div>
      </section> */}
    </div>
  );
}

function ContractLink({ name, address }: { name: string; address: string }) {
  if (!address) return null;
  
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-muted-foreground">{name}</span>
      <a 
        href={getExplorerUrl(address)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-primary hover:underline"
      >

        <span className="text-sm">→</span>
      </a>
    </div>
  );
}
