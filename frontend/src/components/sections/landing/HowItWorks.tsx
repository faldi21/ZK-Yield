'use client';

import React, { useEffect, useMemo, useRef, ReactNode, RefObject } from 'react';
import { Lock, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- 1. SETUP & KOMPONEN SCROLL FLOAT ---
gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'top bottom-=15%',
  scrollEnd = 'bottom center',
  stagger = 0.03
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  
  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split('').map((char, index) => (
      <span className="inline-block" key={index}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const scroller = scrollContainerRef?.current || window;
    const charElements = el.querySelectorAll('.inline-block');

    const ctx = gsap.context(() => {
      gsap.fromTo(charElements, 
        { opacity: 0, yPercent: 120, scaleY: 2.3, scaleX: 0.7, transformOrigin: '50% 0%' },
        {
          duration: animationDuration,
          ease: ease,
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger: stagger,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: scrollStart,
            end: scrollEnd,
            scrub: 0.3
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger, scrollContainerRef]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <span className={`inline-block leading-[1.2] ${textClassName}`}>{splitText}</span>
    </div>
  );
};

const steps = [
  {
    icon: <Lock className="text-white" size={28} />,
    title: 'Generate Proof',
    desc: 'Buat bukti Zero-Knowledge secara lokal. Private key & data rahasia tidak pernah meninggalkan perangkat Anda.',
    color: 'from-[#8B5CF6] via-[#D8B4FE] to-[#3B82F6]'
  },
  {
    icon: <Zap className="text-white" size={28} />,
    title: 'Verify On-Chain',
    desc: 'Smart contract memverifikasi validitas bukti matematis dalam hitungan milidetik tanpa mengetahui data aslinya.',
    color: 'from-[#8B5CF6] via-[#D8B4FE] to-[#3B82F6]'
  },
  {
    icon: <TrendingUp className="text-white" size={28} />,
    title: 'Earn Yields',
    desc: 'Dapatkan akses instan ke strategi DeFi institusional dengan APY tinggi secara aman dan anonim.',
    color: 'from-[#8B5CF6] via-[#D8B4FE] to-[#3B82F6]'
  }
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const bgDecorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect pada background decor
      if (bgDecorRef.current) {
        gsap.to(bgDecorRef.current,
          {
            y: -100,
            scale: 1.2,
            opacity: 0.3,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          }
        );
      }
      // Animasi Title & Description dengan scroll
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top bottom-=100",
              end: "top center",
              scrub: 0.5,
            }
          }
        );
      }

      if (descRef.current) {
        gsap.fromTo(descRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: descRef.current,
              start: "top bottom-=50",
              end: "top center",
              scrub: 0.5,
            }
          }
        );
      }

      // Animasi Garis Progress
      gsap.fromTo(lineRef.current,
        { scaleX: 0, scaleY: 0 },
        {
          scaleX: window.innerWidth >= 768 ? 1 : 1, 
          scaleY: window.innerWidth < 768 ? 1 : 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center+=100",
            end: "center center",
            scrub: 0.3,
          }
        }
      );

      // Animasi untuk setiap step dengan stagger dan parallax
      stepRefs.current.forEach((stepEl, i) => {
        if (!stepEl) return;

        const iconEl = iconRefs.current[i];
        const cardEl = cardRefs.current[i];

        // Animasi Icon dengan scale dan rotation
        if (iconEl) {
          gsap.fromTo(iconEl,
            { 
              scale: 0, 
              opacity: 0, 
              rotation: -180,
              y: 50
            },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              y: 0,
              duration: 1,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: stepEl,
                start: "top bottom-=100",
                end: "top center",
                scrub: 0.5,
              }
            }
          );
        }

        // Animasi Card dengan parallax dan fade
        if (cardEl) {
          gsap.fromTo(cardEl,
            { 
              opacity: 0, 
              y: 60,
              scale: 0.9
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: stepEl,
                start: "top bottom-=50",
                end: "top center",
                scrub: 0.6,
              }
            }
          );

          // Parallax effect saat scroll
          gsap.to(cardEl,
            {
              y: -20,
              scrollTrigger: {
                trigger: stepEl,
                start: "top center",
                end: "bottom top",
                scrub: true,
              }
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      id="how-it-works" 
      className="py-32 bg-background relative overflow-hidden"
    >
      
      {/* Background Decor - Dihapus/dimatikan sesuai instruksi di kode asli */}
      {/* <div 
        ref={bgDecorRef}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full pointer-events-none" 
      />
      */}

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-[#F1F7F6] mb-4"
          >
            How It Works
          </h2>
          <p 
            ref={descRef}
            className="text-[#94A3B8] max-w-xl mx-auto"
          >
            Privasi tingkat militer bertemu kemudahan penggunaan dalam 3 langkah.
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-12 md:gap-8">
          
          {/* --- THE MOVING LINE (Garis Berjalan) --- */}
          <div className="absolute z-0
            /* Mobile Styles: Vertikal, tengah, dari tengah kotak pertama ke tengah kotak terakhir */
            left-1/2 top-[48px] bottom-auto h-[calc(100%-96px)] w-[2px] -translate-x-1/2
            /* Desktop Styles: Horizontal, atas, dari tengah kotak pertama (16.666%) ke tengah kotak terakhir (83.333%) */
            md:left-[16.666%] md:top-[60px] md:w-[66.668%] md:h-[2px] md:translate-x-0 md:bottom-auto md:right-auto
            bg-[#1e1b2e]" // Warna track (abu-abu gelap)
          >
            {/* The Progress Fill (Garis Berwarna yang bergerak) */}
            <div 
              ref={lineRef}
              // Mengganti 'bg-linear-to-r' menjadi 'bg-gradient-to-r' (standar Tailwind)
              className="w-full h-full bg-linear-to-r from-[#8B5CF6] via-[#D8B4FE] to-[#3B82F6] origin-top md:origin-left"
              style={{ 
                // Kita atur default scale 0 via CSS agar tidak glitch sebelum JS load
                transform: 'scale(0)' 
              }} 
            />
          </div>

          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              {/* Icon Circle Container */}
              <div
                ref={(el) => { iconRefs.current[i] = el; }}
                // **PERBAIKAN:** Hapus 'bg-background' dari sini, agar border gradient tidak tertutup
                // Tambahkan 'will-change-transform' untuk rendering GSAP yang lebih halus
                className={`w-24 h-24 rounded-2xl p-[2px] mb-8 relative z-20 transition-transform duration-300 group-hover:-translate-y-2 will-change-transform`}
              >
                {/* Border Gradient tanpa glow */}
                {/* Mengganti 'bg-linear-to-r' menjadi 'bg-gradient-to-r' */}
                <div className={`absolute inset-0 rounded-2xl bg-linear-to-r ${step.color}`} />
                
                {/* Inner Container (Ini yang mempertahankan warna background halaman) */}
                <div className="relative w-full h-full bg-background rounded-xl flex items-center justify-center overflow-hidden z-10">
                    {step.icon}
                </div>
              </div>

              {/* Content Card */}
              <div
                ref={(el) => { cardRefs.current[i] = el; }}
                className="bg-[#0A051E]/80 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:bg-[#120B2E] transition-colors duration-300 w-full min-h-[160px] flex flex-col justify-start mt-4"
              >
                {/* Judul Step menggunakan efek ScrollFloat */}
                <div className="mb-3 h-8 flex items-center justify-center">
                  <ScrollFloat 
                    animationDuration={1.2} 
                    ease="power3.out"
                    scrollStart="top bottom-=10%"
                    textClassName={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${step.color}`}
                  >
                    {step.title}
                  </ScrollFloat>
                </div>

                <p className="text-[#94A3B8] text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}