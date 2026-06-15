'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] sm:h-[3px] bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}
