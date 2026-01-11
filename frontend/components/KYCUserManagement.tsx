// components/KYCUserManagement.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePublicClient, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACTS, getExplorerUrl } from '@/lib/contracts';
import ComplianceManagerV2ABI from '@/lib/abis/ComplianceManagerV2.json';

interface KYCUser {
  address: `0x${string}`;
  isCompliant: boolean;
}

export function KYCUserManagement() {
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<KYCUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokingAddress, setRevokingAddress] = useState<string | null>(null);
  
  const publicClient = usePublicClient();
  const { address: connectedAddress } = useAccount();
  
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch KYC users from events
  useEffect(() => {
    async function fetchKYCUsers() {
      if (!publicClient || !mounted) return;
      
      setIsLoading(true);
      try {
        // Get current block number
        const currentBlock = await publicClient.getBlockNumber();
        
        // Mantle Sepolia RPC limits to 10,000 block range
        // We'll fetch in chunks and combine results
        const BLOCK_RANGE = 9999n; // Just under 10k to be safe
        const MAX_CHUNKS = 10; // Fetch up to 100k blocks total
        
        console.log('ComplianceManager address:', CONTRACTS.complianceManager);
        console.log('Current block:', currentBlock.toString());
        
        const userStatusMap = new Map<string, boolean>();
        
        // Fetch in chunks from recent to older
        for (let i = 0; i < MAX_CHUNKS; i++) {
          const toBlock = currentBlock - (BigInt(i) * BLOCK_RANGE);
          const fromBlock = toBlock > BLOCK_RANGE ? toBlock - BLOCK_RANGE : 0n;
          
          if (toBlock <= 0n) break;
          
          console.log(`Fetching chunk ${i + 1}: blocks ${fromBlock} to ${toBlock}`);
          
          try {
            const logs = await publicClient.getLogs({
              address: CONTRACTS.complianceManager as `0x${string}`,
              event: {
                type: 'event',
                name: 'UserCompliant',
                inputs: [
                  { type: 'address', name: 'user', indexed: true },
                  { type: 'bool', name: 'status', indexed: false },
                ],
              },
              fromBlock,
              toBlock,
            });

            console.log(`Chunk ${i + 1}: Found ${logs.length} events`);

            // Process logs (older events first, newer events override)
            for (const log of logs) {
              const userAddress = log.args.user as `0x${string}`;
              const status = log.args.status as boolean;
              // Only update if this is a newer event (higher block)
              userStatusMap.set(userAddress.toLowerCase(), status);
            }
            
            // If we found events, we might have all we need
            // Continue a bit more to ensure we have the full picture
          } catch (chunkError) {
            console.warn(`Error fetching chunk ${i + 1}:`, chunkError);
            // Continue with other chunks
          }
          
          if (fromBlock === 0n) break; // We've reached the beginning
        }

        // Convert to array, only include currently compliant users
        const compliantUsers: KYCUser[] = [];
        for (const [address, isCompliant] of userStatusMap) {
          if (isCompliant) {
            compliantUsers.push({
              address: address as `0x${string}`,
              isCompliant: true,
            });
          }
        }
        
        console.log('Total compliant users found:', compliantUsers.length);

        setUsers(compliantUsers);
      } catch (error) {
        console.error('Error fetching KYC users:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchKYCUsers();
  }, [publicClient, mounted, isSuccess]); // Re-fetch when tx succeeds

  // Handle revoke KYC
  const handleRevoke = async (userAddress: `0x${string}`) => {
    setRevokingAddress(userAddress);
    try {
      writeContract({
        address: CONTRACTS.complianceManager as `0x${string}`,
        abi: ComplianceManagerV2ABI.abi,
        functionName: 'removeCompliantUser',
        args: [userAddress],
      });
    } catch (error) {
      console.error('Error revoking KYC:', error);
      setRevokingAddress(null);
    }
  };

  // Reset revoking state on success
  useEffect(() => {
    if (isSuccess) {
      setRevokingAddress(null);
    }
  }, [isSuccess]);

  if (!mounted) return null;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
            <span>🔐</span> KYC Compliant Users
          </h3>
          <span className="text-sm text-muted-foreground">
            {users.length} user{users.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full mb-2" />
          <p>Loading KYC users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <p>No KYC compliant users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left bg-muted/10">
                <th className="py-3 px-4 font-semibold text-muted-foreground">#</th>
                <th className="py-3 px-4 font-semibold text-muted-foreground">Address</th>
                <th className="py-3 px-4 font-semibold text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users.map((user, index) => {
                const isRevoking = revokingAddress?.toLowerCase() === user.address.toLowerCase();
                const isCurrentUser = connectedAddress?.toLowerCase() === user.address.toLowerCase();
                
                return (
                  <tr key={user.address} className="hover:bg-muted/10 transition-colors">
                    <td className="py-3 px-4 text-muted-foreground">{index + 1}</td>
                    <td className="py-3 px-4 font-mono">
                      <a 
                        href={getExplorerUrl(user.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {user.address.slice(0, 6)}...{user.address.slice(-4)}
                      </a>
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-green-400">
                        <span className="w-2 h-2 bg-green-400 rounded-full" />
                        Verified
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <button
                        onClick={() => handleRevoke(user.address)}
                        disabled={isRevoking || isPending || isConfirming}
                        className="px-3 py-1.5 text-sm bg-destructive/20 text-destructive border border-destructive/30 rounded-md hover:bg-destructive/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRevoking && (isPending || isConfirming) ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
                            {isPending ? 'Confirm...' : 'Revoking...'}
                          </span>
                        ) : (
                          'Revoke KYC'
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {isSuccess && (
        <div className="p-4 bg-green-500/10 border-t border-green-500/20 text-green-400 text-sm">
          ✓ KYC status revoked successfully. User can now re-verify their KYC.
        </div>
      )}
    </div>
  );
}
