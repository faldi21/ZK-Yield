'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter } from 'lucide-react'; 

const footerLinks = {
  main: [
    { label: 'App', href: '/dashboard' },
    { label: 'Docs', href: '#' },
    { label: 'Whitepapers', href: '#' },
  ],
  legal: [
    { label: 'Privacy policy', href: '#' },
    { label: 'Terms of use', href: '#' },
  ],
  social: [
    { label: 'Telegram', href: '#', icon: 'telegram' },
    { label: 'Discord', href: '#', icon: 'discord' },
    { label: 'Twitter', href: '#', icon: 'twitter' },
    { label: 'Github', href: '#', icon: 'github' },
  ]
};

export function Footer() {
  return (
    <footer className="relative bg-[#0A051E] pt-16 pb-8 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 text-sm font-medium text-[#94A3B8]">
          <div className="flex gap-8">
            {footerLinks.main.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-white transition-colors group">
                <span className="relative pb-0.5">
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-full h-px bg-white transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-left"></span>
                </span>
              </Link>
            ))}
          </div>

          <div className="flex gap-8">
            {footerLinks.legal.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-white transition-colors group">
                <span className="relative pb-0.5">
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-full h-px bg-white transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-left"></span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="w-full h-[1px] bg-white/10 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-lg w-8 h-8 bg-transparent">
              <Image 
                src="/putih.png" 
                alt="V Logo" 
                width={24}
                height={24}
              />
            </div>
            <span className="text-lg font-bold text-white tracking-widest uppercase">
              VIEGEL
            </span>
          </div>

          <div className="flex gap-3">
            {footerLinks.social.map((link) => (
              <SocialLink key={link.label} href={link.href} icon={link.icon} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    telegram: <IconTelegram className="w-[18px] h-[18px] -ml-0.5 mt-0.5 fill-current" />,
    discord: <IconDiscord className="w-[18px] h-[18px] fill-current" />,
    twitter: <Twitter size={18} />,
    github: <Github size={18} />,
  };

  return (
    <a 
      href={href} 
      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-[#94A3B8] border border-white/5 hover:bg-[#8B5CF6] hover:text-white hover:border-[#8B5CF6] transition-all duration-300"
    >
      {iconMap[icon]}
    </a>
  );
}

function IconTelegram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M21.928 2.528c-.283-.566-1.134-.794-1.87-.51L2.83 8.368c-.753.283-1.025 1.055-.453 1.632l4.234 3.737.822 4.14a1.27 1.27 0 0 0 1.25 1.043c.42 0 .814-.2.986-.503l1.83-2.55 4.383 3.348a1.27 1.27 0 0 0 1.956-.84l3.525-14.773a1.26 1.26 0 0 0-.395-1.074Zm-8.496 11.536-1.61 2.245-.515-2.592 7.15-6.522-8.694 5.92-3.036-2.68 14.618-5.275-3.03 12.702-4.883-3.798Z" />
    </svg>
  );
}

function IconDiscord({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}