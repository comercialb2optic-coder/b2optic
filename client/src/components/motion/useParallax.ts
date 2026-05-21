import {
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { useRef } from 'react';
import { useIsMobile } from './useIsMobile';

export function useParallax(speed: number = 0.2): {
  ref: React.RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ['start end', 'end start'],
  });

  const disabled = reduced || isMobile;
  const amount = speed * 100;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    disabled ? [0, 0] : [amount, -amount],
  );

  return { ref, y };
}
