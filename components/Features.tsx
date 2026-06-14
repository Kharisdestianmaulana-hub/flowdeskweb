'use client';

import { Lock, Command, FolderKanban, FileText, Wifi, Users, Folder, UserCheck, Database, ShieldCheck } from 'lucide-react';
import Reveal from './animations/Reveal';
import Highlight from './animations/Highlight';
import { motion } from 'framer-motion';

export default function Features({ dict }: { dict: any }) {

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
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-[800] tracking-tight text-[var(--color-text-primary)]">
              <Highlight color="rgba(124, 58, 237, 0.4)">
                {dict.title}
              </Highlight>
            </h2>
          </div>
        </Reveal>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {dict.items.map((feature: any, idx: number) => {
            const Icon = featureIcons[idx % featureIcons.length];
            return (
              <Reveal key={idx} delay={0.1 * (idx % 4)}>
                <motion.div 
                  whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2, z: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ transformPerspective: 1000 }}
                  className="group relative p-8 h-full rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-colors duration-300 shadow-sm hover:shadow-[var(--shadow-card-hover)]"
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
                </motion.div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
