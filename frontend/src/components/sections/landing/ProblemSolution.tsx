'use client';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

export function ProblemSolution() {
  return (
    <section className="py-32 bg-background relative">

      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B5CF6]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto items-center">

          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-10 rounded-3xl bg-[#0A051E] border border-red-500/10 group hover:border-red-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-2xl font-bold text-[#F1F7F6]">Traditional KYC</h3>
            </div>
            
            <ul className="space-y-6">
              {[
                "Upload foto KTP & Paspor ke server terpusat",
                "Risiko data bocor & dijual di dark web",
                "Privasi finansial terekspos sepenuhnya"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-[#94A3B8] group-hover:text-[#CBD5E1] transition-colors">
                  <XCircle className="text-red-500/80 shrink-0 mt-0.5" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative p-8 md:p-10 rounded-3xl bg-[#120B2E]/80 border border-[#8B5CF6]/30 backdrop-blur-xl shadow-2xl shadow-[#8B5CF6]/10"
          >
            {/* Corner Glow Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/20 blur-3xl -z-10 rounded-full" />

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-[#8B5CF6]/30">
                <Shield size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white">ZK-Yield Protocol</h3>
            </div>

            <ul className="space-y-6">
              {[
                "Bukti ZK digenerate lokal di browser Anda",
                "Data pribadi 100% rahasia, tidak menyentuh chain",
                "Verifikasi matematis instan tanpa pihak ketiga"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-white font-medium">
                  <CheckCircle2 className="text-[#8B5CF6] shrink-0 mt-0.5" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}