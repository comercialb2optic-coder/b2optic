import {
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { useRef } from 'react';

export function useParallax(speed: number = 0.2): {
  ref: React.RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
} {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ['start end', 'end start'],
  });

  // Só "reduzir movimento" desliga. O parallax é transform puro, roda na GPU
  // e não custa no celular — o corte por largura de tela era conservadorismo.
  const disabled = reduced;
  const amount = speed * 100;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    disabled ? [0, 0] : [amount, -amount],
  );

  return { ref, y };
}
