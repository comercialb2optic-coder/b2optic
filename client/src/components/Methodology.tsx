import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT_QUINT } from '@/components/motion';
import SectionBackdrop from '@/components/SectionBackdrop';
import { METHODOLOGY } from '@/content';

/**
 * A versão anterior desenhava um ciclo circular de 720×720 com os cards em
 * posição absoluta e altura travada em 140px — no desktop os cards saíam
 * cortados e o texto morria num `line-clamp-3`. Aqui a progressão é uma linha
 * do tempo: horizontal a partir de md, vertical no mobile. Sem altura fixa,
 * então o texto cabe inteiro em qualquer largura.
 */
export default function Methodology() {
  const reduced = useReducedMotion();

  return (
    <section
      id="metodologia"
      className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-32"
    >
      <SectionBackdrop variant="grid" origin="50% 40%" />
      <div className="relative mx-auto max-w-6xl">
        <motion.header
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="eyebrow">
            <span className="block h-px w-7 bg-primary/50" />
            {METHODOLOGY.eyebrow}
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[42px]">
            {METHODOLOGY.title}
          </h2>
          <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-foreground">
            {METHODOLOGY.subtitle}
          </p>
        </motion.header>

        <ol className="relative mt-14 grid grid-cols-1 gap-10 sm:mt-16 md:grid-cols-4 md:gap-6">
          {/* Trilho da linha do tempo — horizontal no desktop, vertical no
              mobile. Fica atrás dos marcadores. */}
          <span
            aria-hidden
            className="absolute left-[15px] top-2 bottom-2 w-px bg-line md:left-0 md:right-0 md:top-[15px] md:h-px md:w-auto md:bottom-auto"
          />

          {METHODOLOGY.steps.map((step, i) => (
            <motion.li
              key={step.number}
              className="relative pl-12 md:pl-0"
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
                className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-background text-[12px] font-semibold text-primary md:relative md:mb-6"
              >
                {step.number}
              </span>

              <h3 className="text-[17px] md:mt-0">{step.label}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-foreground">
                {step.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
