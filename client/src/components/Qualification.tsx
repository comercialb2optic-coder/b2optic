import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { EASE_OUT_QUINT } from '@/components/motion';
import { QUALIFICATION } from '@/content';

export default function Qualification() {
  const [marcadas, setMarcadas] = useState<boolean[]>(() =>
    QUALIFICATION.options.map(() => false),
  );
  const reduce = useReducedMotion();

  const toggle = (i: number) =>
    setMarcadas((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const total = marcadas.filter(Boolean).length;
  const atingiu = total >= QUALIFICATION.threshold;

  const scrollToForm = () => {
    document
      .getElementById('form-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: EASE_OUT_QUINT },
    viewport: { once: true, margin: '-80px' },
  });

  return (
    <section
      id="qualification"
      className="bg-surface px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <motion.header className="text-center" {...rise(0)}>
          <div className="mb-5 flex justify-center">
            <span className="eyebrow">
              <span className="block h-px w-7 bg-primary/50" />
              {QUALIFICATION.eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px]">
            {QUALIFICATION.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[55ch] text-[16px] leading-relaxed text-foreground">
            {QUALIFICATION.instruction}
          </p>
        </motion.header>

        <div className="mt-10 space-y-3 sm:mt-12">
          {QUALIFICATION.options.map((texto, i) => {
            const ativo = marcadas[i];
            return (
              <motion.button
                key={texto}
                type="button"
                role="checkbox"
                aria-checked={ativo}
                onClick={() => toggle(i)}
                className={`flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left transition-[border-color,background-color] duration-240 ${
                  ativo
                    ? 'border-primary bg-primary-soft'
                    : 'border-line bg-card hover:border-line-strong'
                }`}
                {...rise(0.16 + i * 0.06)}
              >
                <span
                  aria-hidden
                  className={`mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-[border-color,background-color] duration-240 ${
                    ativo
                      ? 'border-primary bg-primary text-white'
                      : 'border-line-strong bg-background text-transparent'
                  }`}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-[15px] leading-relaxed text-heading sm:text-base">
                  {texto}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* O fecho só ganha destaque depois que ele próprio se qualificou —
            até lá fica neutro, sem afirmar nada por ele. */}
        <motion.p
          className={`mx-auto mt-10 max-w-[55ch] text-center text-[17px] leading-relaxed transition-colors duration-300 sm:text-[19px] ${
            atingiu ? 'text-heading' : 'text-muted-foreground'
          }`}
          {...rise(0.16 + QUALIFICATION.options.length * 0.06)}
          aria-live="polite"
        >
          <span className={atingiu ? 'font-semibold text-primary' : undefined}>
            {QUALIFICATION.closingHighlight}
          </span>{' '}
          {QUALIFICATION.closingRest}
        </motion.p>

        <motion.div
          className="mt-8 flex justify-center"
          {...rise(0.24 + QUALIFICATION.options.length * 0.06)}
        >
          <button type="button" onClick={scrollToForm} className="btn-primary">
            {QUALIFICATION.cta}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
