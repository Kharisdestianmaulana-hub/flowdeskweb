'use client';

import { useState } from 'react';
import { ChevronDown, Terminal, Apple, Monitor, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InstallGuideAccordionProps {
  title: string;
  steps: string[];
  showLabel: string;
  hideLabel: string;
  platform: 'mac' | 'win' | 'linux';
}

export default function InstallGuideAccordion({
  title,
  steps,
  showLabel,
  hideLabel,
  platform,
}: InstallGuideAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const PlatformIcon = platform === 'mac' ? Apple : platform === 'win' ? Monitor : Terminal;

  const platformColor = {
    mac:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
    win:   'text-sky-400 bg-sky-500/10 border-sky-500/20',
    linux: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  }[platform];

  // Detect if a step contains a code snippet (starts with a command keyword)
  const isCodeLine = (step: string) =>
    /^(tar|cd|chmod|sudo|mv|\.\/|Extract|Navigate|Make|Run|Move)/i.test(step.trim());

  return (
    <div className={`rounded-[var(--radius-lg)] border ${isOpen ? 'border-[var(--color-primary)]/40' : 'border-[var(--color-border-subtle)]'} bg-[var(--color-bg)] overflow-hidden transition-colors`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left group"
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-6 h-6 rounded-md flex items-center justify-center border text-[11px] ${platformColor}`}>
            <PlatformIcon className="w-3.5 h-3.5" />
          </span>
          <span className="text-[13px] font-semibold text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
            {isOpen ? hideLabel : showLabel}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-[var(--color-text-muted)]"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-[var(--color-border-subtle)]">
              <p className="text-[12px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest pt-3 pb-3">
                {title}
              </p>
              <ol className="space-y-3">
                {steps.map((step, i) => {
                  // Split step text from code if it contains ": "
                  const colonIdx = step.indexOf(': ');
                  const hasInlineCode = colonIdx > -1 && step.substring(colonIdx + 2).trim().length > 0 && step.substring(colonIdx + 2).trim().split(' ').length <= 6;
                  const labelPart = hasInlineCode ? step.substring(0, colonIdx) : step;
                  const codePart = hasInlineCode ? step.substring(colonIdx + 2) : null;

                  return (
                    <li key={i} className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <span className="w-5 h-5 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-primary)] flex items-center justify-center">
                          {i + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                          {labelPart}
                        </p>
                        {codePart && (
                          <code className="mt-1.5 block w-full text-[12px] font-mono bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-md px-3 py-1.5 text-emerald-400 break-all">
                            {codePart}
                          </code>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
