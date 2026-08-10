import { motion } from 'framer-motion';
import { EASE_OUT_QUINT } from '@/components/motion';
import { ABOUT } from '@/content';

/**
 * A versão anterior usava a foto do time como fundo de tela cheia, com blur e
 * duas camadas de vinheta escura por cima só pra o texto branco ficar legível.
 * No tema claro isso não se sustenta — a foto vira um elemento de verdade,
 * ao lado do texto, sem overlay nenhum.
 */
export default function About() {
  const [before, after] = ABOUT.title.split(ABOUT.highlight);

  return (
    <section
      id="about"
      className="bg-background px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-32"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <motion.div
          className="order-2 lg:order-1"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="eyebrow">
            <span className="block h-px w-7 bg-primary/50" />
            {ABOUT.eyebrow}
          </span>

          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[42px]">
            {before}
            <span className="text-primary">{ABOUT.highlight}</span>
            {after}
          </h2>

          <div className="mt-6 space-y-4">
            {ABOUT.paragraphs.map((p) => (
              <p
                key={p.slice(0, 24)}
                className="max-w-[62ch] text-[16px] leading-relaxed text-foreground"
              >
                {p}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="order-1 lg:order-2"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <img
            src="/oticas/team.webp"
            alt="Time da B2Optic"
            loading="lazy"
            decoding="async"
            className="elevated aspect-[4/3] w-full rounded-2xl object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
