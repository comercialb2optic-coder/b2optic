import { motion } from 'framer-motion';
import WordReveal from '@/components/motion/WordReveal';
import BlurFade from '@/components/motion/BlurFade';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const scrollToForm = () => {
    document
      .getElementById('form-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCases = () => {
    document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      data-backdrop-theme="hero"
      className="relative flex items-center justify-center overflow-hidden pt-28 pb-16 sm:min-h-screen sm:pb-20"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663538512901/kZM2v8qXuFHBjEWTxNfZYk/b2optic-hero-bg-oPMWKMdUzhf6n4sooowv7Z.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Tonal overlay — uniform darken */}
      <div className="absolute inset-0 z-10 bg-background/70" />

      {/* Bottom-fade overlay — section dies into background */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Stats card */}
        <BlurFade
          delay={0.05}
          duration={0.6}
          y={12}
          className="mb-9 flex justify-center"
        >
          <div className="relative">
            {/* Aurora glow — primary diluído atrás do card */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-6 sm:-inset-8 rounded-full bg-primary/[0.08] blur-2xl"
            />

            {/* Card */}
            <div className="relative inline-flex items-center gap-5 sm:gap-7 overflow-hidden rounded-2xl border border-primary/15 bg-white/[0.03] px-5 py-3.5 sm:px-6 sm:py-4 backdrop-blur-md">
              {/* Glass top reflex */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent"
              />

              {/* Stat 1 — número-herói em primary */}
              <div className="relative flex flex-col items-center text-center">
                <span className="text-[22px] sm:text-[26px] font-bold leading-none tracking-[-0.03em] text-primary tabular-nums">
                  +R$ 13M
                </span>
                <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.10em] text-gradient-silver sm:text-[11px] sm:tracking-[0.12em]">
                  em vendas geradas
                </span>
              </div>

              {/* Vertical divider */}
              <span
                aria-hidden
                className="relative h-8 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent"
              />

              {/* Stat 2 — branco forte */}
              <div className="relative flex flex-col items-center text-center">
                <span className="text-[22px] sm:text-[26px] font-bold leading-none tracking-[-0.03em] text-card-foreground tabular-nums">
                  +200
                </span>
                <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.10em] text-gradient-silver sm:text-[11px] sm:tracking-[0.12em]">
                  óticas aceleradas
                </span>
              </div>
            </div>
          </div>
        </BlurFade>

        {/* Headline — WordReveal palavra-por-palavra, gradient nas keywords */}
        <h1 className="text-[36px] sm:text-5xl lg:text-[60px] font-semibold mb-7 tracking-[-0.025em] leading-[1.05] text-foreground">
          <span className="block">
            <WordReveal
              text="Aumentamos o"
              delay={0.15}
              duration={0.6}
              as="span"
            />{' '}
            <WordReveal
              text="faturamento"
              delay={0.3}
              duration={0.6}
              as="span"
              className="text-gradient"
            />
          </span>
          <WordReveal
            text="da sua ótica com uma estrutura"
            delay={0.45}
            duration={0.6}
            as="span"
            className="block"
          />
          <span className="block">
            <WordReveal
              text="validada de"
              delay={0.62}
              duration={0.6}
              as="span"
            />{' '}
            <WordReveal
              text="marketing e vendas"
              delay={0.76}
              duration={0.6}
              as="span"
              className="text-gradient"
            />
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          className="text-[17px] sm:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease: EASE_OUT }}
        >
          Unimos estratégia, tecnologia e execução pra atrair clientes certos,
          conectar marketing e equipe de vendas e transformar isso em mais
          óculos vendidos no balcão.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2, ease: EASE_OUT }}
        >
          <button
            type="button"
            onClick={scrollToForm}
            className="btn-primary"
          >
            Quero escalar minha ótica
          </button>

          <button
            type="button"
            onClick={scrollToCases}
            className="btn-secondary"
          >
            Ver cases
          </button>
        </motion.div>
      </div>
    </section>
  );
}
