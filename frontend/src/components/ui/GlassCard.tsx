'use client';
import { motion } from 'framer-motion';

export function GlassCard({ children, className = '', hoverEffect = true }: { children: React.ReactNode, className?: string, hoverEffect?: boolean }) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={`glass-panel p-8 rounded-3xl backdrop-blur-md bg-surface/40 border border-[#0B453A] hover:border-[#00DF81]/30 transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}