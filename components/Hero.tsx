'use client';

import { GithubIcon as Github } from './GithubIcon';
import { ReleaseAsset } from '../types/github';
import Reveal from './animations/Reveal';
import { useOs } from '../hooks/useOs';
import NumberCounter from './animations/NumberCounter';

interface HeroProps {
  stars: number;
  version: string;
  repoUrl: string;
  assets: ReleaseAsset[];
  dict: any;
  totalDownloads?: number;
}

export default function Hero({ stars, version, repoUrl, assets, dict, totalDownloads = 0 }: HeroProps) {
  const os = useOs();
  
  // Find assets
  const macAsset = assets?.find(a => a.name.includes('.dmg'));
  const winAsset = assets?.find(a => a.name.includes('.exe') || a.name.includes('.msi'));
  const linuxAsset = assets?.find(a => a.name.toLowerCase().endsWith('.tar.gz') || a.name.toLowerCase().endsWith('.appimage') || a.name.toLowerCase().endsWith('.deb'));

  let downloadText = dict.downloadDefault || 'Download FlowDesk';
  let downloadUrl = '#download';

  if (os === 'Windows') {
    downloadText = dict.downloadWin || 'Download for Windows';
    downloadUrl = winAsset ? winAsset.browser_download_url : '#download';
  } else if (os === 'macOS') {
    downloadText = dict.downloadMac;
    downloadUrl = macAsset ? macAsset.browser_download_url : '#download';
  } else if (os === 'Linux') {
    downloadText = dict.downloadLinux || 'Download for Linux';
    downloadUrl = linuxAsset ? linuxAsset.browser_download_url : '#download';
  }

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col justify-center items-center overflow-hidden bg-[var(--color-bg)] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center z-10">
        <Reveal yOffset={60}>
          {/* Version Badge */}
          <div className="inline-flex items-center justify-center px-3 py-1 mb-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <span className="font-mono text-[13px] font-semibold text-[var(--color-primary)] tracking-wide">
              {version.startsWith('v') ? version : `v${version}`}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1} yOffset={60}>
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-[800] leading-[1.2] tracking-[-0.03em] mb-6 text-[var(--color-text-primary)]">
            {dict.title}
          </h1>
        </Reveal>

        <Reveal delay={0.2} yOffset={60}>
          {/* Subtext */}
          <p className="text-[18px] leading-[1.7] text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto">
            {dict.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.3} yOffset={60}>
          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a
              href={downloadUrl}
              className="w-full sm:w-auto px-8 py-3.5 rounded-[var(--radius-md)] bg-[image:var(--gradient-cta)] text-white text-[15px] font-semibold shadow-[var(--shadow-btn)] hover:brightness-110 transition-all duration-200 text-center"
            >
              {downloadText}
            </a>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-[var(--radius-md)] bg-transparent border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition-all duration-200 text-[15px] font-semibold"
            >
              <Github className="w-5 h-5" />
              <span>{dict.viewGithub}</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.4} yOffset={60}>
          {/* Metadata */}
          <div className="flex flex-col items-center gap-2 mb-16">
            <p className="text-sm font-medium text-[var(--color-text-muted)] flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              {dict.totalDownloads.split('{count}')[0]}
              <strong className="text-[var(--color-text-primary)]"><NumberCounter value={totalDownloads} /></strong>
              {dict.totalDownloads.split('{count}')[1]}
            </p>
            <p className="text-xs font-medium text-[var(--color-text-muted)]">
              ★ {stars.toLocaleString()} {dict.stars}
            </p>
          </div>

          {/* Platform Support — dynamic based on available assets */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {macAsset && (
              <span className="px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-full">
                macOS
              </span>
            )}
            {winAsset && (
              <span className="px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-full">
                Windows
              </span>
            )}
            {linuxAsset ? (
              <span className="px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-full">
                Linux
              </span>
            ) : (
              <span className="px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] bg-transparent border border-[var(--color-border-subtle)] rounded-full">
                Linux (Soon)
              </span>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
