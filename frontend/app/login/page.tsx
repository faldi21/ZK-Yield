'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@/components/ConnectButton';
import { ADMIN_ADDRESS } from '@/lib/contracts';

export default function LoginPage() {
  const { isConnected, address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && address) {
      if (address.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isConnected, address, router]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,255,163,0.3)]">
             <span className="text-primary-foreground font-bold text-4xl">Z</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect your wallet to access the dashboard
          </p>
        </div>

        <div className="p-8 bg-card border border-border rounded-xl shadow-lg flex flex-col items-center gap-6">
          <ConnectButton />
          <p className="text-xs text-muted-foreground">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}
