'use client';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2 } from 'lucide-react';

const problems = [
  "Upload foto KTP & Paspor ke server terpusat",
  "Risiko data bocor & dijual di dark web",
  "Privasi finansial terekspos sepenuhnya"
];

const solutions = [
  "Bukti ZK digenerate lokal di browser Anda",
  "Data pribadi 100% rahasia, tidak menyentuh chain",
  "Verifikasi matematis instan tanpa pihak ketiga"
];

export function ProblemSolution() {
  return (
    <section className="py-32 bg-background relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-xl p-6 md:p-8 bg-white/10 backdrop-blur-xl relative overflow-hidden group shadow-2xl"
          >           
            <div 
              className="absolute inset-0 rounded-xl border border-white/50 pointer-events-none" 
              style={{ 
                maskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 40%)'
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 relative z-10">
              <div className="pb-6 md:pb-8 md:pr-8 border-b-2 border-white/20 md:border-r-2 md:border-white/20">
                <h3 className="text-xl md:text-2xl font-bold text-center bg-linear-to-r from-[#8B5CF6] via-[#D8B4FE] to-[#3B82F6] text-transparent bg-clip-text">
                  Viegel Protocol
                </h3>
              </div>

              <div className="pt-6 pb-6 md:pt-0 md:pb-8 md:pl-8 border-b-2 border-white/20">
                <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                  Traditional KYC
                </h3>
              </div>

              <div className="pt-6 md:pt-8 md:pr-8 md:border-r-2 md:border-white/20">
                <ul className="space-y-4 md:space-y-6">
                  {solutions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
                      <span className="text-sm md:text-base bg-linear-to-r from-[#8B5CF6] via-[#D8B4FE] to-[#3B82F6] text-transparent bg-clip-text">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 md:pt-8 md:pl-8">
                <ul className="space-y-4 md:space-y-6">
                  {problems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="text-red-500/80 shrink-0 mt-0.5" size={20} />
                      <span className="text-sm md:text-base text-[#94A3B8]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <motion.div 
              variants={{
                hidden: { scale: 0.8, opacity: 0.3 },
                visible: { scale: 0.8, opacity: 0.3 },
                hover: { scale: 1, opacity: 0.6 }
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-2xl translate-x-1/2 translate-y-1/2 opacity-20 group-hover:opacity-60 transition-all duration-500 pointer-events-none z-0 bg-[#8B5CF6]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}