import { motion } from 'framer-motion';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const scrollToForm = () => {
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[88vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20">
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
          <motion.span
            className="relative flex h-1.5 w-1.5"
            aria-hidden
          >
            <span className="absolute inset-0 rounded-full bg-primary/60 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </motion.span>
          <span>+R$ 13M em vendas · +200 óticas atendidas</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-[44px] sm:text-6xl lg:text-[72px] font-semibold mb-6 tracking-[-0.025em] leading-[1.02] text-foreground"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
        >
          A <span className="text-primary">única aceleradora</span> de óticas que assume o{' '}
          <span className="text-primary">risco</span> por você.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-[17px] sm:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT }}
        >
          Esqueça leads frios e achismo comercial. Transformamos sua ótica em uma máquina
          previsível de vendas com captação qualificada, IA de atendimento e CRM próprio.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: EASE_OUT }}
        >
          <button
            type="button"
            onClick={scrollToForm}
            className="btn-primary group text-[15px] px-6 py-3.5"
          >
            <span>Quero escalar minha ótica</span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
