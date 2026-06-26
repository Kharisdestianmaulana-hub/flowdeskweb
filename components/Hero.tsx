'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GithubIcon as Github } from './GithubIcon';
import { ReleaseAsset } from '../types/github';
import Reveal from './animations/Reveal';
import { useOs } from '../hooks/useOs';
import NumberCounter from './animations/NumberCounter';

const SLIDES = ['/screenshot-dark.png', '/screenshot-light.png'];
const INTERVAL_MS = 5000;

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
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean[]>([false, false]);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const handleLoad = (index: number) => {
    setIsLoaded((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  // Find assets
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
    <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden bg-[var(--color-bg)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Text */}
          <div className="flex flex-col z-10">
            <Reveal yOffset={50}>
              {/* Version Badge */}
              <div className="inline-flex items-center self-start px-3 py-1 mb-6 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]">
                <span className="font-mono text-[13px] font-semibold text-[var(--color-primary)] tracking-wide">
                  {version.startsWith('v') ? version : `v${version}`}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1} yOffset={50}>
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-[800] leading-[1.15] tracking-[-0.03em] mb-5 text-[var(--color-text-primary)]">
                {dict.title}
              </h1>
            </Reveal>

            <Reveal delay={0.2} yOffset={50}>
              <p className="text-[17px] leading-[1.75] text-[var(--color-text-secondary)] mb-8 max-w-lg">
                {dict.subtitle}
              </p>
            </Reveal>

            <Reveal delay={0.3} yOffset={50}>
              {/* CTA Row */}
              <div className="flex flex-col sm:flex-row items-start gap-3 mb-8">
                <a
                  href={downloadUrl}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-[var(--radius-md)] bg-[image:var(--gradient-cta)] text-white text-[15px] font-semibold shadow-[var(--shadow-btn)] hover:brightness-110 transition-all duration-200 text-center"
                >
                  {downloadText}
                </a>
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-[var(--radius-md)] bg-transparent border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition-all duration-200 text-[15px] font-semibold"
                >
                  <Github className="w-5 h-5" />
                  <span>{dict.viewGithub}</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.4} yOffset={50}>
              {/* Stats */}
              <div className="flex flex-col gap-1.5 mb-8">
                <p className="text-sm font-medium text-[var(--color-text-muted)] flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  {dict.totalDownloads.split('{count}')[0]}
                  <strong className="text-[var(--color-text-primary)]"><NumberCounter value={totalDownloads} /></strong>
                  {dict.totalDownloads.split('{count}')[1]}
                </p>
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  ★ {stars.toLocaleString()} {dict.stars}
                </p>
              </div>

              {/* Platform badges */}
              <div className="flex flex-wrap items-center gap-2">
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

          {/* Right: Auto-rotating screenshot */}
          <Reveal delay={0.2} yOffset={30}>
            <div className="relative w-full">
              {/* Screenshot container */}
              <div className="relative aspect-[16/10] w-full rounded-[var(--radius-xl)] overflow-hidden border border-[var(--color-border)] shadow-[var(--shadow-elevated)] bg-[var(--color-surface-raised)]">
                {SLIDES.map((src, i) => (
                  <AnimatePresence key={src} mode="wait">
                    {i === current && (
                      <motion.div
                        key={src + i}
                        initial={{ opacity: 0, scale: 1.03 }}
                        animate={{ opacity: isLoaded[i] ? 1 : 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={src}
                          alt="FlowDesk App Screenshot"
                          fill
                          onLoad={() => handleLoad(i)}
                          className="object-cover object-top"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority={i === 0}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}

                {/* Progress bar at bottom of screenshot */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-10">
                  <motion.div
                    key={current}
                    className="h-full bg-[var(--color-primary)]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: INTERVAL_MS / 1000, ease: 'linear' }}
                  />
                </div>
              </div>

              {/* Slide dots below image */}
              <div className="flex items-center gap-2 justify-center mt-4">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === current
                        ? 'w-6 bg-[var(--color-primary)]'
                        : 'w-3 bg-[var(--color-border)]'
                    }`}
                    aria-label={`Screenshot ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
