"use client";
import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useBalance } from "wagmi";
import { CONTRACTS, STRATEGY_VAULT_ABI } from "@/lib/contracts";
import { parseEther, formatEther } from "viem";
import { generateBalanceProof, formatProofForContract } from "@/lib/zk-proof";

export function DepositWithdraw() {
  const { address } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const TESTNET_MIN = parseEther("0.001");
  const { data: ethBalance } = useBalance({ address });
  const { data: userShares, refetch: refetchShares } = useReadContract({
    address: CONTRACTS.strategyVault,
    abi: STRATEGY_VAULT_ABI,
    functionName: "shares",
    args: address ? [address] : undefined,
  });
  const { data: totalShares } = useReadContract({
    address: CONTRACTS.strategyVault,
    abi: STRATEGY_VAULT_ABI,
    functionName: "totalShares",
  });
  const { data: tvl } = useReadContract({
    address: CONTRACTS.strategyVault,
    abi: STRATEGY_VAULT_ABI,
    functionName: "totalValueLocked",
  });
  const { writeContract, data: depositHash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: depositHash });

  const handleDeposit = async () => {
    if (!depositAmount) return;
    const amount = parseEther(depositAmount);
    if (amount < TESTNET_MIN) {
      setError("Minimum: 0.001 ETH");
      return;
    }
    try {
      setIsGeneratingProof(true);
      setError(null);
      const proofResult = await generateBalanceProof(ethBalance?.value || 0n, TESTNET_MIN);
      const formattedProof = formatProofForContract(proofResult.proof);

      // Convert strings to BigInt for contract call
      const a = formattedProof.a.map((x) => BigInt(x)) as [bigint, bigint];
      const b = formattedProof.b.map((row) => row.map((x) => BigInt(x)) as [bigint, bigint]) as [[bigint, bigint], [bigint, bigint]];
      const c = formattedProof.c.map((x) => BigInt(x)) as [bigint, bigint];

      writeContract({
        address: CONTRACTS.strategyVault,
        abi: STRATEGY_VAULT_ABI,
        functionName: "deposit",
        args: [a, b, c, BigInt(proofResult.commitment)],
        value: amount,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGeneratingProof(false);
    }
  };

  const handleWithdraw = async () => {
    if (!userShares || userShares === 0n) return;
    try {
      setError(null);
      writeContract({
        address: CONTRACTS.strategyVault,
        abi: STRATEGY_VAULT_ABI,
        functionName: "withdraw",
        args: [userShares],
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const calculateUserValue = (): string => {
    if (!userShares || !totalShares || !tvl || totalShares === 0n) return "0";
    const userValue = (userShares * tvl) / totalShares;
    return formatEther(userValue);
  };

  const formatShares = (shares: bigint): string => {
    const sharesNum = Number(shares);
    if (sharesNum > 1e15) {
      return (sharesNum / 1e18).toFixed(4);
    }
    return sharesNum.toLocaleString();
  };

  if (!address) return null;
  if (isSuccess) refetchShares();
  const hasShares = userShares && userShares > 0n;

  return (
    <div className="bg-transparent">
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-950/50 border border-white/5 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Your Shares</div>
          <div className="text-2xl font-bold text-white">{userShares ? formatShares(userShares) : "0"}</div>
        </div>
        <div className="bg-slate-950/50 border border-white/5 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Your Value</div>
          <div className="text-2xl font-bold text-white">{calculateUserValue()} ETH</div>
        </div>
        <div className="bg-slate-950/50 border border-white/5 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Wallet Balance</div>
          <div className="text-2xl font-bold text-white">{ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : "0"} ETH</div>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-white">Deposit</h3>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-300">Privacy Mode: Proven via ZK without revealing exact amount</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Amount (ETH)</label>
            <input
              type="number"
              step="0.001"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="0.01"
              className="w-full px-4 py-2 bg-slate-950/50 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-slate-600"
            />
            <p className="text-xs text-slate-500 mt-1">Minimum: 0.001 ETH</p>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-300">{error}</div>}
          {isSuccess && depositHash && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-300 font-medium mb-2">Success</p>
              <a href={"https://sepolia.basescan.org/tx/" + depositHash} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300">
                View tx
              </a>
            </div>
          )}
          <button
            onClick={handleDeposit}
            disabled={isGeneratingProof || isPending}
            className="w-full px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold text-white shadow-lg shadow-green-500/20 transition-all duration-300"
          >
            {isGeneratingProof ? "Generating Proof..." : isPending ? "Depositing..." : "Deposit with ZK Proof"}
          </button>
        </div>
      </div>
      {hasShares && (
        <div className="pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold mb-3 text-white">Withdraw</h3>
          <div className="bg-slate-950/50 border border-white/5 rounded-lg p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-400">Shares</span>
              <span className="font-bold text-white">{formatShares(userShares)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Value</span>
              <span className="font-bold text-white">{calculateUserValue()} ETH</span>
            </div>
          </div>
          <button
            onClick={handleWithdraw}
            disabled={isPending}
            className="w-full px-6 py-3 bg-linear-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 disabled:from-slate-700 disabled:to-slate-700 rounded-lg font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300"
          >
            Withdraw All
          </button>
        </div>
      )}
    </div>
  );
}
