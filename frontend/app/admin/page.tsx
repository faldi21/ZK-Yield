import { AllocateButton } from '@/components/AllocateButton';
import { HarvestButton } from '@/components/HarvestButton';
import { TransactionHistoryEnhanced } from '@/components/TransactionHistoryEnhanced';
import { ConnectButton } from '@/components/ConnectButton';
import { KYCUserManagement } from '@/components/KYCUserManagement';

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <ConnectButton />
      </div>

      <section>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
          <p className="text-destructive font-semibold">⚠️ Authorized Personnel Only</p>
          <p className="text-muted-foreground text-sm mt-1">
            These controls execute privileged functions on the protocol. Ensure you are connected with the owner wallet.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-foreground">Protocol Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Allocation Strategy */}
          <div className="bg-card rounded-lg border border-border p-6 h-full">
            <h3 className="text-lg font-medium text-foreground mb-4">Strategy Allocation</h3>
            <p className="text-muted-foreground mb-6 text-sm h-10">
              Trigger a manual reallocation of funds across strategies based on the latest APY data.
            </p>
            <div className="flex justify-start">
              <AllocateButton />
            </div>
          </div>

          {/* Harvest Yields */}
          <div className="bg-card rounded-lg border border-border p-6 h-full">
            <h3 className="text-lg font-medium text-foreground mb-4">Yield Management</h3>
            <p className="text-muted-foreground mb-6 text-sm h-10">
               Collect accumulated yields from all strategies to update TVL and user profits.
            </p>
             <div className="flex justify-start">
               <HarvestButton />
             </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 mt-8 text-foreground">KYC User Management</h2>
        <KYCUserManagement />

        <h2 className="text-2xl font-semibold mb-4 mt-8 text-foreground">Platform Activity</h2>
        <TransactionHistoryEnhanced showAll={true} />
      </section>
    </div>
  );
}
