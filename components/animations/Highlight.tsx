'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { cn } from './Reveal';

interface HighlightProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  color?: string;
}

export default function Highlight({ children, delay = 0.2, className, color = 'rgba(124, 58, 237, 0.2)' }: HighlightProps) {
  const ref = useRef<HTMLSpanElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end 90%", "start 60%"]
  });

  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (typeof children === 'string') {
    const words = children.split(' ');
    return (
      <span ref={ref} className={cn('inline', className)}>
        {words.map((word, i) => (
          <span key={i} className="relative inline-block px-1 mx-[0.1em]">
            <motion.span
              className="absolute inset-0 z-0 rounded-[4px]"
              style={{ backgroundColor: color, width }}
            />
            <span className="relative z-10">{word}</span>
          </span>
        ))}
      </span>
    );
  }

  return (
    <span ref={ref} className={cn('relative inline-block px-1.5 mx-1', className)}>
      <motion.span
        className="absolute inset-0 z-0 rounded-md"
        style={{ backgroundColor: color, width }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}
