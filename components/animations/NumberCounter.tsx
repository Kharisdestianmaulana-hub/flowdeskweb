'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

export default function NumberCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  
  // Start animation when the component enters the viewport
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  
  // A spring config that creates a nice, fast roll-up effect (speedometer)
  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 75,
    damping: 15
  });
  
  // Format the number with locale string (e.g. 12,345 or 12.345 based on locale)
  const display = useTransform(spring, (current) => 
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
