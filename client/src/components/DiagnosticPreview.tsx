import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT_QUINT } from '@/components/motion';
import SectionBackdrop from '@/components/SectionBackdrop';
import { DIAGNOSTIC_PREVIEW } from '@/content';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function DiagnosticPreview() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      id="diagnostico"
      className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-32"
    >
      <SectionBackdrop variant="dots" origin="50% 10%" />
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
              {DIAGNOSTIC_PREVIEW.eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px]">
            {DIAGNOSTIC_PREVIEW.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] text-[16px] leading-relaxed text-foreground">
            {DIAGNOSTIC_PREVIEW.subtitle}
          </p>
        </motion.header>

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {DIAGNOSTIC_PREVIEW.items.map((item, i) => (
            <motion.li
              key={item.index}
              variants={cardVariants}
              initial={reduced ? false : 'hidden'}
              whileInView={reduced ? undefined : 'visible'}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: EASE_OUT_QUINT,
              }}
            >
              <article className="card-surface h-full p-7">
                <span className="badge-pill">Passo {item.index}</span>
                <h3 className="mt-5 text-[18px]">{item.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-foreground">
                  {item.body}
                </p>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
