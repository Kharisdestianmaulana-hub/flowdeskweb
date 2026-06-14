'use client';

import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Lock, Command, FolderKanban, FileText, Wifi, Users, Folder, UserCheck, Database, ShieldCheck } from 'lucide-react';

export default function Features({ dict }: { dict: any }) {
  const [ref, isIntersecting] = useIntersectionObserver();

  const featureIcons = [
    Lock,
    Command,
    FolderKanban,
    FileText,
    Wifi,
    Users,
    Folder,
    UserCheck,
    Database,
    ShieldCheck
  ];

  return (
    <section id="features" className="py-24 sm:py-32 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div 
          ref={ref}
          className={`max-w-3xl mx-auto text-center mb-16 sm:mb-20 transition-all duration-700 ease-out transform ${
            isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-[800] tracking-tight text-[var(--color-text-primary)]">
            {dict.title}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {dict.items.map((feature: any, idx: number) => {
            const Icon = featureIcons[idx % featureIcons.length];
            return (
              <div 
                key={idx}
                className="group relative p-8 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-glow)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-[var(--radius-lg)] pointer-events-none" />
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-primary-glow)] flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-xl font-[700] tracking-tight text-[var(--color-text-primary)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[16px] leading-[1.6] text-[var(--color-text-secondary)]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
