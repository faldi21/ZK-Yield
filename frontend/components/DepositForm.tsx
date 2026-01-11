'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACTS } from '@/lib/contracts';
import { STRATEGY_VAULT_ABI } from '@/lib/contracts';
import { generateBalanceProof, formatProofForContract } from '@/lib/zk-proof';

export function DepositForm() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const { data: ethBalance } = useBalance({ address });

  const { 
    writeContract, 
    data: hash,
    isPending,
    error,
    reset,
  } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ 
    hash 
  });
  
  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setIsGeneratingProof(true);
      // Generate Proof
      const proofResult = await generateBalanceProof(
        ethBalance?.value || parseEther('10'), // Fallback for demo
        parseEther('0.001')
      );
      const formattedProof = formatProofForContract(proofResult.proof);

      // Call deposit() with Proof Args
      writeContract({
        address: "0x466d0cd933A966D22577b55f2e9e5b67080E6938", // Hardcoded Vault (Mock ZK)
        abi: STRATEGY_VAULT_ABI,
        functionName: 'deposit',
        args: [
          formattedProof.a, 
          formattedProof.b, 
          formattedProof.c, 
          formattedProof.publicSignals
        ],
        value: parseEther(amount),
      });
    } catch (err) {
      console.error(err);
      alert('Proof generation failed or rejected');
    } finally {
      setIsGeneratingProof(false);
    }
  };
  
  if (isSuccess) {
    setTimeout(() => {
      setAmount('');
      reset();
      window.location.reload();
    }, 2000);
  }
  
  if (!isConnected) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 h-full flex flex-col justify-center items-center text-center">
        <h3 className="text-lg font-semibold mb-2 text-foreground">Deposit</h3>
        <p className="text-sm text-muted-foreground">Connect wallet to deposit components</p>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <div className="text-6xl">📥</div>
      </div>
      
      <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
        Deposit Assets <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">ZK-Shielded</span>
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Amount (MNT)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              step="0.001"
              min="0"
              className="w-full px-4 py-3 bg-secondary border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground/50"
              disabled={isPending || isConfirming || isGeneratingProof}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">
              MNT
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
             <span>Min: 0.001 MNT</span>
             <span>Balance: {ethBalance?.formatted ? parseFloat(ethBalance.formatted).toFixed(4) : '0.00'} MNT</span>
          </div>
        </div>
        
        <button
          onClick={handleDeposit}
          disabled={isPending || isConfirming || !amount || isGeneratingProof}
          className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-primary/20"
        >
          {isGeneratingProof ? '🔐 Generating ZK Proof...' : 
           isPending ? '⏳ Confirm in Wallet...' : 
           isConfirming ? '⏳ Processing Deposit...' : 
           'Deposit & Shield'}
        </button>
        
        {hash && !isSuccess && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <p className="text-sm text-yellow-500 font-semibold">⏳ Transaction Pending</p>
            <a 
              href={`https://sepolia.mantlescan.xyz/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-yellow-400 hover:text-yellow-300 hover:underline mt-1 block"
            >
              View on Mantlescan →
            </a>
          </div>
        )}
        
        {isSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-sm text-green-500 font-semibold">✅ Deposit Successful!</p>
            <a 
              href={`https://sepolia.mantlescan.xyz/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-400 hover:text-green-300 hover:underline mt-1 block"
            >
              View on Mantlescan →
            </a>
          </div>
        )}
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive font-semibold">❌ Deposit Failed</p>
            <p className="text-xs text-destructive/80 mt-1 truncate">
              {error.message}
            </p>
            <button
              onClick={() => reset()}
              className="mt-2 text-xs text-destructive hover:underline"
              type="button"
            >
              Try again
            </button>
          </div>
        )}
        
        <div className="text-xs text-center text-muted-foreground/60 mt-4">
          By depositing, you agree to the Terms of Service. Gas fees apply.
        </div>
      </div>
    </div>
  );
}