'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowUpRight, Layers, Lock, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';

// Data protokol dengan ikon spesifik
const protocols = [
  { 
    name: 'Aave V3', 
    apy: '4.5%', 
    tvl: '$1.2B', 
    type: 'Lending', 
    icon: <Layers size={20} className="text-blue-400" />,
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
  },
  { 
    name: 'Lido', 
    apy: '3.8%', 
    tvl: '$8.5B', 
    type: 'Staking', 
    icon: <Lock size={20} className="text-cyan-400" />,
    color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
  },
  { 
    name: 'Uniswap V3', 
    apy: '12.5%', 
    tvl: '$45M', 
    type: 'LP Pools', 
    icon: <Repeat size={20} className="text-purple-400" />,
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
  },
];

// Konfigurasi Animasi (Framer Motion)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2 // Delay 0.2 detik antar kartu
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function ProtocolShowcase() {
  return (
    <section className="py-32 bg-background relative">
      
      {/* Background Glow Halus */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B5CF6]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#F1F7F6] mb-3">
              Integrated Protocols
            </h2>
            <p className="text-[#94A3B8] text-lg max-w-xl">
              Maximizing yields through institutional-grade strategies directly from top-tier DeFi protocols.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[#8B5CF6] hover:text-[#7C3AED] font-bold flex items-center gap-2 group transition-colors"
          >
            View All Strategies 
            <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Grid Kartu dengan Animasi Stagger */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }} // Animasi mulai saat elemen masuk 100px ke layar
          className="grid md:grid-cols-3 gap-6"
        >
          {protocols.map((p, i) => (
            <motion.div key={i} variants={itemVariants as any}>
              <GlassCard className="group cursor-pointer min-h-[260px] flex flex-col justify-between hover:bg-[#8B5CF6]/5 hover:border-[#8B5CF6]/30 transition-all duration-300">
                
                {/* Bagian Atas: Badge Tipe & Ikon Panah */}
                <div className="flex justify-between items-start">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-medium ${p.color}`}>
                    {p.icon}
                    {p.type}
                  </div>
                  <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#8B5CF6] group-hover:text-white transition-all">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
                
                {/* Bagian Tengah: Nama Protokol */}
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-[#F1F7F6] mb-1 group-hover:text-[#8B5CF6] transition-colors">
                    {p.name}
                  </h3>
                </div>

                {/* Bagian Bawah: Stats (APY & TVL) */}
                <div className="flex justify-between items-end border-t border-white/10 pt-6 mt-6">
                  <div>
                    <div className="text-[#94A3B8] text-[10px] uppercase tracking-wider mb-1 font-semibold">
                      Variable APY
                    </div>
                    {/* Menggunakan Gradient Text untuk Angka APY agar menonjol tapi tidak hijau neon */}
                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#3B82F6] to-[#06B6D4]">
                      {p.apy}
                    </div> 
                  </div>
                  <div className="text-right">
                    <div className="text-[#94A3B8] text-[10px] uppercase tracking-wider mb-1 font-semibold">
                      Total Value Locked
                    </div>
                    <div className="text-xl font-bold text-[#F1F7F6]">
                      {p.tvl}
                    </div>
                  </div>
                </div>

              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}