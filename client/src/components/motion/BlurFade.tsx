import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE_OUT_QUINT } from './ease';

interface BlurFadeProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  blur?: number;
  className?: string;
  once?: boolean;
  margin?: string;
}

export default function BlurFade({
  children,
  delay = 0,
  duration = 0.6,
  y = 20,
  blur = 10,
  className,
  once = true,
  margin = '-80px',
}: BlurFadeProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const useBlur = blur > 0;

  const initial = useBlur
    ? { opacity: 0, y, filter: `blur(${blur}px)` }
    : { opacity: 0, y };

  const animate = useBlur
    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
    : { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once, margin }}
      transition={{ duration, delay, ease: EASE_OUT_QUINT }}
    >
      {children}
    </motion.div>
  );
}
