'use client';

import { GithubIcon as Github } from './GithubIcon';
import { ReleaseAsset } from '../types/github';
import Reveal from './animations/Reveal';
import { useOs } from '../hooks/useOs';

interface CTASectionProps {
  assets: ReleaseAsset[];
  dict: any;
}

export default function CTASection({ assets, dict }: CTASectionProps) {
  const os = useOs();
  
  const macAsset = assets?.find(a => a.name.includes('.dmg'));
  const winAsset = assets?.find(a => a.name.includes('.exe') || a.name.includes('.msi'));
  const linuxAsset = assets?.find(a =>
    a.name.toLowerCase().endsWith('.tar.gz') ||
    a.name.toLowerCase().endsWith('.appimage') ||
    a.name.toLowerCase().endsWith('.deb')
  );

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
    <section className="bg-[var(--color-surface)] py-24 sm:py-32 border-y border-[var(--color-border-subtle)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-[800] tracking-[-0.01em] text-[var(--color-text-primary)] mb-6">
            {dict.title}
          </h2>
          <p className="text-[18px] text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto">
            {dict.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={downloadUrl}
              className="w-full sm:w-auto px-8 py-3.5 rounded-[var(--radius-md)] bg-[image:var(--gradient-cta)] text-white text-[15px] font-bold shadow-[var(--shadow-btn)] hover:scale-105 transition-transform duration-200 text-center"
            >
              {downloadText}
            </a>
            <a
              href="https://github.com/Kharisdestianmaulana-hub/flowdesk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)] transition-all duration-200 text-[15px] font-semibold"
            >
              <Github className="w-5 h-5" />
              <span>{dict.viewGithub}</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
