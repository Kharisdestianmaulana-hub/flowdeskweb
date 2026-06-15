'use client';

import { Apple, Monitor, Terminal } from 'lucide-react';
import { ReleaseAsset } from '../types/github';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface PlatformDownloadProps {
  assets: ReleaseAsset[];
  version: string;
  dict: any;
}

export default function PlatformDownload({ assets, version, dict }: PlatformDownloadProps) {
  const [ref, isIntersecting] = useIntersectionObserver();

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
        </div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {platforms.map((platform, index) => {
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
                    {dict.downloadAction} {platform.name === 'macOS' ? dict.dmg : dict.exe}
                  </a>
                )}
              </div>
            );
          })}
        </div>



      </div>
    </section>
  );
}
