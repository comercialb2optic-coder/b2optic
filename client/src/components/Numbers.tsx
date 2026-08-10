import { motion, useReducedMotion } from 'framer-motion';
import { CountUp, EASE_OUT_QUINT } from '@/components/motion';
import SectionBackdrop from '@/components/SectionBackdrop';
import { METRICS, NUMBERS_SECTION } from '@/content';

const STATS = [
  METRICS.oticas,
  METRICS.vendas,
  METRICS.leads,
  METRICS.anos,
] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Numbers() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-32">
      <SectionBackdrop variant="rings" origin="50% 50%" />
      <div className="relative mx-auto max-w-6xl">
        <motion.header
          className="mx-auto mb-14 max-w-2xl text-center sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="mb-5 flex justify-center">
            <span className="eyebrow">
              <span className="block h-px w-7 bg-primary/50" />
              {NUMBERS_SECTION.eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px]">
            {NUMBERS_SECTION.title}
          </h2>
        </motion.header>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
          {STATS.map((stat, i) => (
            <motion.li
              key={stat.word}
              variants={cardVariants}
              initial={reduced ? false : 'hidden'}
              whileInView={reduced ? undefined : 'visible'}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: EASE_OUT_QUINT,
              }}
            >
              <article className="card-surface h-full p-8 text-center sm:p-10">
                <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
                  <CountUp
                    to={stat.value}
                    prefix={stat.prefix}
                    suffix={'suffix' in stat ? stat.suffix : undefined}
                    duration={2000}
                    className="block whitespace-nowrap text-[clamp(44px,7vw,64px)] font-bold leading-[0.95] tracking-[-0.04em] text-primary"
                  />
                  <span className="text-[17px] font-semibold uppercase tracking-[0.08em] text-heading sm:text-[20px]">
                    {stat.word}
                  </span>
                </div>

                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {stat.sub}
                </p>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
