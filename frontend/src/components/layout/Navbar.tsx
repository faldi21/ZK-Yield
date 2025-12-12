'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { MagneticButton } from '@/components/ui/MagneticButton';

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How it Works', href: '#how-it-works' },
  { name: 'Docs', href: 'https://docs.zk-yield.io' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <>
      <motion.nav
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed z-50 flex items-center transition-all duration-500
          ${isScrolled 
            // --- MODE KAPSUL (SCROLLED) ---
            // 1. bg-black/50: Lebih transparan (50%) agar efek kaca terasa
            // 2. backdrop-blur-md: Efek blur yang diminta
            // 3. border border-white/10: Garis tepi tipis halus
            // 4. shadow-none: TIDAK ADA shadow ungu
            ? 'top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[650px] h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/10 px-4' 
            
            // --- MODE NORMAL (TOP) ---
            : 'top-0 left-0 w-full h-24 bg-transparent border-b border-transparent px-6 md:px-12'
          }`}
      >
        <div className="flex items-center justify-between w-full h-full">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* Ikon Logo */}
            <div className={`flex items-center justify-center rounded-lg transition-all duration-500
              ${isScrolled ? 'w-8 h-8 bg-transparent' : 'w-8 h-8 bg-linear-to-br from-primary to-border shadow-lg'}`}>
               <span className={`font-bold ${isScrolled ? 'text-primary text-xl' : 'text-white text-sm'}`}>ZK</span>
            </div>
            
            <span className="text-lg font-bold tracking-tight text-[#F8FAFC] font-display">
              ZK-Yield
            </span>
          </Link>

          {/* LINKS (Desktop) */}
          <div className={`hidden md:flex items-center gap-6 transition-all duration-500
            ${isScrolled ? 'ml-auto mr-4' : 'absolute left-1/2 -translate-x-1/2'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#94A3B8] hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="md:hidden text-[#F8FAFC]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 top-0 left-0 h-screen w-screen bg-background z-40 flex flex-col items-center justify-center gap-8 md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-[#F8FAFC]"
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </>
  );
}