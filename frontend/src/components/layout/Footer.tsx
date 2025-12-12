'use client';

import Link from 'next/link';
import { Github, Twitter, Disc } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-background py-12 overflow-hidden">
      
      {/* 1. Ambient Glow Effect (Opsional: Memberi nuansa ungu tipis di belakang) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* LOGO */}
          <div className="flex items-center gap-3">
            {/* Kotak Logo: Gradasi Ungu + Shadow Halus */}
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-border flex items-center justify-center shadow-lg shadow-purple-500/20">
               <span className="font-bold text-white text-sm">ZK</span>
            </div>
            <span className="text-xl font-bold text-[#F8FAFC] tracking-tight">ZK-Yield</span>
          </div>

          {/* NAV LINKS */}
          <div className="flex gap-8 text-sm font-medium text-[#94A3B8]">
            <Link href="/dashboard" className="hover:text-primary transition-colors duration-300">
              Dashboard
            </Link>
            <Link href="https://docs.zk-yield.io" className="hover:text-primary transition-colors duration-300">
              Docs
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors duration-300">
              About
            </Link>
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex gap-3">
            {/* Helper Component untuk Icon agar kodenya rapi */}
            <SocialLink href="#" icon={<Twitter size={18} />} />
            <SocialLink href="#" icon={<Github size={18} />} />
            {/* Jika ingin menambah Discord */}
            {/* <SocialLink href="#" icon={<Disc size={18} />} /> */}
          </div>
        </div>
        
        {/* COPYRIGHT */}
        <div className="border-t border-white/5 mt-10 pt-8 text-center">
          <p className="text-[#94A3B8]/60 text-sm">
            © 2025 ZK-Yield. Built for Mantle Global Hackathon.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Komponen Kecil untuk Tombol Sosial Media
function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="p-2.5 rounded-lg bg-white/5 text-[#94A3B8] border border-white/5 
                 hover:bg-primary hover:text-white hover:border-primary hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30 
                 transition-all duration-300 ease-out"
    >
      {icon}
    </a>
  );
}