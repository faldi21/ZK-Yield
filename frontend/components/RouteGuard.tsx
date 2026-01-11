'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ADMIN_ADDRESS } from '@/lib/contracts';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function RouteGuard({ children, requireAdmin = false }: RouteGuardProps) {
  const { address, isConnected, isConnecting } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Wait for connection initialization
    if (isConnecting) return;

    if (!isConnected) {
      if (pathname !== '/login') {
        router.push('/login');
      }
      return;
    }

    if (isConnected && address) {
      const isAdmin = address.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

      // Logic for Admin Page Access
      if (requireAdmin) {
        if (!isAdmin) {
          router.push('/dashboard');
        } else {
          setIsAuthorized(true);
        }
        return;
      }

      // Logic for Dashboard Access (Non-Admin Route)
      if (isAdmin && pathname?.startsWith('/dashboard')) {
        router.push('/admin');
        return;
      }

      setIsAuthorized(true);
    }
  }, [isConnected, isConnecting, address, router, requireAdmin, pathname]);

  if (isConnecting || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

export function isUserAdmin(address?: string): boolean {
    if (!address) return false;
    return address.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
}
