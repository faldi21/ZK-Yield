'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACTS } from '@/lib/contracts';
import VaultV2ABI from '@/lib/abis/StrategyVaultV2Multi.json';

export function WithdrawForm() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  
  // Get user's shares
  const { data: userShares } = useReadContract({
    address: "0x466d0cd933A966D22577b55f2e9e5b67080E6938",
    abi: VaultV2ABI.abi,
    functionName: 'shares',
    args: address ? [address] : undefined,
  });
  
  // Get total shares
  const { data: totalShares } = useReadContract({
    address: "0x466d0cd933A966D22577b55f2e9e5b67080E6938",
    abi: VaultV2ABI.abi,
    functionName: 'totalShares',
  });
  
  // Get TVL
  const { data: tvl } = useReadContract({
    address: "0x466d0cd933A966D22577b55f2e9e5b67080E6938",
    abi: VaultV2ABI.abi,
    functionName: 'totalValueLocked',
  });
  
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
  
  // Calculate MNT value of shares
  const getEthValue = (shares: bigint) => {
    if (!totalShares || !tvl || totalShares === 0n) return 0n;
    return (shares * (tvl as bigint)) / (totalShares as bigint);
  };
  
  // Calculate shares from MNT amount
  const getSharesFromEth = (ethAmount: bigint) => {
    if (!totalShares || !tvl || tvl === 0n) return 0n;
    return (ethAmount * (totalShares as bigint)) / (tvl as bigint);
  };
  
  // User's balance in MNT
  const userBalanceEth = userShares ? getEthValue(userShares as bigint) : 0n;
  const userBalanceEthFormatted = formatEther(userBalanceEth);
  
  // Set percentage of balance
  const setPercentage = (percent: number) => {
    if (!userShares) return;
    const ethValue = getEthValue(userShares as bigint);
    const withdrawAmount = (ethValue * BigInt(percent)) / 100n;
    setAmount(formatEther(withdrawAmount));
  };
  
  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (!userShares || userShares === 0n) {
      alert('No balance to withdraw');
      return;
    }
    
    const ethAmount = parseEther(amount);
    
    // Check if amount exceeds balance
    if (ethAmount > userBalanceEth) {
      alert(`Insufficient balance. You have ${userBalanceEthFormatted} MNT`);
      return;
    }
    
    // Calculate shares to burn from MNT amount
    const sharesToBurn = getSharesFromEth(ethAmount);
    
    if (sharesToBurn === 0n) {
      alert('Amount too small');
      return;
    }
    
    writeContract({
      address: "0x466d0cd933A966D22577b55f2e9e5b67080E6938",
      abi: VaultV2ABI.abi,
      functionName: 'withdraw',
      args: [sharesToBurn],
    });
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
        <h3 className="text-lg font-semibold mb-2 text-foreground">Withdraw</h3>
        <p className="text-sm text-muted-foreground">Connect wallet to withdraw funds</p>
      </div>
    );
  }
  
  const hasBalance = userShares && (userShares as bigint) > 0n;
  
  if (!hasBalance) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 h-full">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Withdraw MNT</h3>
        <div className="bg-secondary rounded-lg p-6 text-center h-[calc(100%-3rem)] flex flex-col justify-center">
          <p className="text-muted-foreground">No balance to withdraw</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Make a deposit first to start using the vault
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <div className="text-6xl">💸</div>
      </div>

      <h3 className="text-lg font-semibold mb-4 text-foreground">Withdraw MNT</h3>
      
      <div className="space-y-4">
        {/* Balance Display */}
        <div className="bg-secondary border border-border rounded-lg p-3">
          <p className="text-sm text-primary font-semibold">
            Available: {userBalanceEthFormatted} MNT
          </p>
        </div>
        
        {/* Quick Percentage Buttons */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Quick Select
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75].map((percent) => (
              <button
                key={percent}
                onClick={() => setPercentage(percent)}
                disabled={isPending || isConfirming}
                className="py-2 bg-secondary text-foreground rounded-lg font-semibold text-sm hover:brightness-125 transition-all disabled:opacity-50"
              >
                {percent}%
              </button>
            ))}
            <button
              onClick={() => setAmount(userBalanceEthFormatted)}
              disabled={isPending || isConfirming}
              className="py-2 bg-primary/20 text-primary border border-primary/50 rounded-lg font-semibold text-sm hover:bg-primary/30 transition-all disabled:opacity-50"
            >
              MAX
            </button>
          </div>
        </div>
        
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Amount (MNT)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.001"
              step="0.001"
              min="0"
              max={userBalanceEthFormatted}
              className="w-full px-4 py-3 bg-secondary border border-input rounded-lg focus:ring-2 focus:ring-destructive focus:border-transparent text-foreground placeholder:text-muted-foreground/50"
              disabled={isPending || isConfirming}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">
              MNT
            </div>
          </div>
        </div>
        
        {/* Withdraw Button */}
        <button
          onClick={handleWithdraw}
          disabled={isPending || isConfirming || !amount || parseFloat(amount) <= 0}
          className="w-full py-4 bg-destructive text-destructive-foreground rounded-lg font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-destructive/20"
        >
          {isPending && '⏳ Confirm in Wallet...'}
          {isConfirming && '⏳ Processing Withdrawal...'}
          {!isPending && !isConfirming && `Withdraw ${amount ? parseFloat(amount).toFixed(4) : '0'} MNT`}
        </button>
        
        {/* Status Messages */}
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
            <p className="text-sm text-green-500 font-semibold">✅ Withdrawal Successful!</p>
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
            <p className="text-sm text-destructive font-semibold">❌ Withdrawal Failed</p>
            <p className="text-xs text-destructive/80 mt-1 truncate">
              {error.message}
            </p>
            <button
              onClick={() => reset()}
              className="mt-2 text-xs text-destructive hover:underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
