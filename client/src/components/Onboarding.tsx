import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { EASE_OUT_QUINT } from '@/components/motion';
import { ONBOARDING_SECTION } from '@/content';

export default function Onboarding() {
  const reduced = useReducedMotion();

  return (
    <section
      id="onboarding"
      className="bg-background px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <motion.header
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="eyebrow">
            <span className="block h-px w-7 bg-primary/50" />
            {ONBOARDING_SECTION.eyebrow}
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[42px]">
            {ONBOARDING_SECTION.title}
          </h2>
          <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-foreground">
            {ONBOARDING_SECTION.subtitle}
          </p>
        </motion.header>

        <ol className="relative mt-14 sm:mt-16">
          {/* Trilho vertical contínuo, atrás dos marcadores. */}
          <span
            aria-hidden
            className="absolute left-[19px] top-3 bottom-3 w-px bg-line"
          />

          {ONBOARDING_SECTION.steps.map((step, i) => (
            <motion.li
              key={step.title}
              className="relative grid gap-x-6 gap-y-3 pb-12 pl-14 last:pb-0 md:grid-cols-[auto_1fr] md:pl-16"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: EASE_OUT_QUINT,
              }}
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-background text-[13px] font-semibold text-primary"
              >
                {i + 1}
              </span>

              <span className="text-[13px] font-medium uppercase tracking-[0.1em] text-muted-foreground md:w-28 md:pt-1">
                {step.week}
              </span>

              <div>
                <h3 className="text-[19px]">{step.title}</h3>
                <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-foreground">
                  {step.body}
                </p>
                <span className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-[13px] font-medium text-primary">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  {step.deliverable}
                </span>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
