'use client';

import { motion } from 'framer-motion';
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
    <div className="relative max-w-4xl mx-auto py-12">
      {/* Central Line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-[var(--color-border-subtle)] -translate-x-1/2" />

      <div className="space-y-16 relative">
        {data.map((item, index) => {
          const config = getStatusConfig(item.status);
          const Icon = config.icon;
          const isEven = index % 2 === 0;

          return (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={item.version}
              className="relative flex flex-col md:flex-row items-start md:justify-between w-full"
            >
              {/* Timeline Node */}
              <div className="absolute left-8 md:left-1/2 top-6 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className={`w-10 h-10 rounded-full border-4 border-[var(--color-bg)] ${config.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
              </div>

              {/* Left Side (Empty on mobile, content on desktop if even) */}
              <div className={`hidden md:block w-[calc(50%-3rem)] ${isEven ? 'text-right' : ''}`}>
                {isEven && (
                  <div className="pt-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] bg-[var(--color-surface-raised)] border border-[var(--color-border)] mb-3">
                      {item.quarter} • {item.version}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Card */}
              <div className={`w-[calc(100%-4rem)] ml-16 md:ml-0 md:w-[calc(50%-3rem)] ${isEven ? '' : 'text-left'}`}>
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
                  
                  <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed mb-6">
                    {item.description[lang] || item.description['en']}
                  </p>

                  <ul className="space-y-3">
                    {(item.items[lang] || item.items['en']).map((listItem, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${config.color} flex-shrink-0`} />
                        <span className="text-[14px] text-[var(--color-text-muted)] leading-relaxed">
                          {listItem}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
