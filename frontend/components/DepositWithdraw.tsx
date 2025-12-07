'use client';
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useBalance } from 'wagmi';
import { CONTRACTS, STRATEGY_VAULT_ABI } from '@/lib/contracts';
import { parseEther, formatEther } from 'viem';
import { generateBalanceProof, formatProofForContract } from '@/lib/zk-proof';

export function DepositWithdraw() {
  const { address } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const TESTNET_MIN = parseEther('0.001');
  const { data: ethBalance } = useBalance({ address });
  const { data: userShares, refetch: refetchShares } = useReadContract({
    address: CONTRACTS.strategyVault,
    abi: STRATEGY_VAULT_ABI,
    functionName: 'shares',
    args: address ? [address] : undefined,
  });
  const { data: totalShares } = useReadContract({
    address: CONTRACTS.strategyVault,
    abi: STRATEGY_VAULT_ABI,
    functionName: 'totalShares',
  });
  const { data: tvl } = useReadContract({
    address: CONTRACTS.strategyVault,
    abi: STRATEGY_VAULT_ABI,
    functionName: 'totalValueLocked',
  });
  const { writeContract, data: depositHash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: depositHash });

  const handleDeposit = async () => {
    if (!depositAmount) return;
    const amount = parseEther(depositAmount);
    if (amount < TESTNET_MIN) {
      setError('Minimum: 0.001 ETH');
      return;
    }
    try {
      setIsGeneratingProof(true);
      setError(null);
      const proofResult = await generateBalanceProof(ethBalance?.value || 0n, TESTNET_MIN);
      const formattedProof = formatProofForContract(proofResult.proof);
      writeContract({
        address: CONTRACTS.strategyVault,
        abi: STRATEGY_VAULT_ABI,
        functionName: 'deposit',
        args: [formattedProof.a, formattedProof.b, formattedProof.c, BigInt(proofResult.commitment)],
        value: amount,
      });
    } catch (err: any) {
      setError(err.message);
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
        functionName: 'withdraw',
        args: [userShares],
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const calculateUserValue = (): string => {
    if (!userShares || !totalShares || !tvl || totalShares === 0n) return '0';
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
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold mb-4">Deposit & Withdraw</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Your Shares</div>
          <div className="text-2xl font-bold">{userShares ? formatShares(userShares) : '0'}</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Your Value</div>
          <div className="text-2xl font-bold">{calculateUserValue()} ETH</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Wallet Balance</div>
          <div className="text-2xl font-bold">
            {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : '0'} ETH
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Deposit</h3>
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-300">Privacy Mode: Proven via ZK without revealing exact amount</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount (ETH)</label>
            <input type="number" step="0.001" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="0.01" className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500" />
            <p className="text-xs text-gray-500 mt-1">Minimum: 0.001 ETH</p>
          </div>
          {error && <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-sm text-red-300">{error}</div>}
          {isSuccess && depositHash && <div className="bg-green-900/20 border border-green-700 rounded-lg p-4"><p className="text-green-300 font-medium mb-2">Success</p><a href={'https://sepolia.basescan.org/tx/' + depositHash} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400">View tx</a></div>}
          <button onClick={handleDeposit} disabled={isGeneratingProof || isPending} className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold">{isGeneratingProof ? 'Generating Proof...' : isPending ? 'Depositing...' : 'Deposit with ZK Proof'}</button>
        </div>
      </div>
      {hasShares && <div className="pt-6 border-t border-gray-700"><h3 className="text-lg font-semibold mb-3">Withdraw</h3><div className="bg-gray-900 rounded-lg p-4 mb-4"><div className="flex justify-between mb-2"><span className="text-sm text-gray-400">Shares</span><span className="font-bold">{formatShares(userShares)}</span></div><div className="flex justify-between"><span className="text-sm text-gray-400">Value</span><span className="font-bold">{calculateUserValue()} ETH</span></div></div><button onClick={handleWithdraw} disabled={isPending} className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 rounded-lg font-semibold">Withdraw All</button></div>}
    </div>
  );
}
