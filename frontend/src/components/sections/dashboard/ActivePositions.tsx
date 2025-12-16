// src/components/dashboard/ActivePositions.tsx
'use client';
import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { Position, TabType } from '@/lib/types/dashboard';

interface ActivePositionsProps {
  positions: Position[];
}

export function ActivePositions({ positions }: ActivePositionsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('positions');

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1 bg-bg-elevated p-1 rounded-md">
          <h2 className="text-lg font-bold text-text-primary">
            Your positions
          </h2>
        </div>
        <h2 className="text-lg font-bold text-text-primary">
          Earn Positions ({positions.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left text-xs uppercase tracking-wider text-text-tertiary font-semibold py-3 px-2">Vault</th>
              <th className="text-right text-xs uppercase tracking-wider text-text-tertiary font-semibold py-3 px-2">Deposits</th>
              <th className="text-right text-xs uppercase tracking-wider text-text-tertiary font-semibold py-3 px-2">Net APY</th>
              <th className="text-right text-xs uppercase tracking-wider text-text-tertiary font-semibold py-3 px-2">Earned</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, idx) => (
              <tr key={idx} className="border-b border-border-subtle hover:bg-bg-elevated transition-colors">
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                      <Wallet size={16} className="text-accent"/>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{position.protocol} {position.name}</p>
                      <p className="text-xs text-text-tertiary">{position.network} • {position.collateral}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <p className="text-sm font-medium text-text-primary">
                    ${position.deposited.toLocaleString()}
                  </p>
                  <p className="text-xs text-text-tertiary">{position.collateral}</p>
                </td>
                <td className="py-4 px-2 text-right">
                  <p className="text-sm font-bold text-success">{position.apy}%</p>
                </td>
                <td className="py-4 px-2 text-right">
                  <p className="text-sm font-medium text-text-primary">
                    ${position.earned.toFixed(2)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}