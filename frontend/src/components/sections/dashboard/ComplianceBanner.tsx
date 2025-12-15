// src/components/dashboard/ComplianceBanner.tsx
import { AlertTriangle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function ComplianceBanner() {
  return (
    <div className="bg-bg-surface border border-error/30 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <AlertTriangle size={20} className="text-error shrink-0"/>
        <p className="text-text-secondary text-sm font-medium">
          Complete KYC verification to unlock deposit functionality
        </p>
      </div>
      <Link href="/verify" className="px-4 py-2 bg-accent hover:bg-accent-hover text-text-primary font-semibold rounded-md text-sm transition-all duration-base shrink-0 cursor-pointer">
        Verify Now <ArrowUpRight size={14} className="inline ml-1 "/>
      </Link>
    </div>
  );
}