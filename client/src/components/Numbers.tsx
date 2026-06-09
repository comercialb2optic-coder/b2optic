import { motion, useReducedMotion } from 'framer-motion';
import { CountUp, EASE_OUT_QUINT } from '@/components/motion';

interface StatCard {
  prefix: string;
  to: number;
  suffix?: string;
  word: string;
  subtitle: string;
}

const STATS: StatCard[] = [
  {
    prefix: '+',
    to: 200,
    word: 'ÓTICAS',
    subtitle: 'já aceleram com a B2',
  },
  {
    prefix: '+R$ ',
    to: 13,
    word: 'MILHÕES',
    subtitle: 'em vendas geradas',
  },
  {
    prefix: '+',
    to: 40000,
    word: 'LEADS',
    subtitle: 'gerados para clientes todos os meses',
  },
  {
    prefix: '+',
    to: 4,
    word: 'ANOS',
    subtitle: 'no mercado óptico',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Numbers() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      data-backdrop-theme="ecosystem"
      className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 md:mb-20 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="mb-6 flex justify-center">
            <span className="eyebrow text-gradient-silver">
              <span className="block h-px w-7 bg-primary/50" />
              Resultados que comprovam
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.02em] leading-[1.05]">
            <span className="text-gradient">
              Números que falam por nós
            </span>
          </h2>
        </motion.div>

        {/* Cards grid — 1 col mobile, 2x2 desktop */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
          {STATS.map((stat, i) => (
            <motion.li
              key={stat.word}
              variants={cardVariants}
              initial={reduced ? false : 'hidden'}
              whileInView={reduced ? undefined : 'visible'}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.65,
                delay: i * 0.08,
                ease: EASE_OUT_QUINT,
              }}
            >
              <article className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-8 sm:p-10 transition-[border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-primary/35 hover:bg-card/70">
                {/* Top reflex */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/[0.04] to-transparent"
                />

                {/* Number + word — inline baseline, bloco centralizado */}
                <div className="relative flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-center">
                  <span className="block whitespace-nowrap text-[clamp(48px,8vw,72px)] font-bold leading-[0.95] tabular-nums">
                    <span className="text-gradient">
                      <CountUp
                        prefix={stat.prefix}
                        to={stat.to}
                        suffix={stat.suffix}
                        duration={2000}
                      />
                    </span>
                  </span>
                  <span className="text-[18px] sm:text-[22px] font-semibold uppercase tracking-[0.08em] text-card-foreground">
                    {stat.word}
                  </span>
                </div>

                {/* Subtitle */}
                <p className="relative mt-5 text-center text-[14px] sm:text-[15px] font-medium leading-relaxed text-muted-foreground">
                  {stat.subtitle}
                </p>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
