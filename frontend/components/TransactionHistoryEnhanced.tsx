// components/TransactionHistoryEnhanced.tsx
'use client';

import { useAccount, usePublicClient } from 'wagmi';
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';
import { CONTRACTS } from '@/lib/contracts';
import VaultV2ABI from '@/lib/abis/StrategyVaultV2_Multi.json';
import { format } from 'date-fns';

interface Transaction {
  type: 'deposit' | 'withdraw' | 'harvest' | 'allocate';
  amount: string;
  timestamp: number;
  txHash: string;
  strategy?: string;
  user?: string;
}

type FilterType = 'all' | 'deposit' | 'withdraw' | 'harvest' | 'allocate';

interface TransactionHistoryEnhancedProps {
  showAll?: boolean;
}

export function TransactionHistoryEnhanced({ showAll = false }: TransactionHistoryEnhancedProps) {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const publicClient = usePublicClient();
  
  useEffect(() => {
    if (isConnected || showAll) {
      loadHistory();
    }
  }, [isConnected, address, showAll]);
  
  // Fetch logs in chunks to avoid RPC block range limits (10k max for Mantle)
  const fetchLogsInChunks = async (
    eventConfig: any,
    currentBlock: bigint
  ): Promise<any[]> => {
    const BLOCK_RANGE = 9999n;
    const MAX_CHUNKS = 5; // Fetch last ~50k blocks
    const allLogs: any[] = [];
    
    for (let i = 0; i < MAX_CHUNKS; i++) {
      const toBlock = currentBlock - (BigInt(i) * BLOCK_RANGE);
      const fromBlock = toBlock > BLOCK_RANGE ? toBlock - BLOCK_RANGE : 0n;
      
      if (toBlock <= 0n) break;
      
      try {
        const logs = await publicClient?.getLogs({
          ...eventConfig,
          fromBlock,
          toBlock,
        });
        if (logs) allLogs.push(...logs);
      } catch (error) {
        console.warn(`Error fetching chunk ${i + 1}:`, error);
      }
      
      if (fromBlock === 0n) break;
    }
    
    return allLogs;
  };
  
  const loadHistory = async () => {
    try {
      setLoading(true);
      
      if (!publicClient) {
        setLoading(false);
        return;
      }
      
      const currentBlock = await publicClient.getBlockNumber();
      
      // Get all events using chunked fetching
      const depositLogs = await fetchLogsInChunks({
        address: CONTRACTS.strategyVault as `0x${string}`,
        event: {
          name: 'Deposited',
          type: 'event',
          inputs: [
            { type: 'address', indexed: true, name: 'user' },
            { type: 'uint256', indexed: false, name: 'amount' },
            { type: 'uint256', indexed: false, name: 'shares' },
            { type: 'uint256', indexed: false, name: 'timestamp' },
          ],
        },
      }, currentBlock);
      
      const withdrawLogs = await fetchLogsInChunks({
        address: CONTRACTS.strategyVault as `0x${string}`,
        event: {
          name: 'Withdrawn',
          type: 'event',
          inputs: [
            { type: 'address', indexed: true, name: 'user' },
            { type: 'uint256', indexed: false, name: 'amount' },
            { type: 'uint256', indexed: false, name: 'shares' },
            { type: 'uint256', indexed: false, name: 'timestamp' },
          ],
        },
      }, currentBlock);
      
      const harvestLogs = await fetchLogsInChunks({
        address: CONTRACTS.strategyVault as `0x${string}`,
        event: {
          name: 'YieldHarvested',
          type: 'event',
          inputs: [
            { type: 'uint256', indexed: true, name: 'strategyIndex' },
            { type: 'uint256', indexed: false, name: 'amount' },
            { type: 'uint256', indexed: false, name: 'timestamp' },
          ],
        },
      }, currentBlock);
      
      const strategies = ['Aave', 'Uniswap', 'Lido'];
      
      // Format transactions
      const deposits: Transaction[] = (depositLogs || [])
        .filter((log: any) => showAll || log.args.user?.toLowerCase() === address?.toLowerCase())
        .map((log: any) => ({
          type: 'deposit' as const,
          amount: formatEther(log.args.amount || 0n),
          timestamp: Number(log.args.timestamp || 0n),
          txHash: log.transactionHash || '',
          user: log.args.user,
        }));
      
      const withdraws: Transaction[] = (withdrawLogs || [])
        .filter((log: any) => showAll || log.args.user?.toLowerCase() === address?.toLowerCase())
        .map((log: any) => ({
          type: 'withdraw' as const,
          amount: formatEther(log.args.amount || 0n),
          timestamp: Number(log.args.timestamp || 0n),
          txHash: log.transactionHash || '',
          user: log.args.user,
        }));
      
      const harvests: Transaction[] = (harvestLogs || [])
        .map((log: any) => ({
          type: 'harvest' as const,
          amount: formatEther(log.args.amount || 0n),
          timestamp: Number(log.args.timestamp || 0n),
          txHash: log.transactionHash || '',
          strategy: strategies[Number(log.args.strategyIndex || 0)],
        }));
      
      // Combine and sort
      const allTxs = [...deposits, ...withdraws, ...harvests]
        .sort((a, b) => b.timestamp - a.timestamp);
      
      setTransactions(allTxs);
      setLoading(false);
    } catch (error) {
      console.error('Error loading history:', error);
      setLoading(false);
    }
  };
  
  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.type === filter;
    const matchesSearch = searchTerm === '' || 
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.strategy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (showAll && tx.user?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });
  
  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Type', 'Amount (MNT)', 'Strategy', 'User', 'Date', 'Time', 'Transaction Hash'];
    const rows = filteredTransactions.map(tx => [
      tx.type,
      tx.amount,
      tx.strategy || 'N/A',
      tx.user || 'N/A',
      format(new Date(tx.timestamp * 1000), 'yyyy-MM-dd'),
      format(new Date(tx.timestamp * 1000), 'HH:mm:ss'),
      tx.txHash,
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${Date.now()}.csv`;
    a.click();
  };
  
  if (!isConnected) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 text-center">
        <p className="text-muted-foreground">Connect wallet to see transaction history</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-secondary rounded w-1/3"></div>
          <div className="h-12 bg-secondary rounded"></div>
          <div className="h-12 bg-secondary rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
          <p className="text-sm text-muted-foreground">{filteredTransactions.length} transactions</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={loadHistory}
            className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors text-foreground"
          >
            🔄 Refresh
          </button>
          <button 
            onClick={exportToCSV}
            disabled={filteredTransactions.length === 0}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:brightness-110 disabled:opacity-50 transition-colors"
          >
            📥 Export CSV
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Type Filter */}
        <div className="flex gap-2">
          {(['all', 'deposit', 'withdraw', 'harvest'] as FilterType[]).map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors capitalize ${
                filter === type
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-muted-foreground hover:bg-secondary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        
        {/* Search */}
        <input
          type="text"
          placeholder={showAll ? "Search by hash, strategy, or user..." : "Search by hash or strategy..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
        />
      </div>
      
      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">No transactions found</p>
          <p className="text-sm text-muted-foreground/60">
            {filter !== 'all' ? 'Try changing the filter' : 'Your transactions will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((tx, idx) => (
            <div 
              key={`${tx.txHash}-${idx}`}
              className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors border border-border/50"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  tx.type === 'deposit' ? 'bg-green-500/20 text-green-500' :
                  tx.type === 'withdraw' ? 'bg-red-500/20 text-red-500' :
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  {tx.type === 'deposit' ? '↓' : tx.type === 'withdraw' ? '↑' : '💰'}
                </div>
                
                {/* Details */}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium capitalize text-foreground">{tx.type}</p>
                    {tx.strategy && (
                      <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded">
                        {tx.strategy}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(tx.timestamp * 1000), 'MMM dd, yyyy HH:mm:ss')}
                    </p>
                    {showAll && tx.user && (
                      <p className="text-xs text-muted-foreground font-mono">
                        User: {tx.user.slice(0, 6)}...{tx.user.slice(-4)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Amount & Link */}
              <div className="text-right">
                <p className={`font-semibold ${
                  tx.type === 'deposit' ? 'text-green-500' :
                  tx.type === 'withdraw' ? 'text-red-500' :
                  'text-blue-500'
                }`}>
                  {tx.type === 'deposit' ? '+' : tx.type === 'withdraw' ? '-' : '+'}{parseFloat(tx.amount).toFixed(6)} MNT
                </p>
                <a 
                  href={`https://sepolia.mantlescan.xyz/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
