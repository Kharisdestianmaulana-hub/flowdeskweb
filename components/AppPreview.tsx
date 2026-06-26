'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from './animations/Reveal';

const SLIDES = ['/screenshot-dark.png', '/screenshot-light.png'];
const INTERVAL_MS = 5000;

export default function AppPreview({ dict }: { dict: any }) {
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean[]>([false, false]);

  // Auto-advance every 5 seconds
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

  return (
    <section id="preview" className="py-24 sm:py-32 bg-[var(--color-surface)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Text */}
          <Reveal yOffset={40}>
            <div className="flex flex-col justify-center">
              <span className="text-[12px] font-medium text-[var(--color-primary)] tracking-widest uppercase block mb-4">
                App Preview
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-[800] tracking-[-0.02em] leading-[1.15] text-[var(--color-text-primary)] mb-6">
                {dict.title}
              </h2>

              {/* Slide indicators */}
              <div className="flex gap-2 mt-8">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === current
                        ? 'w-8 bg-[var(--color-primary)]'
                        : 'w-4 bg-[var(--color-border)]'
                    }`}
                    aria-label={`Show screenshot ${i + 1}`}
                  />
                ))}
              </div>

              {/* Slide label */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={current}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 text-[13px] text-[var(--color-text-muted)]"
                >
                  {current === 0 ? (dict.darkMode ?? 'Dark Mode') : (dict.lightMode ?? 'Light Mode')}
                </motion.p>
              </AnimatePresence>
            </div>
          </Reveal>

          {/* Right: Image slideshow */}
          <Reveal delay={0.15} yOffset={40}>
            <div className="relative w-full aspect-[16/10] rounded-[var(--radius-xl)] overflow-hidden border border-[var(--color-border)] shadow-[var(--shadow-elevated)] bg-[var(--color-surface-raised)]">
              {/* Preload both images, show only current */}
              {SLIDES.map((src, i) => (
                <AnimatePresence key={src} mode="wait">
                  {i === current && (
                    <motion.div
                      key={src}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: isLoaded[i] ? 1 : 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={src}
                        alt={dict.screenshot ?? 'App Screenshot'}
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

              {/* Progress bar at bottom of image */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-border-subtle)]">
                <motion.div
                  key={current}
                  className="h-full bg-[var(--color-primary)]"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: INTERVAL_MS / 1000, ease: 'linear' }}
                />
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
