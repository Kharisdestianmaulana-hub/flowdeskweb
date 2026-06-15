'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface StackedCardProps {
  children: React.ReactNode;
  zIndex: number;
  bgClass?: string;
  isLast?: boolean;
}

export default function StackedCard({ children, zIndex, bgClass = 'bg-[var(--color-bg)]', isLast = false }: StackedCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track the scroll progress of THIS specific card.
  // We want to scale it down slightly when the NEXT card starts covering it.
  // Since it is sticky, it stays at top:0 while the page continues to scroll.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // "start start" means when the top of this container hits the top of the viewport
    // "end start" means when the bottom of this container hits the top of the viewport
    offset: ["start start", "end start"]
  });

  // Scale from 1 to 0.9 as user scrolls down
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <div 
      ref={containerRef} 
      className={`sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden ${bgClass}`}
      style={{ zIndex }}
    >
      <motion.div 
        style={!isLast ? { scale, opacity } : {}}
        className="w-full h-full overflow-hidden flex flex-col justify-center"
      >
        {/* Children will be centered vertically without internal scrollbars */}
        <div className="w-full">
          {children}
        </div>
      </motion.div>
      
      {/* Top shadow overlay to simulate depth from the card above */}
      {zIndex > 10 && (
        <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-50" />
      )}
    </div>
  );
}
