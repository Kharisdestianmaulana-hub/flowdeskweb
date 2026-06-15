'use client';

import { GithubIcon as Github } from './GithubIcon';
import { ReleaseAsset } from '../types/github';
import { motion } from 'framer-motion';
import Reveal from './animations/Reveal';

interface HeroProps {
  stars: number;
  version: string;
  repoUrl: string;
  assets: ReleaseAsset[];
  dict: any;
}

export default function Hero({ stars, version, repoUrl, assets, dict }: HeroProps) {
  // Find macOS DMG asset for primary download button
  const macAsset = assets?.find(a => a.name.includes('.dmg'));

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col justify-center items-center overflow-hidden bg-[var(--color-bg)] py-24 px-4 sm:px-6 lg:px-8">
      {/* Animated Glow Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-[-10%] left-[10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-purple-600/30 rounded-full blur-[100px] md:blur-[150px]"
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[-10%] right-[10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-indigo-600/20 rounded-full blur-[100px] md:blur-[150px]"
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center z-10">
        <Reveal yOffset={60}>
          {/* Version Badge */}
          <div className="inline-flex items-center justify-center px-3 py-1 mb-8 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
            <span className="font-mono text-[13px] font-medium text-[var(--color-warning)] tracking-wide">
              {version.startsWith('v') ? version : `v${version}`}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1} yOffset={60}>
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-[800] leading-[1.2] tracking-[-0.03em] mb-6 text-transparent bg-clip-text bg-[image:var(--gradient-hero)]">
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
              href={macAsset ? macAsset.browser_download_url : '#download'}
              className="w-full sm:w-auto px-8 py-3.5 rounded-[var(--radius-md)] bg-[image:var(--gradient-cta)] text-white text-[15px] font-semibold shadow-[var(--shadow-btn)] hover:brightness-110 transition-all duration-200 text-center"
            >
              {dict.downloadMac}
            </a>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-[var(--radius-md)] bg-transparent border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:bg-[rgba(124,58,237,0.08)] transition-all duration-200 text-[15px] font-semibold"
            >
              <Github className="w-5 h-5" />
              <span>{dict.viewGithub}</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.4} yOffset={60}>
          {/* Stars */}
          <p className="text-sm font-medium text-[var(--color-text-muted)] mb-16">
            ★ {stars.toLocaleString()} {dict.stars}
          </p>

          {/* Platform Support */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['macOS', 'Windows'].map((platform) => (
              <span 
                key={platform} 
                className="px-3 py-1.5 text-xs font-medium text-[var(--color-text-accent)] bg-[var(--color-primary-light)] dark:bg-[var(--color-surface-raised)] rounded-full"
              >
                {platform}
              </span>
            ))}
            <span className="px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-full">
              Linux (Soon)
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
