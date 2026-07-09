'use client';

import { useState, useEffect } from 'react';

type TocItem = {
  level: number;
  text: string;
  id: string;
};

export default function TableOfContents({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <aside className="hidden lg:block w-64 shrink-0 sticky top-32">
      <h4 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">
        On this page
      </h4>
      <ul className="space-y-3 text-sm">
        {toc.map((item, i) => {
          const isActive = activeId === item.id;
          return (
            <li key={i} className={`${item.level === 3 ? 'ml-4' : ''}`}>
              <a 
                href={`#${item.id}`} 
                className={`transition-colors line-clamp-2 ${isActive ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'}`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
