'use client';

import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi';
import { CONTRACTS, COMPLIANCE_MANAGER_ABI, STRATEGY_VAULT_ABI } from '@/lib/contracts';
import { formatEther } from 'viem';

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
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold">ZK-Yield</h1>
            <p className="text-gray-400">Privacy + Compliance</p>
          </div>
          
          {/* Connect Button */}
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

        {/* Content */}
        {isConnected ? (
          <div className="grid gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg text-gray-400 mb-2">Total Value Locked</h2>
              <p className="text-4xl font-bold">
                {totalValueLocked ? formatEther(totalValueLocked) : '0'} ETH
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg text-gray-400 mb-2">Compliance Status</h2>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${isCompliant ? 'bg-green-500' : 'bg-red-500'}`} />
                <p className="text-2xl font-bold">
                  {isCompliant ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg text-gray-400 mb-2">Your Address</h2>
              <p className="font-mono">{address}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔐</div>
            <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-xl text-gray-400 mb-8">
              Start using privacy-preserving DeFi
            </p>
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg"
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
