import { motion } from 'framer-motion';
import {
  BlurFade,
  CountUp,
  StaggerGroup,
  EASE_OUT_QUINT,
} from '@/components/motion';

interface Stat {
  prefix?: string;
  to: number;
  suffix?: string;
  decimals?: number;
  label: string;
}

const STATS: Stat[] = [
  { prefix: '+R$ ', to: 13, suffix: 'M', label: 'em vendas geradas' },
  { prefix: '+', to: 200, label: 'óticas aceleradas' },
  { prefix: 'R$ ', to: 6.8, decimals: 2, label: 'custo médio por lead' },
  { prefix: '+R$ ', to: 47382, label: 'numa ótica em 30 dias' },
];

export default function Numbers() {
  return (
    <section
      data-backdrop-theme="ecosystem"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16 sm:mb-20 max-w-2xl mx-auto"
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

        <StaggerGroup
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 sm:gap-y-14"
          stagger={0.12}
        >
          {STATS.map((stat, i) => (
            <BlurFade
              key={i}
              className="transform-gpu will-change-transform"
            >
              <div className="flex flex-col items-start gap-4">
                <span className="block text-[44px] sm:text-[64px] lg:text-[80px] font-bold tracking-[-0.04em] leading-[0.95] text-primary tabular-nums">
                  <CountUp
                    to={stat.to}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    duration={1600}
                  />
                </span>
                <span className="text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.16em] text-muted-foreground leading-tight">
                  {stat.label}
                </span>
              </div>
            </BlurFade>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
