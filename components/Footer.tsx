import Link from 'next/link';
import Image from 'next/image';
import { GithubIcon as Github } from './GithubIcon';

interface FooterProps {
  repoUrl: string;
  dict: any;
  currentLang: string;
}

export default function Footer({ repoUrl, dict, currentLang }: FooterProps) {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border-subtle)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Left: Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2 text-xl tracking-tight text-[var(--color-text-primary)] mb-2">
              <Image src="/logo.png" alt="FlowDesk Logo" width={24} height={24} className="rounded-[4px]" />
              <div>
                <span className="font-normal">Flow</span>
                <span className="font-bold text-[var(--color-text-accent)]">Desk</span>
              </div>
            </Link>
            <p className="text-[13px] text-[var(--color-text-muted)] text-center md:text-left">
              {dict.tagline}
            </p>
          </div>

          {/* Center: Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link href={`/${currentLang}/#features`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              {dict.features}
            </Link>
            <Link href={`/${currentLang}/docs`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              {dict.docs}
            </Link>
            <Link href={`/${currentLang}/philosophy`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              {dict.philosophy}
            </Link>
            <Link href={`/${currentLang}/sponsor`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              {dict.sponsor}
            </Link>
            <Link href={`/${currentLang}/compare/notion`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              FlowDesk vs Notion
            </Link>
            <Link href={`/${currentLang}/contact`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              {dict.contact}
            </Link>
            <Link href={`/${currentLang}/download`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              {dict.download}
            </Link>
            <Link href={`/${currentLang}/changelog`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              {dict.changelog}
            </Link>
            <Link 
              href={`/${currentLang}/license`} 
              className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {dict.license}
            </Link>
            <a 
              href={repoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          {/* Right: Built with info */}
          <div className="flex flex-col items-center md:items-end text-[13px] text-[var(--color-text-muted)]">
            <div className="flex items-center space-x-2 mb-2">
              <span>{dict.builtWith}</span>
              <span className="px-2 py-0.5 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[11px] font-mono text-[var(--color-info)]">
                v10.0
              </span>
            </div>
          </div>
          
        </div>

        {/* Bottom: Copyright */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border-subtle)] text-center text-[12px] text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} {dict.copyright}
        </div>
      </div>
    </footer>
  );
}
