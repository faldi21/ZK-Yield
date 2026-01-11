// components/AllocateButton.tsx
'use client';

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';
import VaultV2ABI from '@/lib/abis/StrategyVaultV2_Multi.json';

export function AllocateButton() {
  const { address } = useAccount();
  
  const { 
    writeContract, 
    data: hash,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();
  
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({ 
    hash 
  });
  
  const handleAllocate = () => {
    writeContract({
      address: CONTRACTS.strategyVault as `0x${string}`,
      abi: VaultV2ABI.abi,
      functionName: 'allocateToStrategies',
    });
  };
  
  // Reset after success
  if (isConfirmed) {
    setTimeout(() => {
      resetWrite();
      // Refresh page to update balances
      window.location.reload();
    }, 2000);
  }
  
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Allocate Funds</h3>
          <p className="text-sm text-muted-foreground">Distribute vault funds to strategies</p>
        </div>
        <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          <span className="text-xs font-medium text-primary">👨‍💼 Admin Only</span>
        </div>
      </div>
      
      <div className="mb-4 bg-primary/10 border border-primary/20 rounded-lg p-3">
        <p className="text-sm text-primary font-semibold mb-1">ℹ️ How it works</p>
        <ul className="text-xs text-primary/80 space-y-1">
          <li>• Allocates vault reserves to strategies</li>
          <li>• Distribution: 40% Aave, 40% Uniswap, 20% Lido</li>
          <li>• Starts earning yields immediately</li>
        </ul>
      </div>
      
      <button
        onClick={handleAllocate}
        disabled={!address || isWritePending || isConfirming}
        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isWritePending && '⏳ Confirm in Wallet...'}
        {!isWritePending && isConfirming && '⏳ Allocating...'}
        {!isWritePending && !isConfirming && '🔄 Allocate to Strategies'}
      </button>
      
      {/* Status Messages */}
      {hash && !isConfirmed && (
        <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <p className="text-sm text-yellow-500 font-semibold">⏳ Transaction Pending</p>
          <p className="text-xs text-yellow-500/80 mt-1">Allocating funds to strategies...</p>
          <a 
            href={`https://sepolia.mantlescan.xyz/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-yellow-500 hover:underline mt-2 block"
          >
            View on Mantlescan →
          </a>
        </div>
      )}
      
      {isConfirmed && (
        <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <p className="text-sm text-green-500 font-semibold">✅ Allocation Successful!</p>
          <p className="text-xs text-green-400 mt-1">
            Funds distributed to strategies. Page will refresh...
          </p>
          <a 
            href={`https://sepolia.mantlescan.xyz/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-500 hover:underline mt-2 block"
          >
            View on Mantlescan →
          </a>
        </div>
      )}
      
      {writeError && (
        <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <p className="text-sm text-destructive font-semibold">❌ Transaction Failed</p>
          <p className="text-xs text-destructive/80 mt-1">
            {writeError.message.slice(0, 100)}...
          </p>
          <button
            onClick={() => resetWrite()}
            className="mt-2 text-xs text-destructive hover:underline"
          >
            Try again
          </button>
        </div>
      )}
      
      {/* Info Footer */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Tip:</strong> Allocate after deposits to start earning yields. 
          Normally auto-allocates every 24 hours.
        </p>
      </div>
    </div>
  );
}
