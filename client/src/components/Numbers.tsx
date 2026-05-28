import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { BlurFade, CountUp, EASE_OUT_QUINT } from '@/components/motion';

interface SupportStat {
  prefix?: string;
  to: number;
  suffix?: string;
  decimals?: number;
  label: string;
  badge?: string;
}

const SUPPORT_STATS: SupportStat[] = [
  { prefix: 'R$ ', to: 6.8, decimals: 2, label: 'custo médio por lead' },
  { prefix: '+', to: 200, label: 'óticas aceleradas no Brasil' },
  {
    prefix: '+R$ ',
    to: 47382,
    label: 'em 30 dias numa ótica',
    badge: 'resultado real',
  },
];

export default function Numbers() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef as React.RefObject<HTMLElement>,
    offset: ['start 85%', 'center 55%'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.55, 1]);

  return (
    <section
      ref={sectionRef}
      data-backdrop-theme="ecosystem"
      className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 md:mb-20 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="mb-6 flex justify-center">
            <span className="eyebrow">
              <span className="block h-px w-7 bg-primary/50" />
              Números que comprovam
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.02em] leading-[1.05] text-foreground">
            Nossos resultados falam por nós
          </h2>
        </motion.div>

        {/* Scroll-linked wrapper — números sobem e ganham nitidez ao passar pelo centro */}
        <motion.div
          style={reduced ? undefined : { y, opacity }}
          className="transform-gpu will-change-transform"
        >
          {/* HERO */}
          <BlurFade duration={0.7} y={16}>
            <div className="relative flex flex-col items-center text-center">
              {/* Aurora glow — mais presente que nos demais */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[88%] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.10] blur-3xl"
              />
              <span className="relative block whitespace-nowrap text-[clamp(56px,13vw,140px)] font-extrabold leading-[0.95] tracking-[-0.04em] text-primary tabular-nums">
                <CountUp prefix="+R$ " to={13} suffix="M" duration={2400} />
              </span>
              <span className="relative mt-5 max-w-md text-[12px] font-medium uppercase leading-snug tracking-[0.16em] text-muted-foreground sm:mt-6 sm:text-[13px]">
                em vendas geradas para óticas parceiras
              </span>
            </div>
          </BlurFade>

          {/* Respiro entre o herói e o trio */}
          <div className="mt-14 sm:mt-20 md:mt-24" />

          {/* SUPPORT trio */}
          <ul className="grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-0 lg:gap-x-12">
            {SUPPORT_STATS.map((stat, i) => (
              <BlurFade key={i} delay={0.08 + i * 0.08} duration={0.6} y={14}>
                <li className="flex flex-col items-center text-center">
                  <span className="block whitespace-nowrap text-[34px] font-bold leading-none tracking-[-0.03em] text-card-foreground tabular-nums sm:text-[40px] lg:text-[48px]">
                    <CountUp
                      prefix={stat.prefix}
                      to={stat.to}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                      duration={1600}
                    />
                  </span>
                  <span className="mt-4 flex min-h-[2.75rem] max-w-[18ch] items-start justify-center text-[11px] font-medium uppercase leading-snug tracking-[0.16em] text-muted-foreground sm:text-[12px]">
                    {stat.label}
                  </span>
                  {stat.badge && (
                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/[0.06] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-primary/90">
                      <span aria-hidden className="h-1 w-1 rounded-full bg-primary" />
                      {stat.badge}
                    </span>
                  )}
                </li>
              </BlurFade>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
