import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useRef } from 'react';
import { EASE_OUT_QUINT } from './ease';

interface WordRevealProps {
  text: string;
  scrollLinked?: boolean;
  stagger?: number;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
}

export default function WordReveal({
  text,
  scrollLinked = false,
  stagger = 0.04,
  delay = 0,
  duration = 0.5,
  className,
  as = 'span',
}: WordRevealProps) {
  const reduced = useReducedMotion();
  const Tag = as;

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(' ');

  if (scrollLinked) {
    return (
      <ScrollLinkedReveal words={words} className={className} as={as} />
    );
  }

  return (
    <Tag className={className}>
      {words.map((word, i) => {
        return (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: EASE_OUT_QUINT,
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        );
      })}
    </Tag>
  );
}

function ScrollLinkedReveal({
  words,
  className,
  as = 'span',
}: {
  words: string[];
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
}) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ['start 85%', 'start 35%'],
  });
  const Tag = as as 'span';

  return (
    <Tag
      ref={ref as React.RefObject<HTMLSpanElement>}
      className={className}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(1, (i + 1) / words.length);
        return (
          <ScrollWord
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
            last={i === words.length - 1}
          />
        );
      })}
    </Tag>
  );
}

function ScrollWord({
  word,
  progress,
  range,
  last,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  last: boolean;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
      {!last ? ' ' : ''}
    </motion.span>
  );
}
