'use client';

import { Plus, Minus } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function FAQ({ dict }: { dict: any }) {
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <section className="py-24 sm:py-32 bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div 
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ease-out transform ${
            isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-[700] tracking-[-0.01em] text-[var(--color-text-primary)] mb-4">
            {dict.title}
          </h2>
          <p className="text-[18px] leading-[1.7] text-[var(--color-text-secondary)]">
            {dict.subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {dict.questions.map((item: { q: string; a: string }, index: number) => (
            <details key={index} className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                <h3 className="text-[16px] font-[600] text-[var(--color-text-primary)] pr-4">
                  {item.q}
                </h3>
                <div className="flex-shrink-0 text-[var(--color-text-muted)] group-open:text-[var(--color-primary)] transition-colors">
                  <Plus className="w-5 h-5 block group-open:hidden" />
                  <Minus className="w-5 h-5 hidden group-open:block" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0 text-[15px] leading-[1.7] text-[var(--color-text-secondary)]">
                {item.a}
              </div>
            </details>
          ))}
        </div>

      </div>
    </section>
  );
}
