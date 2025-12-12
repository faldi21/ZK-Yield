'use client';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { motion } from 'framer-motion';

export function FinalCTA() {
  return (
    <section className="py-40 px-6 relative overflow-hidden bg-background flex flex-col items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#3B82F6]/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight"
        >
          Ready to Earn <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#8B5CF6] via-[#D8B4FE] to-[#3B82F6] animate-gradient-x">
            Privately?
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-[#94A3B8] mb-12 max-w-2xl mx-auto leading-relaxed"
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
          <MagneticButton href="/dashboard" className="px-10 py-5 text-lg md:text-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/25 border-t border-white/20">
            Launch App Now
          </MagneticButton>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-16">
          <StatItem label="Network" value="Mantle Sepolia" color="text-[#3B82F6]" />
          <StatItem label="Gas / TX" value="< $0.01" color="text-[#A855F7]" />
          <StatItem label="Security" value="ZK-Proof" color="text-[#3B82F6]" />
          <StatItem label="Status" value="Live Beta" color="text-[#A855F7]" />
        </div>
      </div>
    </section>
  );
}

function StatItem({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="text-center group cursor-default">
      <div className={`text-2xl md:text-3xl font-bold text-[#F8FAFC] mb-2 group-hover:scale-110 transition-transform duration-300`}>
        {value}
      </div>
      <div className={`text-xs font-mono uppercase tracking-[0.2em] opacity-60 ${color}`}>
        {label}
      </div>
    </div>
  );
}