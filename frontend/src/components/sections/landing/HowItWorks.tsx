'use client';
import React, { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    id: 1,
    desc: 'Buat bukti Zero-Knowledge secara lokal. Private key & data rahasia tidak pernah meninggalkan perangkat Anda.',
  },
  {
    id: 2,
    desc: 'Smart contract memverifikasi validitas bukti matematis dalam hitungan milidetik tanpa mengetahui data aslinya.',
  },
  {
    id: 3,
    desc: 'Dapatkan akses instan ke strategi DeFi institusional dengan APY tinggi secara aman dan anonim.',
  }
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineTrackRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      circleRefs.current.forEach((circle, i) => {
        gsap.set(circle, { scale: 0.8, backgroundColor: "#0A051E", borderColor: "#334155" });
        gsap.set(cardRefs.current[i], { opacity: 0, y: 20 });
      });

      const mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      }, (context) => {
        // @ts-ignore
        const { isDesktop, isMobile } = context.conditions;

        if (isMobile) {
          gsap.set(lineFillRef.current, { scaleX: 1, scaleY: 0, transformOrigin: "top center" });
        } else {
          gsap.set(lineFillRef.current, { scaleX: 0, scaleY: 1, transformOrigin: "left center" });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true, 
            start: "center center", 
            end: isMobile ? "+=800" : "+=1500",
            scrub: 1,
          }
        });

        tl.to(circleRefs.current[0], { scale: 1, borderColor: "#D8B4FE", duration: 0.5 }, 0)
          .to(cardRefs.current[0], { opacity: 1, y: 0, duration: 0.5 }, 0)
          .to(lineFillRef.current, { scaleX: isDesktop ? 0.5 : 1, scaleY: isDesktop ? 1 : 0.5, ease: "none", duration: 2 }, ">")
          .to(circleRefs.current[1], { scale: 1, borderColor: "#D8B4FE", duration: 0.5 }, ">-0.5")
          .to(cardRefs.current[1], { opacity: 1, y: 0, duration: 0.5 }, "<")
          .to(lineFillRef.current, { scaleX: 1, scaleY: 1, ease: "none", duration: 2 }, ">")
          .to(circleRefs.current[2], { scale: 1, borderColor: "#D8B4FE", duration: 0.5 }, ">-0.5")
          .to(cardRefs.current[2], { opacity: 1, y: 0, duration: 0.5 }, "<")
          .to({}, { duration: 1 });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="bg-[#0A051E] relative z-20 overflow-hidden text-white flex flex-col justify-center py-16 md:py-32"
    >
      <div className="absolute z-0 pointer-events-none top-0 left-0 p-4 w-20 h-20 opacity-60 md:p-0 md:w-[400px] md:h-[400px] md:top-1/2 md:-translate-y-1/2 md:left-0 md:-translate-x-[60%] md:opacity-30">
        <div className="relative w-full h-full">
          <Image src="/lock.png" alt="Lock Left" fill className="object-contain" />
        </div>
      </div>
      
      <div className="absolute z-0 pointer-events-none hidden md:block md:w-[400px] md:h-[400px] md:top-1/2 md:-translate-y-1/2 md:right-0 md:translate-x-[45%] md:opacity-30">
        <div className="relative w-full h-full">
          <Image src="/lock.png" alt="Lock Right" fill className="object-contain" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-10 md:mb-20 pl-8 md:pl-0"> 
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-6">How It Works</h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div 
            ref={lineTrackRef}
            className="absolute bg-slate-700/50 z-0 left-5 top-5 bottom-32 w-[3px] md:left-[16.66%] md:top-6 md:bottom-auto md:w-[66.66%] md:h-[3px]"
          >
            <div 
              ref={lineFillRef}
              className="absolute top-0 left-0 w-full h-full bg-linear-to-b md:bg-linear-to-r from-[#8B5CF6] via-[#D8B4FE] to-[#3B82F6] origin-top md:origin-left"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 relative z-10">
            {steps.map((step, i) => (
              <div key={step.id} className="relative flex md:flex-col items-start md:items-center group min-h-[140px] md:min-h-0">
                <div className="absolute left-0 md:static shrink-0 z-10">
                  <div 
                    ref={el => { circleRefs.current[i] = el }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 bg-linear-to-br from-[#8B5CF6] via-[#D8B4FE] to-[#3B82F6] bg-clip-border border-transparent bg-[#0A051E] flex items-center justify-center"
                  >
                    <div className="w-full h-full rounded-full bg-[#0A051E] flex items-center justify-center">
                      <span className="text-sm md:text-lg font-bold text-white">{step.id}</span>
                    </div>
                  </div>
                </div>
                
                <div 
                  ref={el => { cardRefs.current[i] = el }}
                  className="ml-14 md:ml-0 md:mt-8 w-full"
                >
                  <div className="relative overflow-hidden group bg-white/5 backdrop-blur-md p-5 md:p-6 rounded-2xl md:text-center min-h-[100px] flex flex-col justify-center transition-all duration-300">
                    <div 
                      className="absolute inset-0 rounded-2xl border border-white/40 pointer-events-none z-20" 
                      style={{ 
                        maskImage: 'linear-gradient(to bottom, black 0%, transparent 60%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 60%)'
                      }}
                    />

                    <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full blur-2xl translate-x-1/2 translate-y-1/2 opacity-20 group-hover:opacity-60 transition-all duration-500 pointer-events-none z-0 bg-[#8B5CF6]" />

                    <p className="text-[#94A3B8] text-sm md:text-base relative z-10">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}