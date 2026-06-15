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

  return (
    <span ref={ref} className={cn('relative inline-block whitespace-nowrap px-1.5 mx-1', className)}>
      <motion.span
        className="absolute inset-0 z-0 rounded-md"
        style={{ backgroundColor: color, width }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}
