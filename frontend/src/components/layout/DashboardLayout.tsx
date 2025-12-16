// src/components/layout/DashboardLayout.tsx
'use client';

import { DashboardHeader } from './DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-secondary">
      {/* Header (sudah termasuk sub navigation) */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}