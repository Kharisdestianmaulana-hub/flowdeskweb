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

          {/* Center: Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl mx-auto col-span-1 md:col-span-1">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mb-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h4 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{dict.badges.offline.title}</h4>
              <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">{dict.badges.offline.desc}</p>
            </div>
            
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
              <h4 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{dict.badges.fast.title}</h4>
              <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">{dict.badges.fast.desc}</p>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
              <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h4 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{dict.badges.privacy.title}</h4>
              <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">{dict.badges.privacy.desc}</p>
            </div>
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
