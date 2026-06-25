import Reveal from './animations/Reveal';
import { Shield, Wifi, Zap } from 'lucide-react';

interface AboutFlowDeskProps {
  dict: {
    title: string;
    description: string;
    highlights: {
      title: string;
      description: string;
    }[];
  };
}

export default function AboutFlowDesk({ dict }: AboutFlowDeskProps) {
  const icons = [
    <Shield key="shield" className="w-6 h-6 text-[var(--color-primary)]" />,
    <Wifi key="wifi" className="w-6 h-6 text-[var(--color-primary)]" />,
    <Zap key="zap" className="w-6 h-6 text-[var(--color-primary)]" />
  ];

  return (
    <section className="bg-[var(--color-bg)] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Description */}
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-[800] tracking-tight text-[var(--color-text-primary)] mb-6">
              {dict.title}
            </h2>
            <p className="text-[18px] sm:text-[20px] leading-relaxed text-[var(--color-text-secondary)]">
              {dict.description}
            </p>
          </div>
        </Reveal>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {dict.highlights.map((item, index) => (
            <Reveal key={index} delay={0.1 * (index + 1)}>
              <div className="h-full p-8 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors duration-300">
                <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-6">
                  {icons[index]}
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
