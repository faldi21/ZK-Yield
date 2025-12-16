'use client';

// import Galaxy from '@/components/ui/Galaxy';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* <div className="absolute inset-0 z-0">
        <Galaxy 
          mouseRepulsion={true}
          mouseInteraction={true}
          density={3}
          glowIntensity={0.2}
          saturation={1}
          hueShift={140}
          starSpeed={0.05} 
          rotationSpeed={0.1}
          transparent={true} 
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background/50 pointer-events-none" />
      </div> */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center pt-20 pointer-events-none">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-[#F1F7F6] font-display"
          >
            Privacy-First <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#8B5CF6] via-[#D8B4FE] to-[#3B82F6]">
              Yield Aggregator
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-[#94A3B8] mb-8 max-w-xl mx-auto"
          >
            Earn DeFi yields without sacrificing compliance
            <br />
            Zero-Knowledge Proofs meet institutional-grade security
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto" 
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
            
            <Link 
              href="#how-it-works" 
              className="px-8 py-4 bg-[#8B5CF6] border border-[#8B5CF6] text-[#F1F7B8] font-bold rounded-xl hover:bg-[#8a5cf6d5] transition-all flex items-center justify-center gap-2"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}