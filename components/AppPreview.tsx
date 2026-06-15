'use client';

import { useState } from 'react';
import Image from 'next/image';
import Reveal from './animations/Reveal';

export default function AppPreview({ dict }: { dict: any }) {
  const [isDark, setIsDark] = useState(true);

  return (
    <section id="preview" className="py-24 sm:py-32 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-[700] tracking-[-0.01em] text-[var(--color-text-primary)] mb-4">
              {dict.title}
            </h2>
            <p className="text-[18px] leading-[1.7] text-[var(--color-text-secondary)]">
              {dict.subtitle}
            </p>
          </div>
        </Reveal>

        {/* Mockup Container */}
        <Reveal delay={0.2}>
          <div className="max-w-5xl mx-auto">
            <div className="aspect-[16/10] w-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-elevated)] flex items-center justify-center relative overflow-hidden">
              <Image
                src={isDark ? '/screenshot-dark.png' : '/screenshot-light.png'}
                alt={dict.screenshot}
                fill
                className="object-cover object-top transition-opacity duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
              />
            </div>

            {/* Theme Toggles (Visual) */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
              <button 
                onClick={() => setIsDark(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isDark ? 'bg-[var(--color-primary)] border border-transparent text-white shadow-[var(--shadow-btn)]' : 'bg-transparent border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)]'}`}
              >
                {dict.darkMode}
              </button>
              <button 
                onClick={() => setIsDark(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!isDark ? 'bg-[var(--color-primary)] border border-transparent text-white shadow-[var(--shadow-btn)]' : 'bg-transparent border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)]'}`}
              >
                {dict.lightMode}
              </button>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
