'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Globe } from 'lucide-react';
import { GithubIcon as Github } from './GithubIcon';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavbarProps {
  stars: number;
  repoUrl: string;
  dict: any;
  currentLang: string;
}

export default function Navbar({ stars, repoUrl, dict, currentLang }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'id' : 'en';
    const segments = pathname.split('/');
    segments[1] = newLang;
    router.push(segments.join('/') || '/');
  };

  const formatStars = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[rgba(10,10,15,0.85)] backdrop-blur-md border-b border-[var(--color-border-subtle)] h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 text-xl tracking-tight text-[var(--color-text-primary)] transition-all duration-200">
            <Image src="/logo.png" alt="FlowDesk Logo" width={28} height={28} className="rounded-[6px]" />
            <div>
              <span className="font-normal">Flow</span>
              <span className="font-bold text-[var(--color-text-accent)]">Desk</span>
            </div>
          </Link>
        </div>

        {/* Center: Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href={`/${currentLang}/#features`} className="text-[14px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            {dict.features}
          </Link>
          <Link href={`/${currentLang}/#download`} className="text-[14px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            {dict.download}
          </Link>
          <Link href={`/${currentLang}/changelog`} className="text-[14px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            {dict.changelog}
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={toggleLanguage}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] transition-all"
            title={currentLang === 'en' ? 'Switch to Indonesian' : 'Switch to English'}
          >
            <span className="text-xs font-bold uppercase">{currentLang}</span>
          </button>
          
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-subtle)] transition-all duration-200 text-sm font-medium"
          >
            <Github className="w-4 h-4" />
            <span>{formatStars(stars)}</span>
          </a>
          <Link
            href={`/${currentLang}/#download`}
            className="px-4 py-2 rounded-[var(--radius-md)] bg-[image:var(--gradient-cta)] text-white text-sm font-semibold shadow-[var(--shadow-btn)] hover:brightness-108 transition-all duration-200"
          >
            {dict.download}
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-200"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-4 pt-2 pb-4 space-y-1">
          <Link href={`/${currentLang}/#features`} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{dict.features}</Link>
          <Link href={`/${currentLang}/#download`} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{dict.download}</Link>
          <Link href={`/${currentLang}/changelog`} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{dict.changelog}</Link>
          <div className="pt-4 flex flex-col gap-3">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium"
            >
              <Github className="w-5 h-5" />
              <span>GitHub ({formatStars(stars)})</span>
            </a>
            <Link
              href={`/${currentLang}/#download`}
              onClick={() => setIsOpen(false)}
              className="flex justify-center px-4 py-2 rounded-[var(--radius-md)] bg-[image:var(--gradient-cta)] text-white font-semibold shadow-[var(--shadow-btn)]"
            >
              {dict.download}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
