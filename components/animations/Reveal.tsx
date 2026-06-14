'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  width?: 'fit-content' | '100%';
  yOffset?: number;
}

export default function Reveal({ children, delay = 0, className, width = '100%', yOffset = 40 }: RevealProps) {
  return (
    <div style={{ width }} className={cn('relative overflow-visible', className)}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: yOffset },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
