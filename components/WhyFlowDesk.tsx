'use client';

import { Check, X } from 'lucide-react';
import Reveal from './animations/Reveal';

export default function WhyFlowDesk({ dict }: { dict: any }) {

  return (
    <section id="why" className="py-24 sm:py-32 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        {/* Header */}
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-[700] tracking-[-0.01em] text-[var(--color-text-primary)] mb-6">
              {dict.title}
            </h2>
            <p className="text-[18px] leading-[1.7] text-[var(--color-text-secondary)]">
              {dict.subtitle}
            </p>
          </div>
        </Reveal>

        {/* Comparison Table */}
        <Reveal delay={0.2}>
          <div className="max-w-4xl mx-auto -mx-4 px-4 sm:mx-auto sm:px-0 overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="p-4 border-b border-[var(--color-border-subtle)] text-[var(--color-text-muted)] font-medium w-[40%]"></th>
                <th className="p-4 border-b-2 border-[var(--color-primary)] text-[var(--color-text-primary)] font-[700] text-[18px] bg-[var(--color-surface)] rounded-t-[var(--radius-md)] text-center w-[20%]">FlowDesk</th>
                <th className="p-4 border-b border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] font-medium text-center w-[20%]">Notion</th>
                <th className="p-4 border-b border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] font-medium text-center w-[20%]">Linear</th>
              </tr>
            </thead>
            <tbody className="text-[16px]">
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="p-4 font-medium text-[var(--color-text-primary)]">{dict.table.offline}</td>
                <td className="p-4 text-center bg-[var(--color-surface)] border-x border-[var(--color-primary-glow)]"><Check className="w-5 h-5 mx-auto text-[var(--color-success)]" /></td>
                <td className="p-4 text-center opacity-50"><X className="w-5 h-5 mx-auto text-[var(--color-error)]" /></td>
                <td className="p-4 text-center opacity-50"><X className="w-5 h-5 mx-auto text-[var(--color-error)]" /></td>
              </tr>
              <tr className="bg-[var(--color-surface-raised)] border-b border-[var(--color-border-subtle)]">
                <td className="p-4 font-medium text-[var(--color-text-primary)]">{dict.table.noSub}</td>
                <td className="p-4 text-center bg-[var(--color-surface)] border-x border-[var(--color-primary-glow)]"><Check className="w-5 h-5 mx-auto text-[var(--color-success)]" /></td>
                <td className="p-4 text-center opacity-50"><X className="w-5 h-5 mx-auto text-[var(--color-error)]" /></td>
                <td className="p-4 text-center opacity-50"><X className="w-5 h-5 mx-auto text-[var(--color-error)]" /></td>
              </tr>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <td className="p-4 font-medium text-[var(--color-text-primary)]">{dict.table.lan}</td>
                <td className="p-4 text-center bg-[var(--color-surface)] border-x border-[var(--color-primary-glow)]"><Check className="w-5 h-5 mx-auto text-[var(--color-success)]" /></td>
                <td className="p-4 text-center opacity-50"><X className="w-5 h-5 mx-auto text-[var(--color-error)]" /></td>
                <td className="p-4 text-center opacity-50"><X className="w-5 h-5 mx-auto text-[var(--color-error)]" /></td>
              </tr>
              <tr className="bg-[var(--color-surface-raised)] border-b border-[var(--color-border-subtle)]">
                <td className="p-4 font-medium text-[var(--color-text-primary)]">{dict.table.selfHost}</td>
                <td className="p-4 text-center bg-[var(--color-surface)] border-x border-[var(--color-primary-glow)]">
                  <div className="flex items-center justify-center space-x-1.5">
                    <Check className="w-5 h-5 text-[var(--color-success)]" />
                    <span className="text-[var(--color-success)] font-medium text-sm">(v2.0)</span>
                  </div>
                </td>
                <td className="p-4 text-center opacity-50"><X className="w-5 h-5 mx-auto text-[var(--color-error)]" /></td>
                <td className="p-4 text-center opacity-50"><X className="w-5 h-5 mx-auto text-[var(--color-error)]" /></td>
              </tr>
            </tbody>
          </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
