'use client';
import Link from 'next/link';
import Image from 'next/image'; 
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowRight, Menu, X, ArrowUpRight } from 'lucide-react';

const navLinks = [
  { name: 'Whitepapers', href: '/' },
  { name: 'Docs', href: '/' },
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
            ? 'top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[650px] h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/10 px-4' 
            : 'top-0 left-0 w-full h-24 bg-transparent border-b border-transparent px-6 md:px-12'
          }`}
      >
        <div className="flex items-center justify-between w-full h-full">
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`flex items-center justify-center rounded-lg transition-all duration-500
              ${isScrolled ? 'w-8 h-8 bg-transparent' : 'w-10 h-10 bg-transparent'}`}>
              <Image 
                src="/putih.png" 
                alt="V Logo" 
                width={isScrolled ? 24 : 32} 
                height={isScrolled ? 24 : 32} 
                className="transition-all duration-500"
              />
            </div>
          </Link>

          <div className="flex items-center gap-4 ml-auto"> 
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="hidden md:block text-sm font-medium text-[#94A3B8] hover:text-white transition-colors group"
              >
                <span className="relative pb-0.5">
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-px bg-white transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-left"></span>
                </span>
              </Link>
            ))}

            {!isScrolled && (
              <Link 
                href="/dashboard" 
                className="px-4 py-2 rounded-full text-base font-medium border border-[#D8B4FE] bg-transparent text-white transition-all duration-300 group hover:bg-white/10 flex items-center justify-center gap-2"
              >
                <span className="relative pb-0.5">
                  Launch App
                  <span className="absolute bottom-0 left-0 w-full h-px bg-white transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-left"></span>
                </span>
                
                <span className="relative h-[18px] w-[18px] overflow-hidden"> 
                  <ArrowRight 
                    size={18} 
                    className="absolute top-0 left-0 transition-all duration-300 opacity-100 group-hover:opacity-0 group-hover:translate-x-4" 
                  />
                  <ArrowUpRight 
                    size={18} 
                    className="absolute top-0 left-0 transition-all duration-300 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0" 
                  />
                </span>
              </Link>
            )}
            
            <button 
              className="md:hidden text-[#F8FAFC]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

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