'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 bottom-0 w-[2px] sm:w-[3px] bg-gradient-to-b from-purple-500 via-blue-500 to-emerald-500 origin-top z-[100]"
      style={{ scaleY }}
    />
  );
}
