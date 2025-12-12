import { Hero } from '@/components/sections/landing/Hero';
import { ProblemSolution } from '@/components/sections/landing/ProblemSolution';
import { HowItWorks } from '@/components/sections/landing/HowItWorks';
import { ProtocolShowcase } from '@/components/sections/landing/ProtocolShowcase';
import { FinalCTA } from '@/components/sections/landing/FinalCTA';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-[#F1F7F6] font-sans selection:bg-primary/30 overflow-x-hidden">
      <Navbar />
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <ProtocolShowcase />
      <FinalCTA />
      <Footer />
    </main>
  );
}