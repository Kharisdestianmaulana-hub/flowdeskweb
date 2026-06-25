'use client';

import { User, Users, Shield } from 'lucide-react';
import Reveal from './animations/Reveal';

export default function UseCases({ dict }: { dict: any }) {

  const cases = [
    {
      id: 'solo',
      icon: User,
      title: dict.solo.title,
      description: dict.solo.description,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      id: 'teams',
      icon: Users,
      title: dict.teams.title,
      description: dict.teams.description,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    {
      id: 'privacy',
      icon: Shield,
      title: dict.privacy.title,
      description: dict.privacy.description,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-[var(--color-primary)] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-[700] tracking-[-0.01em] text-white mb-4">
              {dict.title}
            </h2>
            <p className="text-[18px] leading-[1.7] text-white/80">
              {dict.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.id} delay={0.2 + (index * 0.1)}>
                <div className="bg-white/10 border border-white/10 rounded-[var(--radius-xl)] p-8 flex flex-col items-center text-center hover:border-white/30 transition-colors duration-300 shadow-md h-full backdrop-blur-md">
                  <div className={`w-16 h-16 rounded-full ${item.bg} flex items-center justify-center mb-6`}>
                    <Icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-[600] text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-white/70">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
