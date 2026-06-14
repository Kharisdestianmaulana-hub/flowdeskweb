'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Globe } from 'lucide-react';
import { GithubIcon as Github } from './GithubIcon';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavbarProps {
  stars: number;
  repoUrl: string;
  dict: any;
  currentLang: string;
}

export default function Navbar({ stars, repoUrl, dict, currentLang }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`sticky top-0 z-[100] w-full transition-all duration-300 ${isScrolled ? 'py-4 px-4 pointer-events-none' : 'py-0 px-0'}`}>
      <nav className={`pointer-events-auto mx-auto transition-all duration-300 backdrop-blur-lg border border-[var(--color-border-subtle)] ${isScrolled ? 'max-w-5xl rounded-full bg-[rgba(20,20,25,0.7)] shadow-2xl h-[60px]' : 'max-w-none w-full rounded-none bg-[rgba(10,10,15,0.85)] border-t-0 border-l-0 border-r-0 h-16'}`}>
        <div className={`h-full flex items-center justify-between transition-all duration-300 ${isScrolled ? 'px-6' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
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
          <Link href={`/${currentLang}/docs`} className="text-[14px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            {dict.docs}
          </Link>
          <Link href={`/${currentLang}/philosophy`} className="text-[14px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            {dict.philosophy}
          </Link>
          <Link href={`/${currentLang}/sponsor`} className="text-[14px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            {dict.sponsor}
          </Link>
          <Link href={`/${currentLang}/download`} className="text-[14px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
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
            href={`/${currentLang}/download`}
            className="px-6 py-2 rounded-full bg-[image:var(--gradient-cta)] text-white text-[14px] font-medium shadow-[var(--shadow-btn)] hover:opacity-90 transition-opacity"
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
        <div className={`md:hidden bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-4 pt-2 pb-4 space-y-1 mx-auto ${isScrolled ? 'mt-2 max-w-5xl rounded-2xl shadow-xl pointer-events-auto' : 'w-full rounded-none border-t-0 border-l-0 border-r-0'}`}>
          <Link href={`/${currentLang}/#features`} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{dict.features}</Link>
          <Link href={`/${currentLang}/docs`} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{dict.docs}</Link>
          <Link href={`/${currentLang}/philosophy`} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{dict.philosophy}</Link>
          <Link href={`/${currentLang}/sponsor`} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            {dict.sponsor}
          </Link>
          <Link href={`/${currentLang}/download`} onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{dict.download}</Link>
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
              href={`/${currentLang}/download`}
              onClick={() => setIsOpen(false)}
              className="flex justify-center px-4 py-2 rounded-[var(--radius-md)] bg-[image:var(--gradient-cta)] text-white font-semibold shadow-[var(--shadow-btn)]"
            >
              {dict.download}
            </Link>
          </div>
        </div>
      )}
      </nav>
    </header>
  );
}
