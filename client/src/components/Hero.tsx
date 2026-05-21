import { motion } from 'framer-motion';
import WordReveal from '@/components/motion/WordReveal';

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
      className="relative min-h-[88vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20"
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
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          className="badge-pill mb-9 justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE_OUT }}
        >
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="absolute inset-0 rounded-full bg-primary/60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span>+R$ 13M em vendas · +200 óticas atendidas</span>
        </motion.div>

        {/* Headline — WordReveal por linha, "óculos." em primary */}
        <h1 className="text-[44px] sm:text-6xl lg:text-[72px] font-semibold mb-7 tracking-[-0.025em] leading-[1.02] text-foreground">
          <WordReveal
            text="Não vendemos leads."
            delay={0.15}
            duration={0.6}
            as="span"
            className="block"
          />
          <WordReveal
            text="Fazemos sua ótica"
            delay={0.32}
            duration={0.6}
            as="span"
            className="block"
          />
          <span className="block">
            <WordReveal
              text="vender mais"
              delay={0.5}
              duration={0.6}
              as="span"
            />{' '}
            <WordReveal
              text="óculos."
              delay={0.62}
              duration={0.6}
              as="span"
              className="text-primary"
            />
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          className="text-[17px] sm:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE_OUT }}
        >
          Assessoria de marketing e vendas pra ótica. Captação qualificada,
          estrutura comercial e venda finalizada no balcão — costurados pra
          um só resultado.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05, ease: EASE_OUT }}
        >
          <button
            type="button"
            onClick={scrollToForm}
            className="btn-primary group text-[15px] px-6 py-3.5 w-full sm:w-auto"
          >
            <span>Quero escalar minha ótica</span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>

          <button
            type="button"
            onClick={scrollToCases}
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-white/12 bg-white/[0.02] px-6 py-3.5 text-[15px] font-medium text-foreground/90 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.05] hover:text-foreground"
          >
            <span>Ver cases</span>
            <span
              aria-hidden
              className="text-foreground/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-foreground/70"
            >
              →
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
