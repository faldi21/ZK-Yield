'use client';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const protocols = [
  { name: 'AAVE', apy: '4.5%', tvl: '$1.2B', image: '/aave.png' },
  { name: 'UNISWAP', apy: '12.5%', tvl: '$45 B', image: '/uni.png' },
  { name: 'LIDO', apy: '3.8%', tvl: '$8.5B', image: '/lido.png' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
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
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#F1F7F6] mb-4">
              Integrated Protocols
            </h2>
            <p className="text-[#94A3B8] text-lg max-w-xl leading-relaxed">
              Maximizing yields through institutional-grade strategies directly from top-tier DeFi protocols.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[#8B5CF6] hover:text-[#7C3AED] font-bold flex items-center gap-2 group transition-colors px-4 py-2 rounded-lg hover:bg-[#8B5CF6]/5"
          >
            View All Strategies 
            <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {protocols.map((p, i) => (
            <motion.div key={i} variants={itemVariants as any}>
              <GlassCard className="relative group cursor-pointer h-[260px] overflow-hidden hover:bg-white/5 transition-all duration-500 border border-white/10 hover:border-white/20">
                <div 
                  className="absolute inset-0 rounded-xl border border-white/40 pointer-events-none z-20" 
                  style={{ 
                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 50%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 50%)'
                  }}
                />

                <div className="absolute top-0 left-0 h-full w-[50%] z-10 flex items-center justify-center p-2">
                  <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-105">
                    <Image 
                      src={p.image} 
                      alt={p.name}
                      fill
                      className="object-contain scale-[1.4] -translate-x-10 drop-shadow-2xl" 
                      priority={i < 2}
                    />
                  </div>
                </div>

                <div className="absolute top-0 right-0 h-full w-[50%] flex flex-col justify-between p-6 z-20">
                  <div className="flex flex-col items-end">
                    <div className="p-2 rounded-full bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white transition-all mb-4 border border-white/5 shadow-lg">
                      <ArrowUpRight size={18} />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-white uppercase text-right drop-shadow-md">
                      {p.name}
                    </h3>
                    <div className="w-full h-[1px] bg-white/10 mt-4"></div>
                  </div>

                  <div className="flex justify-between items-end mt-auto w-full gap-2">
                    <div className="flex flex-col items-start">
                      <div className="text-[#94A3B8] text-[9px] uppercase tracking-wider font-semibold mb-1">
                        TOTAL VALUE LOCKED
                      </div>
                      <div className="text-lg font-bold bg-gradient-to-r from-[#8B5CF6] via-[#D8B4FE] to-[#3B82F6] text-transparent bg-clip-text">
                        {p.tvl}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-[#94A3B8] text-[9px] uppercase tracking-wider font-semibold mb-1 text-right">
                        VARIABEL APY
                      </div>
                      <div className="text-lg font-bold bg-gradient-to-r from-[#8B5CF6] via-[#D8B4FE] to-[#3B82F6] text-transparent bg-clip-text">
                        {p.apy}
                      </div> 
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