'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-32 px-6 relative overflow-hidden bg-background flex flex-col items-center justify-center min-h-[80vh]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#8B5CF6]/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
        >
          Ready to Earn <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#A78BFA] via-[#C4B5FD] to-[#60A5FA]">
             Privately?
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-[#94A3B8] mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Bergabung dengan 1,247 pengguna lain yang sudah mengamankan aset mereka dengan teknologi Zero-Knowledge.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mb-24"
        >
          <Link 
            href="/dashboard" 
            className="px-8 py-4 rounded-full text-base font-medium border border-[#D8B4FE] bg-transparent text-white transition-all duration-300 group hover:bg-white/10 flex items-center justify-center gap-2"
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
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-12 md:pt-16">
          <StatItem label="NETWORK" value="Mantle Sepolia" />
          <StatItem label="GAS" value="< $0.01" />
          <StatItem label="SECURITY" value="ZK-Proof" />
          <StatItem label="STATUS" value="Live Beta" />
        </div>
      </div>
    </section>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center group cursor-default">
      <div className="text-[10px] md:text-xs font-bold font-mono uppercase tracking-[0.15em] text-[#D8B4FE] mb-2">
        {label}
      </div>
      <div className="text-xl md:text-2xl font-bold text-white group-hover:text-[#F1F7F6] transition-colors">
        {value}
      </div>
    </div>
  );
}