// src/components/layout/DashboardHeader.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

interface DashboardHeaderProps {
  isVerified?: boolean;
}

interface NavItem {
  name: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Vaults', href: '/' },
  { name: 'Portfolio', href: '/' },
  { name: 'Analytics', href: '/' },
];

export function DashboardHeader({ 
  isVerified = true,
}: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/putih.png" 
                    alt="Viegel Logo" 
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Viegel
                </span>
              </Link>
              
              {/* Vertical separator */}
              <div className="hidden md:block h-6 w-px bg-gray-300 dark:bg-gray-700" />
  
              {/* Navigation Menu - Desktop */}
              <div className="hidden md:flex items-center gap-8">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-sm font-medium transition-colors duration-200 group relative ${
                        isActive 
                          ? 'text-gray-900 dark:text-white'  // Warna saat aktif = warna hover
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="relative">
                        {item.name}
                        {/* Garis bawah untuk hover dan aktif */}
                        <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gray-100 transform transition-transform duration-300 ${
                          isActive 
                            ? 'scale-x-100'  // Garis bawah penuh saat aktif
                            : 'scale-x-0 group-hover:scale-x-100 origin-left'  // Muncul saat hover
                        }`}></span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              
              {/* Verification Badge */}
              {isVerified && (
                <div className="px-3 py-1.5 bg-success/10 border border-success/30 rounded-full flex items-center gap-2">
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">Verified</span>
                </div>
              )}

              {/* RainbowKit Connect Button */}
              <ConnectButton 
                showBalance={false}
                chainStatus="none"
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Sub Navigation untuk mobile */}
      <div className="sticky top-16 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 md:hidden">
        <div className="container mx-auto px-6">
          <nav className="flex gap-6 text-sm overflow-x-auto whitespace-nowrap scrollbar-none py-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium pb-2 border-b-2 transition-all duration-200 ${
                    isActive
                      ? 'text-blue-500 border-blue-500'
                      : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-500 hover:border-gray-500'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}