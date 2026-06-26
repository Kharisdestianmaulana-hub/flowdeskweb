'use client';

import { Apple, Monitor, Terminal, Download } from 'lucide-react';
import { ReleaseAsset } from '../types/github';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useOs } from '../hooks/useOs';
import NumberCounter from './animations/NumberCounter';

interface PlatformDownloadProps {
  assets: ReleaseAsset[];
  version: string;
  dict: any;
  totalDownloads?: number;
}

export default function PlatformDownload({ assets, version, dict, totalDownloads = 0 }: PlatformDownloadProps) {
  const [ref, isIntersecting] = useIntersectionObserver();
  const detectedOs = useOs();

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getAsset = (extensions: string[]) => {
    return assets?.find(asset => 
      extensions.some(ext => asset.name.toLowerCase().endsWith(ext))
    );
  };

  const macAsset = getAsset(['.dmg']);
  const winAsset = getAsset(['.exe', '.msi']);
  const linuxAsset = getAsset(['.appimage', '.deb']);

  const platforms = [
    {
      name: 'macOS',
      icon: Apple,
      asset: macAsset,
    },
    {
      name: 'Windows',
      icon: Monitor,
      asset: winAsset,
    },
    {
      name: 'Linux',
      icon: Terminal,
      asset: linuxAsset,
    }
  ];

  return (
    <section id="download" className="py-24 sm:py-32 bg-[image:var(--gradient-section)] border-t border-[var(--color-border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[12px] font-medium text-[var(--color-primary)] tracking-widest uppercase block mb-4">
            {dict.downloadAction}
          </span>
          <h2 className="text-3xl sm:text-4xl font-[700] tracking-[-0.01em] text-[var(--color-text-primary)] mb-4">
            {dict.title}
          </h2>
          <p className="text-[18px] leading-[1.7] text-[var(--color-text-secondary)] mb-2">
            {dict.subtitle}
          </p>
          <div className="mt-4 flex items-center justify-center text-sm font-medium text-[var(--color-text-muted)] gap-2">
             <span className="flex items-center gap-1.5 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] px-4 py-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                {dict.totalDownloads.split('{count}')[0]}
                <strong className="text-[var(--color-text-primary)]"><NumberCounter value={totalDownloads} /></strong>
                {dict.totalDownloads.split('{count}')[1]}
             </span>
          </div>
        </div>

        {/* Dynamic OS Section */}
        {detectedOs === 'macOS' || detectedOs === 'Windows' || detectedOs === 'Linux' ? (
          <>
            <div className="max-w-2xl mx-auto mb-16">
              {platforms.filter(p => p.name === detectedOs).map((platform) => {
                const Icon = platform.icon;
                const hasAsset = !!platform.asset;
                const downloadUrl = platform.asset?.browser_download_url;

                return (
                  <div key="primary" className="bg-[image:var(--gradient-cta)] rounded-[var(--radius-xl)] p-[2px] shadow-2xl">
                    <div className="bg-[var(--color-surface)] rounded-[calc(var(--radius-xl)-2px)] p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 h-full">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-[var(--color-primary-light)]/10 text-[var(--color-primary)] flex items-center justify-center">
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-2xl font-[700] text-[var(--color-text-primary)] mb-2">
                            {platform.name === 'macOS' ? dict.macOS : platform.name === 'Windows' ? dict.windows : dict.linux}
                          </h3>
                          <p className="text-[15px] text-[var(--color-text-secondary)]">Recommended for your device</p>
                        </div>
                      </div>
                      
                      {!hasAsset ? (
                        <div className="w-full sm:w-auto h-[56px] px-8 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] text-[15px] font-medium cursor-not-allowed">
                          {dict.comingSoon}
                        </div>
                      ) : (
                        <a
                          href={downloadUrl}
                          className="w-full sm:w-auto h-[56px] px-8 flex items-center justify-center gap-3 rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-[16px] font-semibold shadow-[var(--shadow-btn)] transition-all"
                        >
                          <Download className="w-5 h-5" />
                          {dict.downloadAction} {platform.name === 'macOS' ? dict.dmg : platform.name === 'Linux' ? (dict.tar ?? '.tar.gz') : dict.exe}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mb-8">
              <h3 className="text-[16px] font-semibold text-[var(--color-text-secondary)]">Or download for other platforms</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12 justify-center">
              {platforms.filter(p => p.name !== detectedOs).map((platform) => {
                const Icon = platform.icon;
                const hasAsset = !!platform.asset;
                const downloadUrl = platform.asset?.browser_download_url;

                return (
                  <div 
                    key={platform.name}
                    className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] p-6 flex flex-col shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Icon className="w-6 h-6 text-[var(--color-text-secondary)]" />
                      <h4 className="text-[16px] font-[600] text-[var(--color-text-primary)]">
                        {platform.name === 'macOS' ? dict.macOS : platform.name === 'Windows' ? dict.windows : dict.linux}
                      </h4>
                    </div>

                    {!hasAsset ? (
                      <div className="h-[40px] flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-bg)] text-[var(--color-text-muted)] text-[13px] font-medium cursor-not-allowed">
                        {dict.comingSoon}
                      </div>
                    ) : (
                      <a
                        href={downloadUrl}
                        className="h-[40px] flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-bg)] hover:bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-[13px] font-medium transition-all"
                      >
                        {dict.downloadAction} {platform.name === 'macOS' ? dict.dmg : platform.name === 'Linux' ? (dict.tar ?? '.tar.gz') : dict.exe}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const hasAsset = !!platform.asset;
              const downloadUrl = platform.asset?.browser_download_url;

              return (
                <div 
                  key={platform.name}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 flex flex-col shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--color-border-subtle)]"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className="w-8 h-8 text-[var(--color-text-primary)]" />
                    <h3 className="text-xl font-[600] text-[var(--color-text-primary)]">
                      {platform.name === 'macOS' ? dict.macOS : platform.name === 'Windows' ? dict.windows : dict.linux}
                    </h3>
                  </div>

                  {!hasAsset ? (
                    <div className="h-[48px] flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] text-[14px] font-medium cursor-not-allowed">
                      {dict.comingSoon}
                    </div>
                  ) : (
                    <a
                      href={downloadUrl}
                      className="h-[48px] flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-[14px] font-medium shadow-[var(--shadow-btn)] transition-all"
                    >
                      {dict.downloadAction} {platform.name === 'macOS' ? dict.dmg : platform.name === 'Linux' ? (dict.tar ?? '.tar.gz') : dict.exe}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}



      </div>
    </section>
  );
}
