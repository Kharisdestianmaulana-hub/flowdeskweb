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

export default function Highlight({ children, delay = 0.2, className, color = 'rgba(124, 58, 237, 0.2)' }: HighlightProps) {
  return (
    <span className={cn('relative inline-block whitespace-nowrap px-1.5 mx-1', className)}>
      <motion.span
        className="absolute inset-0 z-0 rounded-md"
        style={{ backgroundColor: color }}
        initial={{ width: '0%' }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.6, 
          delay: delay, 
          ease: "easeOut" 
        }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}
