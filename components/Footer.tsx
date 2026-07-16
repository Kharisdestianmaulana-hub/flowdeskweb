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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-8 items-start">
          
          {/* Left: Logo & Tagline */}
          <div className="flex flex-col items-start md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl tracking-tight text-[var(--color-text-primary)] mb-4">
              <Image src="/logo.png" alt="FlowDesk Logo" width={24} height={24} className="rounded-[4px]" />
              <div>
                <span className="font-normal">Flow</span>
                <span className="font-bold text-[var(--color-text-accent)]">Desk</span>
              </div>
            </Link>
            <p className="text-[14px] text-[var(--color-text-muted)] leading-relaxed mb-6">
              {dict.tagline}
            </p>
            <div className="flex items-center space-x-2 text-[13px] text-[var(--color-text-muted)]">
              <span>{dict.builtWith}</span>
              <span className="px-2 py-0.5 rounded bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[11px] font-mono text-[var(--color-info)]">
                v10.0
              </span>
            </div>
            
            {/* Product Hunt Badge */}
            <div className="mt-8">
              <a href="https://www.producthunt.com/products/flowdesk-4?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-flowdesk-5" target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-90 transition-opacity">
                <Image 
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1196415&amp;theme=neutral&amp;t=1784203143551" 
                  alt="FlowDesk - A local-first workspace for teams and creators | Product Hunt" 
                  width={250} 
                  height={54} 
                  unoptimized
                />
              </a>
            </div>
          </div>

          {/* Center & Right: Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:col-span-3 w-full">
            
            {/* Column 1: Product */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-[15px] font-semibold text-[var(--color-text-primary)]">Product</h4>
              <div className="flex flex-col space-y-3">
                <Link href={`/${currentLang}/download`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">{dict.download}</Link>
                <Link href={`/${currentLang}/#features`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">{dict.features}</Link>
                <Link href={`/${currentLang}/docs`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">{dict.docs}</Link>
                <Link href={`/${currentLang}/blog`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">{dict.blog || 'Blog'}</Link>
              </div>
            </div>

            {/* Column 2: Project */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-[15px] font-semibold text-[var(--color-text-primary)]">Project</h4>
              <div className="flex flex-col space-y-3">
                <Link href={`/${currentLang}/changelog`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">{dict.changelog}</Link>
                <Link href={`/${currentLang}/roadmap`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">{dict.roadmap}</Link>
                <Link href={`/${currentLang}/compare`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">{dict.compare || 'Compare'}</Link>
                <Link href={`/${currentLang}/philosophy`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">{dict.philosophy}</Link>
              </div>
            </div>

            {/* Column 3: Support & Legal */}
            <div className="flex flex-col space-y-4 col-span-2 sm:col-span-1">
              <h4 className="text-[15px] font-semibold text-[var(--color-text-primary)]">Support & Legal</h4>
              <div className="flex flex-col space-y-3">
                <Link href={`/${currentLang}/contact`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">{dict.contact || 'Contact'}</Link>
                <Link href={`/${currentLang}/sponsor`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  {dict.sponsor}
                </Link>
                <Link href={`/${currentLang}/license`} className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">{dict.license || 'License'}</Link>
                <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
              </div>
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
