'use client';

import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi';
import { CONTRACTS, COMPLIANCE_MANAGER_ABI, STRATEGY_VAULT_ABI } from '@/lib/contracts';
import { formatEther } from 'viem';
import { KYCVerification } from '@/components/KYCVerification';
import { DepositWithdraw } from '@/components/DepositWithdraw';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: isCompliant } = useReadContract({
    address: CONTRACTS.complianceManager,
    abi: COMPLIANCE_MANAGER_ABI,
    functionName: 'isCompliant',
    args: address ? [address] : undefined,
  });

  const { data: totalValueLocked } = useReadContract({
    address: CONTRACTS.strategyVault,
    abi: STRATEGY_VAULT_ABI,
    functionName: 'totalValueLocked',
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">ZK</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">ZK-Yield</h1>
              <p className="text-sm text-gray-400">Privacy + Compliance</p>
            </div>
          </div>
          
          <div>
            {isConnected ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Connected</p>
                  <p className="font-mono text-sm">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => connect({ connector: connectors[0] })}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {isConnected ? (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Total Value Locked</div>
                <div className="text-3xl font-bold">
                  {totalValueLocked ? formatEther(totalValueLocked) : '0'} ETH
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Compliance Status</div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isCompliant ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div className="text-xl font-bold">
                    {isCompliant ? 'Verified' : 'Not Verified'}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Network</div>
                <div className="text-xl font-bold">Base Sepolia</div>
              </div>
            </div>

            {/* KYC Verification Component */}
            {!isCompliant && <KYCVerification />}

            {/* Deposit/Withdraw Component - Only show if compliant */}
            {isCompliant && <DepositWithdraw />}

            {/* Guide for non-compliant users */}
            {!isCompliant && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-yellow-300 mb-2">
                  Complete KYC to Access Platform
                </h3>
                <p className="text-yellow-200 text-sm">
                  Please complete the KYC verification above to deposit and earn yields.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold mb-4">Privacy-Preserving Yield Aggregator</h2>
            <p className="text-xl text-gray-400 mb-8">
              Earn yields while maintaining privacy through Zero-Knowledge Proofs
            </p>
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg"
            >
              Connect Wallet
            </button>
          </div>
        )}

        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">System Info</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Circuit Constraints: </span>
              <span className="text-green-400 font-bold">8</span>
            </div>
            <div>
              <span className="text-gray-400">Network: </span>
              <span>Base Sepolia</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
