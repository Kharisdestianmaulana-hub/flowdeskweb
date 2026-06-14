'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from './Reveal';

interface HighlightProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  color?: string;
}

export default function Highlight({ children, delay = 0.2, className, color = 'var(--color-primary)' }: HighlightProps) {
  return (
    <span className={cn('relative inline-block whitespace-nowrap', className)}>
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute bottom-0 left-0 h-[40%] z-0 rounded-sm opacity-60"
        style={{ backgroundColor: color }}
        initial={{ width: '0%' }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.8, 
          delay: delay, 
          ease: "easeInOut" 
        }}
      />
    </span>
  );
}
