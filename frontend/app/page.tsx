import Link from 'next/link';
import { ConnectButton } from '@/components/ConnectButton';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">Z</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">ZK-Yield</h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
              {/* <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link> */}
              {/* <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link> */}
            </nav>
            <div className="flex gap-4">
              <Link 
                href="/login"
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-opacity"
              >
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium animate-fade-in">
            🚀 Live on Mantle
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Maximize your yield with <span className="text-primary">ZK-privacy</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Secure, private, and automated yield aggregation verified by zero-knowledge proofs. 
            Your finances, your privacy.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link 
              href="/login"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(0,255,163,0.4)] transition-all transform hover:-translate-y-1"
            >
              Start Earning
            </Link>
           
          </div>

          {/* Stats Preview */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-border pt-12">
            <div>
              <div className="text-3xl font-bold text-white">$42.8M</div>
              <div className="text-sm text-muted-foreground">Total Value Locked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">12,402</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">12.5%</div>
              <div className="text-sm text-muted-foreground">Average APY</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-muted-foreground">Privacy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why ZK-Yield?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon="🔐"
              title="Zero-Knowledge"
              description="Your balance and transactions remain completely private using advanced ZK proofs."
            />
            <FeatureCard 
              icon="⚡"
              title="Instant Liquidity"
              description="Withdraw your funds anytime without lock-up periods or delays."
            />
            <FeatureCard 
              icon="💰"
              title="Auto-Compounding"
              description="Strategies automatically reinvest yields to maximize your returns."
            />
            <FeatureCard 
              icon="🛡️"
              title="Audited Security"
              description="Our smart contracts are rigorously audited and verified."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 ZK-Yield. Building the future of private DeFi.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div className="bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-colors group">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
