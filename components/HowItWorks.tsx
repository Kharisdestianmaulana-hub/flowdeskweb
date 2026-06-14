'use client';

import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function HowItWorks({ dict }: { dict: any }) {
  const [ref, isIntersecting] = useIntersectionObserver();

  const steps = [
    { num: "01", title: dict.step1.title, desc: dict.step1.description },
    { num: "02", title: dict.step2.title, desc: dict.step2.description },
    { num: "03", title: dict.step3.title, desc: dict.step3.description },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[var(--color-surface)] border-t border-[var(--color-border-subtle)] relative overflow-hidden">
      
      {/* Decorative line connecting the steps */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-primary-glow)] to-transparent opacity-20 hidden lg:block -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          ref={ref}
          className={`text-center max-w-2xl mx-auto mb-20 transition-all duration-700 ease-out transform ${
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] shadow-[var(--shadow-elevated)] flex items-center justify-center mb-8 relative z-10 group-hover:border-[var(--color-primary)] transition-colors duration-300">
                <span className="text-2xl font-[800] text-[var(--color-primary)] font-mono">
                  {step.num}
                </span>
              </div>
              <h3 className="text-xl font-[600] text-[var(--color-text-primary)] mb-4">
                {step.title}
              </h3>
              <p className="text-[15px] leading-[1.6] text-[var(--color-text-muted)] max-w-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
