'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { CheckCircle2, Clock, CircleDashed } from 'lucide-react';

interface RoadmapItem {
  quarter: string;
  status: 'completed' | 'in-progress' | 'planned';
  version: string;
  title: Record<string, string>;
  description: Record<string, string>;
  items: Record<string, string[]>;
}

interface RoadmapTimelineProps {
  data: RoadmapItem[];
  lang: string;
  dict: any;
}

export default function RoadmapTimeline({ data, lang, dict }: RoadmapTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-500',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/20',
          label: dict.status.completed
        };
      case 'in-progress':
        return {
          icon: Clock,
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500/20',
          label: dict.status['in-progress']
        };
      default:
        return {
          icon: CircleDashed,
          color: 'text-[var(--color-text-muted)]',
          bgColor: 'bg-[var(--color-surface-raised)]',
          borderColor: 'border-[var(--color-border-subtle)]',
          label: dict.status.planned
        };
    }
  };

  return (
    <div ref={containerRef} className="relative max-w-4xl mx-auto py-12">
      {/* Background Line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-[var(--color-border-subtle)] -translate-x-1/2" />
      
      {/* Animated Foreground Line */}
      <motion.div 
        className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500 via-blue-500 to-emerald-500 origin-top -translate-x-1/2 z-0" 
        style={{ scaleY }}
      />

      <div className="space-y-16 relative">
        {data.map((item, index) => {
          const config = getStatusConfig(item.status);
          const Icon = config.icon;
          const isEven = index % 2 === 0;

          return (
            <div 
              key={item.version}
              className={`relative flex flex-col md:flex-row items-start md:justify-between w-full ${!isEven ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Timeline Node */}
              <motion.div 
                initial={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-bg)' }}
                whileInView={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-bg)' }}
                viewport={{ once: true, margin: "-50% 0px -50% 0px" }}
                className="absolute left-8 md:left-1/2 top-6 -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  whileInView={{ scale: 1, opacity: 1, boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}
                  viewport={{ once: true, margin: "-50% 0px -50% 0px" }}
                  transition={{ duration: 0.4 }}
                  className={`w-10 h-10 rounded-full border-4 border-[var(--color-bg)] ${config.bgColor} flex items-center justify-center transition-colors`}
                >
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </motion.div>
              </motion.div>

              {/* Left Side (Empty on mobile, content on desktop) */}
              <div className={`hidden md:block w-[calc(50%-3rem)] ${isEven ? 'text-right' : 'text-left'}`}>
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50% 0px -50% 0px" }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="pt-3"
                >
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] bg-[var(--color-surface-raised)] border border-[var(--color-border)] mb-3 shadow-[var(--shadow-card)]">
                    {item.quarter} • {item.version}
                  </span>
                </motion.div>
              </div>

              {/* Content Card */}
              <motion.div 
                initial={{ opacity: 0, x: isEven ? 30 : -30, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-50% 0px -50% 0px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`w-[calc(100%-4rem)] ml-16 md:ml-0 md:w-[calc(50%-3rem)] ${isEven ? 'text-left' : 'text-right'}`}
              >
                {/* Mobile Meta (Hidden on Desktop for Even) */}
                <div className={`mb-3 md:${isEven ? 'hidden' : 'block'}`}>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
                    {item.quarter} • {item.version}
                  </span>
                </div>

                <div className={`p-6 rounded-[var(--radius-xl)] border bg-[var(--color-surface)] ${config.borderColor} shadow-[var(--shadow-card)] relative overflow-hidden group hover:border-[var(--color-primary)] transition-colors`}>
                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-semibold ${config.color} uppercase tracking-wider`}>
                      {config.label}
                    </span>
                  </div>

                  <h3 className="text-xl font-[800] text-[var(--color-text-primary)] tracking-tight mb-2">
                    {item.title[lang] || item.title['en']}
                  </h3>
                  
                  <p className={`text-[15px] text-[var(--color-text-secondary)] leading-relaxed mb-6 ${isEven ? 'text-left' : 'text-right'}`}>
                    {item.description[lang] || item.description['en']}
                  </p>

                  <ul className={`space-y-3 flex flex-col ${isEven ? 'items-start' : 'items-end'}`}>
                    {(item.items[lang] || item.items['en']).map((listItem, i) => (
                      <li key={i} className={`flex items-start gap-3 ${isEven ? 'flex-row' : 'flex-row-reverse text-right'}`}>
                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${config.color} flex-shrink-0`} />
                        <span className="text-[14px] text-[var(--color-text-muted)] leading-relaxed">
                          {listItem}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
