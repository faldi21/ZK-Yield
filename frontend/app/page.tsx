'use client';

import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi';
import { CONTRACTS, COMPLIANCE_MANAGER_ABI, STRATEGY_VAULT_ABI } from '@/lib/contracts';
import { formatEther } from 'viem';
import { KYCVerification } from '@/components/KYCVerification';
import { DepositWithdraw } from '@/components/DepositWithdraw';
import { useState, useEffect, useRef } from 'react';
import ParticlesBackground from '@/components/ParticlesBackground';

// Icons
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const RepeatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const LayersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CheckBadgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

function CountUp({ end, duration = 2000, decimals = 0 }: { end: number, duration?: number, decimals?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(progress * end);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count.toFixed(decimals)}</span>;
}

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

function FAQItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${isOpen ? 'bg-slate-900/60 border-blue-500/30 shadow-lg shadow-blue-500/10' : 'bg-slate-900/30 border-white/5 hover:border-white/10'}`}>
      <button 
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
      >
        <span className={`text-lg font-semibold transition-colors ${isOpen ? 'text-white' : 'text-slate-300'}`}>
          {question}
        </span>
        <span className={`transform transition-transform duration-300 text-slate-400 ${isOpen ? 'rotate-180 text-blue-400' : ''}`}>
          <ChevronDownIcon />
        </span>
      </button>
      <div 
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-6 text-slate-400 leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is Zero-Knowledge Proof?",
      a: "Zero-Knowledge Proof (ZKP) is a cryptographic method that allows one party to prove to another that a statement is true without revealing any specific information about the statement itself. In our case, you can prove you are KYC compliant without revealing your identity."
    },
    {
      q: "How is my privacy protected?",
      a: "Your personal data never leaves your device. We generate a ZK proof locally in your browser which is then verified on-chain. The blockchain only sees a mathematical proof that you are eligible, not who you are."
    },
    {
      q: "What are the fees?",
      a: "We charge a minimal performance fee of 5% on the yields generated. There are no deposit or withdrawal fees, though you will need to pay standard network gas fees."
    },
    {
      q: "Is the smart contract audited?",
      a: "Yes, our smart contracts have undergone rigorous internal testing and are currently being audited by top-tier security firms. We prioritize security above all else."
    },
    {
      q: "Which networks are supported?",
      a: "Currently, we are live on Base Sepolia testnet. We plan to launch on Base Mainnet, Optimism, and Arbitrum in the near future."
    },
    {
      q: "How do I withdraw my funds?",
      a: "You can withdraw your funds at any time. Simply go to the dashboard, click 'Withdraw', and your assets along with any accrued yields will be transferred back to your wallet instantly."
    }
  ];

  return (
    <div className="mt-32 w-full max-w-3xl mx-auto pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <FAQItem 
            key={i}
            question={faq.q}
            answer={faq.a}
            isOpen={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );
}

function CTASection() {
  return (
    <div className="mt-32 relative w-full overflow-hidden rounded-3xl mb-20">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x" />
      
      {/* Overlay pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-white">Join 10,000+ users</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Ready to Earn While <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-purple-200">
              Staying Private?
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users earning optimized yields with complete privacy using zero-knowledge proofs.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button className="group relative px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg shadow-xl shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer">
              Launch App
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            <button className="group px-8 py-4 rounded-xl border border-white/30 bg-white/5 backdrop-blur-sm text-white font-bold text-lg hover:bg-white/10 hover:border-white/50 hover:scale-105 transition-all duration-300 cursor-pointer">
              Read Documentation
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pt-12 flex flex-wrap justify-center gap-6 text-sm font-medium text-blue-100/80">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Fully Audited
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              Open Source
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Community Driven
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-black/20 backdrop-blur-xl mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="font-bold text-white">Z</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                ZK-Yield
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              The first privacy-preserving yield aggregator on Ethereum. Earn optimized yields without compromising your identity.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                <span className="sr-only">Twitter</span>
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                <span className="sr-only">Discord</span>
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-white/20 transition-all duration-300">
                <span className="sr-only">GitHub</span>
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                <span className="sr-only">Medium</span>
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="font-semibold text-white mb-6">Product</h3>
            <ul className="space-y-3">
              {['Dashboard', 'Vaults', 'Analytics', 'Documentation'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-blue-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold text-white mb-6">Resources</h3>
            <ul className="space-y-3">
              {['GitHub', 'Blog', 'Whitepaper', 'Audit Report'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-purple-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold text-white mb-6">Stay Updated</h3>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and security alerts.
            </p>
            <div className="space-y-3">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                />
                <button className="absolute right-2 top-2 p-1.5 rounded-md bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 ZK-Yield. Built with privacy in mind.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const { data: isCompliant } = useReadContract({
    address: CONTRACTS.complianceManager,
    abi: COMPLIANCE_MANAGER_ABI,
    functionName: 'isCompliant',
    args: address ? [address] : undefined,
  });

  const { data: totalValueLocked } = useReadContract({
    address: CONTRACTS.strategyVault,
    abi: STRATEGY_VAULT_ABI,
    functionName: 'totalValueLocked',
  });

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-950 relative overflow-hidden text-white selection:bg-blue-500/30">
      <ParticlesBackground />
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse delay-1000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[120px] animate-pulse delay-2000" />
      </div>

      {/* Navbar */}
      <header className="z-50 border-b border-white/5 backdrop-blur-md bg-slate-950/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl font-bold text-white">ZK</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">ZK-Yield</h1>
            </div>
          </div>
          
          <div>
            {isConnected ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-blue-400 font-medium uppercase tracking-wider">Connected</p>
                  <p className="font-mono text-sm text-slate-300 bg-slate-800/50 px-2 py-1 rounded border border-white/5">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => connect({ connector: connectors[0] })}
                className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {isConnected ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
                <p className="text-slate-400">Manage your privacy-preserved assets</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-white/5 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-slate-300">Base Sepolia Connected</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* TVL Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/5 p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-blue-400 font-medium uppercase tracking-wider">Total Value Locked</div>
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform duration-300">
                      <ChartIcon />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {totalValueLocked ? formatEther(totalValueLocked) : '0'} <span className="text-lg text-slate-500">ETH</span>
                  </div>
                </div>
              </div>

              {/* Compliance Status Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/5 p-6 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-purple-400 font-medium uppercase tracking-wider">Compliance Status</div>
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:scale-110 transition-transform duration-300">
                      <ShieldIcon />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isCompliant ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'} animate-pulse`} />
                    <div className="text-2xl font-bold text-white">
                      {isCompliant ? 'Verified' : 'Unverified'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Network Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/5 p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-cyan-500/20 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-cyan-400 font-medium uppercase tracking-wider">Network Status</div>
                    <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                      <WalletIcon />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">Base Sepolia</div>
                  <div className="text-xs text-slate-500 mt-1">Block Height: Live</div>
                </div>
              </div>
            </div>

            {/* Main Action Area */}
            <div className="grid lg:grid-cols-3 gap-8 mt-8">
              {/* Left Column: KYC */}
              <div className="lg:col-span-1">
                 <div className={`h-full rounded-3xl border ${!isCompliant ? 'border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'border-white/5'} bg-slate-900/40 backdrop-blur-xl p-1 overflow-hidden transition-all duration-300`}>
                    <div className="bg-slate-950/50 rounded-[20px] h-full p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <ShieldIcon /> Identity Verification
                      </h3>
                      {!isCompliant ? (
                         <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <p className="text-sm text-blue-200">Complete ZK-KYC to access the strategy vault.</p>
                         </div>
                      ) : (
                        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                            <p className="text-sm text-green-200">Identity verified successfully.</p>
                         </div>
                      )}
                      <KYCVerification />
                    </div>
                 </div>
              </div>

              {/* Right Column: Vault */}
              <div className="lg:col-span-2">
                <div className={`h-full rounded-3xl border ${isCompliant ? 'border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.1)]' : 'border-white/5 opacity-50 grayscale'} bg-slate-900/40 backdrop-blur-xl p-1 overflow-hidden transition-all duration-300`}>
                   <div className="bg-slate-950/50 rounded-[20px] h-full p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <LockIcon /> Strategy Vault
                      </h3>
                      {isCompliant ? (
                        <DepositWithdraw />
                      ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-center p-8">
                          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <LockIcon />
                          </div>
                          <h4 className="text-lg font-semibold text-white mb-2">Vault Locked</h4>
                          <p className="text-slate-400 max-w-md">
                            You must complete the Zero-Knowledge KYC verification process before you can deposit assets into the strategy vault.
                          </p>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Landing Page View
          <div className="flex flex-col items-center justify-center pt-10 pb-20">
            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-sm font-medium text-blue-400 tracking-wide">Powered by Zero-Knowledge Proofs</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                <span className="block text-white">The Future of</span>
                <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                  Private Yield
                </span>
              </h1>
              
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Earn institutional-grade yields while maintaining complete privacy. 
                Compliant, secure, and built on Base.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => connect({ connector: connectors[0] })}
                  className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                >
                  Launch App
                </button>
                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-lg backdrop-blur-sm transition-all duration-300 w-full sm:w-auto">
                  Read Docs
                </button>
              </div>
            </div>

            {/* Key Features Section */}
            <div className="mt-32 w-full relative z-10">
              {/* Background Orbs for Features */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="text-center mb-16 space-y-4 relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-400 to-pink-400">
                  Why Choose ZK-Yield
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                  The most advanced privacy-preserving yield protocol
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {[
                  {
                    title: "Zero-Knowledge Privacy",
                    desc: "Complete privacy using zk-SNARKs. Your transaction details are never exposed.",
                    icon: <ShieldIcon />,
                    gradient: "from-blue-500/10 to-cyan-500/10",
                    border: "group-hover:border-blue-500/30",
                    iconBg: "bg-blue-500/20 text-blue-400"
                  },
                  {
                    title: "Institutional Grade",
                    desc: "Bank-level security and compliance infrastructure built for serious investors.",
                    icon: <BuildingIcon />,
                    gradient: "from-purple-500/10 to-pink-500/10",
                    border: "group-hover:border-purple-500/30",
                    iconBg: "bg-purple-500/20 text-purple-400"
                  },
                  {
                    title: "Auto-Compounding",
                    desc: "Automated yield optimization ensures your assets grow faster with zero effort.",
                    icon: <RepeatIcon />,
                    gradient: "from-green-500/10 to-emerald-500/10",
                    border: "group-hover:border-green-500/30",
                    iconBg: "bg-green-500/20 text-green-400"
                  },
                  {
                    title: "Multi-Strategy",
                    desc: "Diversified yield strategies across multiple protocols to minimize risk.",
                    icon: <LayersIcon />,
                    gradient: "from-amber-500/10 to-orange-500/10",
                    border: "group-hover:border-amber-500/30",
                    iconBg: "bg-amber-500/20 text-amber-400"
                  },
                  {
                    title: "Gas Optimized",
                    desc: "Minimal transaction costs through efficient batching and L2 scaling.",
                    icon: <ZapIcon />,
                    gradient: "from-yellow-500/10 to-red-500/10",
                    border: "group-hover:border-yellow-500/30",
                    iconBg: "bg-yellow-500/20 text-yellow-400"
                  },
                  {
                    title: "Audit Verified",
                    desc: "Fully audited smart contracts ensuring maximum security for your funds.",
                    icon: <CheckBadgeIcon />,
                    gradient: "from-indigo-500/10 to-violet-500/10",
                    border: "group-hover:border-indigo-500/30",
                    iconBg: "bg-indigo-500/20 text-indigo-400"
                  }
                ].map((feature, i) => (
                  <div 
                    key={i} 
                    className={`group p-8 rounded-2xl bg-linear-to-br ${feature.gradient} border border-white/5 backdrop-blur-xl hover:bg-slate-900/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${feature.border} animate-in fade-in slide-in-from-bottom-8`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className={`w-16 h-16 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works Section */}
            <div className="py-24 w-full relative">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-b from-white to-slate-400">
                  How It Works
                </h2>
                <p className="text-slate-400 text-lg">Get started in three simple steps</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop only) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-linear-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 z-0" />

                {[
                  {
                    step: "01",
                    title: "Connect Wallet",
                    desc: "Connect your Web3 wallet to get started",
                    icon: <WalletIcon />,
                    gradient: "from-blue-500/20 to-cyan-500/20",
                    border: "group-hover:border-blue-500/50",
                    glow: "group-hover:shadow-blue-500/20"
                  },
                  {
                    step: "02",
                    title: "Complete KYC",
                    desc: "Verify your identity privately using zero-knowledge proofs",
                    icon: <ShieldIcon />,
                    gradient: "from-purple-500/20 to-pink-500/20",
                    border: "group-hover:border-purple-500/50",
                    glow: "group-hover:shadow-purple-500/20"
                  },
                  {
                    step: "03",
                    title: "Start Earning",
                    desc: "Deposit assets and earn optimized yields automatically",
                    icon: <ChartIcon />,
                    gradient: "from-amber-500/20 to-orange-500/20",
                    border: "group-hover:border-amber-500/50",
                    glow: "group-hover:shadow-amber-500/20"
                  }
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="group relative z-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700"
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    <div className={`w-24 h-24 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mb-6 relative transition-transform duration-500 group-hover:scale-110 border ${item.border} shadow-lg ${item.glow}`}>
                      <div className={`absolute inset-0 rounded-full bg-linear-to-br ${item.gradient} opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-500`} />
                      <span className="text-3xl font-bold text-white relative z-10">{item.step}</span>
                    </div>
                    
                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-xl w-full hover:bg-slate-800/40 transition-all duration-300 group-hover:-translate-y-2">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impressive Stats Section */}
            <div className="mt-32 w-full relative py-20">
              <div className="absolute inset-0 bg-linear-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl -z-10 rounded-3xl" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
                {[
                  {
                    value: 1.2,
                    suffix: "M+",
                    prefix: "$",
                    label: "Total Value Locked",
                    icon: <ChartIcon />,
                    gradient: "from-blue-400 to-cyan-400",
                    decimals: 1
                  },
                  {
                    value: 100,
                    suffix: "%",
                    label: "Privacy Preserved",
                    icon: <ShieldIcon />,
                    gradient: "from-purple-400 to-pink-400",
                    decimals: 0
                  },
                  {
                    value: 0.1,
                    suffix: "s",
                    label: "Proof Generation",
                    icon: <ZapIcon />,
                    gradient: "from-amber-400 to-orange-400",
                    decimals: 1
                  },
                  {
                    value: 8,
                    label: "Circuit Constraints",
                    icon: <LayersIcon />,
                    gradient: "from-emerald-400 to-green-400",
                    decimals: 0
                  }
                ].map((stat, i) => (
                  <div key={i} className="group p-4 hover:scale-105 transition-transform duration-300">
                    <div className="flex justify-center mb-4 text-slate-500 group-hover:text-white transition-colors">
                      {stat.icon}
                    </div>
                    <div className={`text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r ${stat.gradient} mb-2 font-mono tracking-tight`}>
                      {stat.prefix}<CountUp end={stat.value} decimals={stat.decimals} />{stat.suffix}
                    </div>
                    <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-medium text-green-400">Updated in real-time</span>
                </div>
              </div>
            </div>

            {/* Built With Section */}
            <div className="mt-32 w-full pb-20">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-200 to-slate-500">
                  Powered By Industry Leaders
                </h2>
              </div>

              <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center opacity-80">
                {[
                  { name: "Mantle", color: "hover:text-white" },
                  { name: "Circom", color: "hover:text-red-400" },
                  { name: "Solidity", color: "hover:text-slate-200" },
                  { name: "Wagmi", color: "hover:text-blue-400" },
                  { name: "Viem", color: "hover:text-yellow-400" },
                  { name: "Next.js", color: "hover:text-white" }
                ].map((tech, i) => (
                  <div 
                    key={i}
                    className={`group px-8 py-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 cursor-default hover:scale-105 hover:border-white/10`}
                  >
                    <span className={`text-xl font-bold text-slate-500 transition-colors duration-300 ${tech.color}`}>
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <FAQSection />
            <CTASection />
            <Footer />
          </div>
        )}
      </div>
    </main>
  );
}
