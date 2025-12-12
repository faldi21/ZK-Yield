'use client';

//import Galaxy from '@/components/3d/Galaxy';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-backgroundd">
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
            Earn DeFi yields without sacrificing compliance. Zero-Knowledge Proofs meet institutional-grade security.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto" 
          >
            <Link 
              href="/dashboard" 
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              Launch App <ArrowRight size={18} />
            </Link>
            
            <Link 
              href="#how-it-works" 
              className="px-8 py-4 bg-[#1E1B4B] border border-border text-[#F1F7F6] font-bold rounded-xl hover:bg-[#2E1065] transition-all flex items-center justify-center gap-2"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}